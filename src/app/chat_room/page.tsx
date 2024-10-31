"use client"

import React, { useEffect, useRef, useState } from 'react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import styles from './VoiceChat.module.css';

interface Participant {
  participantId: string;
  displayName: string;
}

interface Message {
  senderId: string;
  message: string;
  timestamp: string;
}

const VoiceChat = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<HubConnectionState | string>('Disconnected');
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [isMuted, setIsMuted] = useState(true);
  const [myParticipantInfo, setMyParticipantInfo] = useState<Participant | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
    const [connectionId, setConnectionId] = useState<string | null>(null);
    const roomId = "123";

  const localStream = useRef<MediaStream | null>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const statsIntervals = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  const debugLog = (context: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${context}] ${message}`, data ? data : '');
  };

  const logAudioLevels = (stream: MediaStream) => {
    try {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const checkAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        if (average > 0) { // Only log when there's actual audio
          debugLog('Audio Level', `Current audio level: ${average.toFixed(2)}`, {
            time: new Date().toISOString(),
            hasSound: true
          });
        }
        requestAnimationFrame(checkAudioLevel);
      };
      
      checkAudioLevel();
      return () => {
        source.disconnect();
        audioContext.close();
      };
    } catch (error) {
      debugLog('Audio Level Error', 'Failed to setup audio level monitoring', error);
      return () => {};
    }
  };

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7166/hubs/rtc')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
    debugLog('Connection', 'SignalR connection initialized');

    newConnection.onclose(() => {
      setConnectionStatus('Disconnected');
      debugLog('Connection', 'SignalR connection closed');
    });
    
    newConnection.onreconnecting(() => {
      setConnectionStatus('Reconnecting');
      debugLog('Connection', 'SignalR attempting to reconnect');
    });
    
    newConnection.onreconnected(() => {
      setConnectionStatus('Connected');
      debugLog('Connection', 'SignalR connection reestablished');
    });

    return () => {
      debugLog('Connection', 'Cleaning up SignalR connection');
      // Clean up all intervals
      statsIntervals.current.forEach(interval => clearInterval(interval));
      statsIntervals.current.clear();
      newConnection.stop();
    };
  }, []);

  useEffect(() => {
    if (!connection) return;

    const startConnection = async () => {
      try {
        await connection.start();
        setConnectionStatus(connection.state);

        const connId = connection.connectionId;
        setConnectionId(connId);
        debugLog('Connection', `Connected with connectionId: ${connId}`);

        const myInfo = {
          participantId: connId ?? '',
          displayName: `User (${connId?.slice(0, 6) || 'unknown'})`
        };
        setMyParticipantInfo(myInfo);

        await setupLocalStream();
        setupSignalRHandlers();
        await connection.invoke('JoinRoom', roomId);
        debugLog('Room', `Joined room: ${roomId}`);

        setParticipants((prev) => {
          const updated = new Map(prev);
          updated.set(connId!, myInfo);
          return updated;
        });
      } catch (err) {
        debugLog('Connection', 'Failed to connect', err);
        setConnectionStatus('Failed');
      }
    };

    startConnection();

    return () => {
      if (connection && connection.state === 'Connected') {
        debugLog('Room', `Leaving room: ${roomId}`);
        connection.invoke('LeaveRoom', roomId);
      }
    };
  }, [connection, roomId]);

  const setupLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      localStream.current = stream;
      
      // Ensure all tracks are enabled
      stream.getAudioTracks().forEach(track => {
        track.enabled = true;
        debugLog('Local Track', 'Audio track setup', {
          id: track.id,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
          constraints: track.getConstraints()
        });

        track.onended = () => debugLog('Local Track Ended', 'Audio track ended', { id: track.id });
        track.onmute = () => debugLog('Local Track Muted', 'Audio track muted', { id: track.id });
        track.onunmute = () => debugLog('Local Track Unmuted', 'Audio track unmuted', { id: track.id });
      });

      // Only set muted state after ensuring tracks are enabled
      if (!isMuted) {
        localStream.current.getAudioTracks().forEach(track => {
          track.enabled = true;
        });
      }

      logAudioLevels(stream);
    } catch (error) {
      debugLog('Local Stream Error', 'Error accessing media devices', error);
    }
  };

  const toggleMute = () => {
    if (!localStream.current) {
      debugLog('Mute', 'No local stream available to mute/unmute');
      return;
    }

    const newMuteState = !isMuted;
    localStream.current.getAudioTracks().forEach((track) => {
      track.enabled = newMuteState;
      debugLog('Mute', `Microphone ${track.enabled ? 'enabled' : 'disabled'}`, {
        trackId: track.id,
        readyState: track.readyState,
        enabled: track.enabled
      });
    });
    setIsMuted(!newMuteState);
  };

  const setupSignalRHandlers = () => {
    if (!connection) return;

    connection.on('ParticipantJoined', (participant: Participant) => {
      debugLog('Participant', `New participant joined: ${participant.participantId}`);
      setParticipants(prev => {
        const updated = new Map(prev);
        updated.set(participant.participantId, participant);
        return updated;
      });
      createPeerConnection(participant.participantId);
    });

    connection.on('ParticipantLeft', (participantId: string) => {
      debugLog('Participant', `Participant left: ${participantId}`);
      
      const interval = statsIntervals.current.get(participantId);
      if (interval) {
        clearInterval(interval);
        statsIntervals.current.delete(participantId);
      }

      setParticipants(prev => {
        const updated = new Map(prev);
        updated.delete(participantId);
        return updated;
      });

      const peerConnection = peerConnections.current.get(participantId);
      if (peerConnection) {
        peerConnection.close();
        peerConnections.current.delete(participantId);
        debugLog('Peer Connection', `Closed connection for ${participantId}`);
      }
    });

    connection.on('ExistingParticipants', (existingParticipants: Participant[]) => {
      debugLog('Participants', 'Received existing participants', existingParticipants);
      setParticipants(prev => {
        const updated = new Map(prev);
        existingParticipants.forEach(participant => {
          updated.set(participant.participantId, participant);
          createPeerConnection(participant.participantId);
        });
        return updated;
      });
    });

    connection.on('ReceiveOffer', async (senderId: string, offer: RTCSessionDescriptionInit) => {
      debugLog('Offer', `Received offer from ${senderId}`, offer);
      const peerConnection = createPeerConnection(senderId);
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        debugLog('Answer', `Created and sending answer to ${senderId}`, answer);
        await connection.invoke('SendAnswer', senderId, answer);
      } catch (error) {
        debugLog('Offer Error', `Error processing offer from ${senderId}`, error);
      }
    });

    connection.on('ReceiveAnswer', async (senderId: string, answer: RTCSessionDescriptionInit) => {
      const peerConnection = peerConnections.current.get(senderId);
      if (peerConnection) {
        try {
          debugLog('Answer', `Processing answer from ${senderId}`, answer);
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
          debugLog('Answer Error', `Error processing answer from ${senderId}`, error);
        }
      }
    });

    connection.on('ReceiveIceCandidate', async (senderId: string, candidate: RTCIceCandidateInit) => {
      const peerConnection = peerConnections.current.get(senderId);
      if (peerConnection) {
        try {
          debugLog('ICE Candidate', `Processing ICE candidate from ${senderId}`, candidate);
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          debugLog('ICE Error', `Error processing ICE candidate from ${senderId}`, error);
        }
      }
    });

    connection.on('ReceiveMessage', (data: Message) => {
      debugLog('Message', `Received message from ${data.senderId}`, data);
      setMessages(prevMessages => [...prevMessages, data]);
    });
  };

  const createPeerConnection = (targetId: string) => {
    let peerConnection = peerConnections.current.get(targetId);
    if (peerConnection) {
      debugLog('Peer Connection', `Peer connection already exists for ${targetId}`);
      return peerConnection;
    }

    peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });
    
    peerConnections.current.set(targetId, peerConnection);

    debugLog('Peer Creation', `Creating new peer connection for ${targetId}`, {
      connectionState: peerConnection.connectionState,
      iceConnectionState: peerConnection.iceConnectionState
    });

    peerConnection.onconnectionstatechange = () => {
      debugLog('Peer State Change', `Connection state for ${targetId}`, {
        state: peerConnection.connectionState,
        time: new Date().toISOString(),
        iceState: peerConnection.iceConnectionState,
        signalingState: peerConnection.signalingState
      });
    };

    peerConnection.oniceconnectionstatechange = () => {
      debugLog('ICE State Change', `ICE state for ${targetId}`, {
        state: peerConnection.iceConnectionState,
        time: new Date().toISOString(),
        candidates: peerConnection.canTrickleIceCandidates
      });
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        debugLog('ICE Candidate', `Generated candidate for ${targetId}`, {
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          type: event.candidate.type
        });
        connection?.invoke('SendIceCandidate', targetId, event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      debugLog('Track Received', `Received track from ${targetId}`, {
        kind: event.track.kind,
        readyState: event.track.readyState,
        muted: event.track.muted,
        enabled: event.track.enabled,
        id: event.track.id
      });

      // Ensure the track is enabled
      event.track.enabled = true;

      const audio = new Audio();
      audio.srcObject = event.streams[0];
      audio.autoplay = true;

      // Ensure audio element is unmuted and has volume
      audio.muted = false;
      audio.volume = 1.0;
      
      audio.onloadedmetadata = () => {
        debugLog('Audio Element', `Audio element ready for ${targetId}`, {
          duration: audio.duration,
          readyState: audio.readyState,
          muted: audio.muted,
          volume: audio.volume
        });
        
        // Try to play immediately after metadata is loaded
        audio.play().catch(error => {
          debugLog('Audio Play Error', `Failed to play audio: ${error.message}`);
        });
      };

      // Monitor stats for debugging
      const monitorStats = async () => {
        try {
          const stats = await peerConnection.getStats(event.track);
          const audioLevels: any = {};
          
          stats.forEach(report => {
            if (report.type === 'inbound-rtp' && report.kind === 'audio') {
              audioLevels.inbound = {
                packetsReceived: report.packetsReceived,
                bytesReceived: report.bytesReceived,
                jitter: report.jitter,
                packetsLost: report.packetsLost,
                timestamp: report.timestamp
              };
            } else if (report.type === 'media-source' || report.type === 'media-playout') {
              audioLevels.media = {
                audioLevel: report.audioLevel,
                totalAudioEnergy: report.totalAudioEnergy
              };
            }
          });

          if (Object.keys(audioLevels).length > 0) {
            debugLog('Audio Stats', `Stats for ${targetId}`, audioLevels);
          }
        } catch (error) {
          debugLog('Stats Error', `Failed to get stats: ${error}`);
        }
      };

      const statsInterval = setInterval(monitorStats, 5000);
      statsIntervals.current.set(targetId, statsInterval);

      event.track.onended = () => {
        const interval = statsIntervals.current.get(targetId);
        if (interval) {
          clearInterval(interval);
          statsIntervals.current.delete(targetId);
        }
        debugLog('Track Ended', `Track ended and cleaned up for ${targetId}`);
      };
    };

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        // Ensure local track is enabled before adding
        track.enabled = true;
        debugLog('Adding Track', `Sending track to ${targetId}`, {
          kind: track.kind,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
          id: track.id
        });
        peerConnection.addTrack(track, localStream.current as MediaStream);
      });
    }

    // Handle negotiationneeded event
    peerConnection.onnegotiationneeded = async () => {
      debugLog('Negotiation', `Negotiation needed for ${targetId}`);
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        debugLog('Offer', `Sending offer to ${targetId}`, offer);
        await connection?.invoke('SendOffer', targetId, offer);
      } catch (error) {
        debugLog('Negotiation Error', `Failed to create/send offer to ${targetId}`, error);
      }
    };

    return peerConnection;
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !connection) return;

    try {
      debugLog('Message', 'Sending message', { content: newMessage });
      await connection.invoke('SendMessage', roomId, newMessage);
      setNewMessage('');
    } catch (err) {
      debugLog('Message Error', 'Failed to send message', err);
    }
  };

  // Cleanup function for component unmount
  useEffect(() => {
    return () => {
      // Clean up all peer connections
      peerConnections.current.forEach((pc, id) => {
        debugLog('Cleanup', `Closing peer connection for ${id}`);
        pc.close();
      });
      peerConnections.current.clear();

      // Clean up all stats intervals
      statsIntervals.current.forEach((interval, id) => {
        debugLog('Cleanup', `Clearing stats interval for ${id}`);
        clearInterval(interval);
      });
      statsIntervals.current.clear();

      // Clean up local stream
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => {
          debugLog('Cleanup', `Stopping track ${track.id}`);
          track.stop();
        });
        localStream.current = null;
      }
    };
  }, []);
return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Voice Chat - Room {roomId}</h2>
          <div className={styles.status}>
            <span>Status:</span>
            <span
              className={
                connectionStatus === 'Connected'
                  ? styles.statusConnected
                  : connectionStatus === 'Connecting'
                  ? styles.statusConnecting
                  : styles.statusDisconnected
              }
            >
              {connectionStatus}
            </span>
          </div>
        </div>

        <button
          onClick={toggleMute}
          className={`${styles.button} ${
            isMuted ? styles.buttonMuted : styles.buttonUnmuted
          }`}
        >
          {isMuted ? "Unmute Microphone" : "Mute Microphone"}
        </button>

        <div className={styles.audioIndicator}>
          <div
            className={`${styles.audioIndicator} ${
              localStream.current?.active ? styles.audioReady : styles.audioNotReady
            }`}
          />
          {localStream.current?.active ? 'Audio Ready' : 'No Audio'}
        </div>

        <div className={styles.participantsSection}>
          <h3 className={styles.title}>Participants ({participants.size})</h3>
          <div className={styles.participantCard}>
            {myParticipantInfo && (
              <div className={styles.participantCard}>
                <div>
                  <div className={styles.participantName}>
                    {myParticipantInfo.displayName} (You)
                  </div>
                  <div className={styles.participantStatus}>
                    {isMuted ? "Muted" : "Active"}
                  </div>
                </div>
              </div>
            )}
            {Array.from(participants.values())
              .filter((participant) => participant.participantId !== myParticipantInfo?.participantId)
              .map((participant) => (
                <div key={participant.participantId} className={styles.participantCard}>
                  <div className={styles.participantName}>{participant.displayName}</div>
                  <div className={styles.participantStatus}>Connected</div>
                  <div title="Peer connection active" className={styles.audioReady} />
                </div>
              ))}
          </div>
        </div>

        <div className={styles.chatSection}>
          <h3 className={styles.title}>Chat</h3>
          <div className={styles.chatInput}>
            {messages.map((msg, index) => (
              <div key={index}>
                <span className={styles.participantName}>
                  {msg.senderId === myParticipantInfo?.participantId ? 'You' : msg.senderId}
                </span>: {msg.message}
                <div>{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
          <div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className={styles.chatInput}
            />
            <button onClick={handleSendMessage} className={styles.sendButton}>
              Send
            </button>
          </div>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className={styles.debugInfo}>
            <div>Connection ID: {connectionId}</div>
            <div>Peer Connections: {peerConnections.current.size}</div>
            <div>Local Stream: {localStream.current ? 'Active' : 'Inactive'}</div>
            <div>Active Stats Monitors: {statsIntervals.current.size}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceChat;