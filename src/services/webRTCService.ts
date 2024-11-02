import { MutableRefObject } from 'react';

export class WebRTCService {
    private peerConnection: RTCPeerConnection | null = null;
    private iceCandidateQueue: RTCIceCandidateInit[] = [];
    private targetId: string | null = null;
    private isEnabled: boolean = false;

    // Audio context and analyzers for both local and remote streams
    private audioContext: AudioContext | null = null;
    private localAudioAnalyser: AnalyserNode | null = null;
    private remoteAudioAnalyser: AnalyserNode | null = null;
    private localDataArray: Uint8Array | null = null;
    private remoteDataArray: Uint8Array | null = null;
    private localAnimationFrameId: number | null = null;
    private remoteAnimationFrameId: number | null = null;

    // Static debug flags
    private static DEBUG_LOCAL_AUDIO = false;
    private static DEBUG_REMOTE_AUDIO = true;

    constructor(
        private readonly chatService: any,
        private readonly isVoiceEnabledRef: MutableRefObject<boolean>,
        private readonly onRemoteStream: (stream: MediaStream) => void,
        private readonly onAudioLevel?: (localLevel: number, remoteLevel: number) => void
    ) { }

    // Static methods to control debugging
    public static enableLocalAudioDebug(enable: boolean) {
        WebRTCService.DEBUG_LOCAL_AUDIO = enable;
        console.log(`Local audio debugging ${enable ? 'enabled' : 'disabled'}`);
    }

    public static enableRemoteAudioDebug(enable: boolean) {
        WebRTCService.DEBUG_REMOTE_AUDIO = enable;
        console.log(`Remote audio debugging ${enable ? 'enabled' : 'disabled'}`);
    }

    async setupConnection() {
        if (this.peerConnection) return;
        console.log("Setting up WebRTC connection...");

        this.peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate && this.targetId && this.isVoiceEnabledRef.current) {
                console.log("Sending ICE candidate:", event.candidate);
                this.chatService.sendIceCandidate(this.targetId, event.candidate);
            }
        };

        this.peerConnection.ontrack = (event) => {
            console.log("Received remote track:", event);
            try {
                const [remoteStream] = event.streams;
                this.setupRemoteAudioAnalyser(remoteStream);
                this.onRemoteStream(remoteStream);
            } catch (error) {
                console.error("Error handling remote track:", error);
            }
        };
    }

    private async getLocalStream(): Promise<MediaStream | null> {
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            console.log("Obtained local media stream:", localStream);

            if (WebRTCService.DEBUG_LOCAL_AUDIO) {
                this.setupLocalAudioAnalyser(localStream);
            }

            return localStream;
        } catch (error) {
            console.error("Error obtaining local media stream:", error);
            return null;
        }
    }

    private setupLocalAudioAnalyser(stream: MediaStream) {
        try {
            if (!this.audioContext) {
                this.audioContext = new AudioContext();
            }

            this.localAudioAnalyser = this.audioContext.createAnalyser();
            this.localAudioAnalyser.fftSize = 256;
            this.localAudioAnalyser.smoothingTimeConstant = 0.5;

            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.localAudioAnalyser);

            const bufferLength = this.localAudioAnalyser.frequencyBinCount;
            this.localDataArray = new Uint8Array(bufferLength);

            console.log('🎛️ Local audio analyzer setup complete:', {
                bufferLength,
                sampleRate: this.audioContext.sampleRate,
                fftSize: this.localAudioAnalyser.fftSize,
                timeStamp: new Date().toISOString()
            });

            this.startLocalAudioMonitoring();
        } catch (error) {
            console.error('❌ Error setting up local audio analyser:', error);
        }
    }

    private setupRemoteAudioAnalyser(stream: MediaStream) {
        try {
            if (!this.audioContext) {
                this.audioContext = new AudioContext();
            }

            this.remoteAudioAnalyser = this.audioContext.createAnalyser();
            this.remoteAudioAnalyser.fftSize = 256;
            this.remoteAudioAnalyser.smoothingTimeConstant = 0.5;

            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.remoteAudioAnalyser);

            const bufferLength = this.remoteAudioAnalyser.frequencyBinCount;
            this.remoteDataArray = new Uint8Array(bufferLength);

            console.log('🎛️ Remote audio analyzer setup complete:', {
                bufferLength,
                sampleRate: this.audioContext.sampleRate,
                fftSize: this.remoteAudioAnalyser.fftSize,
                timeStamp: new Date().toISOString()
            });

            this.startRemoteAudioMonitoring();
        } catch (error) {
            console.error('❌ Error setting up remote audio analyser:', error);
        }
    }

    private startLocalAudioMonitoring = () => {
        let logCounter = 0;
        const LOG_INTERVAL = 10;

        const analyzeAudio = () => {
            if (!this.localAudioAnalyser || !this.localDataArray) return;

            this.localAudioAnalyser.getByteFrequencyData(this.localDataArray);

            const average = this.localDataArray.reduce((acc, value) => acc + value, 0) / this.localDataArray.length;
            const normalizedLevel = Math.min(100, (average / 256) * 100);

            if (WebRTCService.DEBUG_LOCAL_AUDIO) {
                logCounter++;
                if (logCounter >= LOG_INTERVAL) {
                    logCounter = 0;

                    const peakIndex = this.localDataArray.indexOf(Math.max(...Array.from(this.localDataArray)));
                    const peakFrequency = (peakIndex * this.audioContext!.sampleRate) / (this.localAudioAnalyser.frequencyBinCount * 2);

                    console.log('🎤 Local Audio:', {
                        level: normalizedLevel.toFixed(2) + '%',
                        peak: Math.max(...Array.from(this.localDataArray)),
                        average: average.toFixed(2),
                        peakFrequency: peakFrequency.toFixed(2) + 'Hz',
                        timestamp: new Date().toISOString(),
                    });

                    if (normalizedLevel > 5) {
                        const bars = '█'.repeat(Math.floor(normalizedLevel / 5));
                        console.log(`Local Volume: ${bars} ${normalizedLevel.toFixed(1)}%`);
                    }
                }
            }

            if (this.onAudioLevel) {
                const remoteLevel = this.getRemoteAudioLevel();
                this.onAudioLevel(normalizedLevel, remoteLevel);
            }

            this.localAnimationFrameId = requestAnimationFrame(analyzeAudio);
        };

        console.log('🎙️ Starting local audio monitoring...');
        analyzeAudio();
    }

    private startRemoteAudioMonitoring = () => {
        let logCounter = 0;
        const LOG_INTERVAL = 10;

        const analyzeAudio = () => {
            if (!this.remoteAudioAnalyser || !this.remoteDataArray) return;

            this.remoteAudioAnalyser.getByteFrequencyData(this.remoteDataArray);

            const average = this.remoteDataArray.reduce((acc, value) => acc + value, 0) / this.remoteDataArray.length;
            const normalizedLevel = Math.min(100, (average / 256) * 100);

            if (WebRTCService.DEBUG_REMOTE_AUDIO) {
                logCounter++;
                if (logCounter >= LOG_INTERVAL) {
                    logCounter = 0;

                    const peakIndex = this.remoteDataArray.indexOf(Math.max(...Array.from(this.remoteDataArray)));
                    const peakFrequency = (peakIndex * this.audioContext!.sampleRate) / (this.remoteAudioAnalyser.frequencyBinCount * 2);

                    console.log('🎧 Remote Audio:', {
                        level: normalizedLevel.toFixed(2) + '%',
                        peak: Math.max(...Array.from(this.remoteDataArray)),
                        average: average.toFixed(2),
                        peakFrequency: peakFrequency.toFixed(2) + 'Hz',
                        timestamp: new Date().toISOString(),
                    });

                    if (normalizedLevel > 5) {
                        const bars = '█'.repeat(Math.floor(normalizedLevel / 5));
                        console.log(`Remote Volume: ${bars} ${normalizedLevel.toFixed(1)}%`);
                    }
                }
            }

            this.remoteAnimationFrameId = requestAnimationFrame(analyzeAudio);
        };

        console.log('🎧 Starting remote audio monitoring...');
        analyzeAudio();
    }

    private getRemoteAudioLevel(): number {
        if (!this.remoteAudioAnalyser || !this.remoteDataArray) return 0;

        this.remoteAudioAnalyser.getByteFrequencyData(this.remoteDataArray);
        const average = this.remoteDataArray.reduce((acc, value) => acc + value, 0) / this.remoteDataArray.length;
        return Math.min(100, (average / 256) * 100);
    }

    private stopAudioMonitoring() {
        if (this.localAnimationFrameId !== null) {
            cancelAnimationFrame(this.localAnimationFrameId);
            this.localAnimationFrameId = null;
            console.log('🛑 Local audio monitoring stopped');
        }

        if (this.remoteAnimationFrameId !== null) {
            cancelAnimationFrame(this.remoteAnimationFrameId);
            this.remoteAnimationFrameId = null;
            console.log('🛑 Remote audio monitoring stopped');
        }

        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }

        this.localAudioAnalyser = null;
        this.remoteAudioAnalyser = null;
        this.localDataArray = null;
        this.remoteDataArray = null;
    }

    private processBufferedIceCandidates() {
        if (this.peerConnection && this.iceCandidateQueue.length > 0) {
            console.log(`Processing ${this.iceCandidateQueue.length} buffered ICE candidates`);
            this.iceCandidateQueue.forEach((candidate) => {
                this.peerConnection!.addIceCandidate(new RTCIceCandidate(candidate))
                    .then(() => console.log("Successfully added buffered ICE candidate"))
                    .catch((error) => console.error("Error adding buffered ICE candidate:", error));
            });
            this.iceCandidateQueue = [];
        }
    }

    async createAndSendOffer(targetId: string) {
        console.log("createAndSendOffer called");
        if (!this.peerConnection || !this.isVoiceEnabledRef.current) {
            console.log("Cannot create offer: no connection or voice is disabled");
            return;
        }

        this.targetId = targetId;
        const localStream = await this.getLocalStream();
        if (!localStream) return;

        localStream.getTracks().forEach((track) => {
            this.peerConnection!.addTrack(track, localStream);
        });

        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);

        this.chatService.sendOffer(targetId, new RTCSessionDescription(offer));
        console.log("Offer sent successfully.");
    }

    async handleIncomingOffer(senderId: string, offer: RTCSessionDescriptionInit) {
        if (!this.isVoiceEnabledRef.current) {
            console.log("Voice chat is disabled, ignoring incoming offer.");
            return;
        }

        console.log("Received offer from:", senderId);
        this.targetId = senderId;

        await this.setupConnection();
        await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(offer));
        this.processBufferedIceCandidates();

        const localStream = await this.getLocalStream();
        if (!localStream) {
            console.error("Could not get local stream, cannot proceed with voice chat.");
            return;
        }

        localStream.getTracks().forEach((track) =>
            this.peerConnection!.addTrack(track, localStream)
        );

        const answer = await this.peerConnection!.createAnswer();
        await this.peerConnection!.setLocalDescription(answer);

        this.chatService.sendAnswer(senderId, new RTCSessionDescription(answer));
        console.log("Created and sent answer.");
    }

    async handleIncomingAnswer(senderId: string, answer: RTCSessionDescriptionInit) {
        if (!this.isVoiceEnabledRef.current) {
            console.log("Voice chat is disabled, ignoring incoming answer.");
            return;
        }

        console.log("Received answer from:", senderId);
        await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(answer));
        this.processBufferedIceCandidates();
    }

    handleIncomingCandidate(senderId: string, candidate: RTCIceCandidateInit) {
        if (!this.isVoiceEnabledRef.current) {
            console.log("Voice chat is disabled, ignoring incoming ICE candidate.");
            return;
        }

        console.log("Received ICE candidate from:", senderId);
        if (this.peerConnection) {
            if (this.peerConnection.remoteDescription?.type) {
                this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                    .then(() => console.log("Successfully added ICE candidate"))
                    .catch((error) => console.error("Error adding ICE candidate:", error));
            } else {
                console.log("Remote description not set yet, buffering ICE candidate");
                this.iceCandidateQueue.push(candidate);
            }
        }
    }

    cleanup() {
        if (this.peerConnection) {
            this.peerConnection.getSenders().forEach((sender) => {
                sender.track?.stop();
            });
            this.peerConnection.close();
            this.peerConnection = null;
        }
        this.stopAudioMonitoring();
        this.targetId = null;
        this.iceCandidateQueue = [];
        this.isEnabled = false;
    }

    // Methods to control debugging at runtime
    public static setDebugFlags(localDebug: boolean, remoteDebug: boolean) {
        WebRTCService.DEBUG_LOCAL_AUDIO = localDebug;
        WebRTCService.DEBUG_REMOTE_AUDIO = remoteDebug;
        console.log('Debug settings updated:', {
            localAudio: localDebug,
            remoteAudio: remoteDebug,
            timestamp: new Date().toISOString()
        });
    }

    public static getDebugStatus() {
        return {
            localAudioDebug: WebRTCService.DEBUG_LOCAL_AUDIO,
            remoteAudioDebug: WebRTCService.DEBUG_REMOTE_AUDIO
        };
    }
}