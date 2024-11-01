// "use client"
// import { useState, useEffect, useRef, useCallback } from 'react';
// import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
// import { Participant, Message } from '@/types/message';

// interface SignalRHookReturn {
//   connectionStatus: HubConnectionState | string;
//   isMuted: boolean;
//   myParticipantInfo: Participant | null;
//   participants: Map<string, Participant>;
//   localStream: React.MutableRefObject<MediaStream | null>;
//   toggleMute: () => void;
//   messages: Message[];
//   newMessage: string;
//   setNewMessage: React.Dispatch<React.SetStateAction<string>>;
//   handleSendMessage: () => Promise<void>;
//   connectionId: string | null;
//   connection: HubConnection | null;
//   debugInfo: string[];
// }

// export const useSignalRConnection = (roomId: string): SignalRHookReturn => {
//   const [ connection, setConnection ] = useState<HubConnection | null>(null);
//   const [ connectionStatus, setConnectionStatus ] = useState<HubConnectionState | string>('Disconnected');
//   const [ participants, setParticipants ] = useState<Map<string, Participant>>(new Map());
//   const [ isMuted, setIsMuted ] = useState(true);
//   const [ myParticipantInfo, setMyParticipantInfo ] = useState<Participant | null>(null);
//   const [ messages, setMessages ] = useState<Message[]>([]);
//   const [ newMessage, setNewMessage ] = useState('');
//   const [ connectionId, setConnectionId ] = useState<string | null>(null);
//   const localStream = useRef<MediaStream | null>(null);

//   // Move setupLocalStream inside useCallback to properly handle dependencies
//   const setupLocalStream = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true
//         }
//       });

//       localStream.current = stream;

//       // Set initial track state based on mute status
//       stream.getAudioTracks().forEach(track => {
//         track.enabled = !isMuted;

//         // Add track event listeners for debugging
//         track.onended = () => console.log('Audio track ended');
//         track.onmute = () => console.log('Audio track muted');
//         track.onunmute = () => console.log('Audio track unmuted');
//       });

//       // Setup audio level monitoring
//       const audioContext = new AudioContext();
//       const source = audioContext.createMediaStreamSource(stream);
//       const analyser = audioContext.createAnalyser();
//       analyser.fftSize = 256;
//       source.connect(analyser);

//       const dataArray = new Uint8Array(analyser.frequencyBinCount);
//       const checkAudioLevel = () => {
//         analyser.getByteFrequencyData(dataArray);
//         const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
//         if (average > 0) {
//           console.log('Audio Level:', average.toFixed(2));
//         }
//         requestAnimationFrame(checkAudioLevel);
//       };

//       checkAudioLevel();

//     } catch (error) {
//       console.error('Error accessing microphone:', error);
//       setConnectionStatus('Failed to access microphone');
//     }
//   }, [ isMuted ]); // Add isMuted as dependency since it's used inside

//   useEffect(() => {
//     const newConnection = new HubConnectionBuilder()
//       .withUrl('https://chatiox.azurewebsites.net/hubs/rtc')
//       .withAutomaticReconnect()
//       .build();

//     setConnection(newConnection);

//     // Connection state handlers
//     newConnection.onclose(() => {
//       setConnectionStatus('Disconnected');
//       console.log('Connection closed');
//     });

//     newConnection.onreconnecting(() => {
//       setConnectionStatus('Reconnecting');
//       console.log('Attempting to reconnect...');
//     });

//     newConnection.onreconnected(() => {
//       setConnectionStatus('Connected');
//       console.log('Connection reestablished');
//     });

//     const startConnection = async () => {
//       try {
//         await newConnection.start();
//         console.log('Connection started');

//         // Setup local audio stream after connection is established
//         await setupLocalStream();

//         setConnectionStatus(newConnection.state);
//         const connId = newConnection.connectionId;
//         setConnectionId(connId);

//         const participantInfo = {
//           participantId: connId || '',
//           displayName: `User (${connId?.slice(0, 6) || 'unknown'})`
//         };
//         setMyParticipantInfo(participantInfo);

//         // Join the room
//         await newConnection.invoke('JoinRoom', roomId);
//         console.log(`Joined room: ${roomId}`);

//         // Add self to participants list
//         setParticipants(prev => new Map(prev).set(participantInfo.participantId, participantInfo));

//       } catch (err) {
//         console.error('Connection failed:', err);
//         setConnectionStatus('Failed to connect');
//       }
//     };

//     startConnection();

//     // Set up SignalR event handlers
//     newConnection.on('ParticipantJoined', (participant: Participant) => {
//       console.log('Participant joined:', participant);
//       setParticipants(prev => {
//         const updated = new Map(prev);
//         updated.set(participant.participantId, participant);
//         return updated;
//       });
//     });

//     newConnection.on('ParticipantLeft', (participantId: string) => {
//       console.log('Participant left:', participantId);
//       setParticipants(prev => {
//         const updated = new Map(prev);
//         updated.delete(participantId);
//         return updated;
//       });
//     });

//     newConnection.on('ExistingParticipants', (existingParticipants: Participant[]) => {
//       console.log('Existing participants:', existingParticipants);
//       setParticipants(prev => {
//         const updated = new Map(prev);
//         existingParticipants.forEach(participant => {
//           updated.set(participant.participantId, participant);
//         });
//         return updated;
//       });
//     });

//     newConnection.on('ReceiveMessage', (message: Message) => {
//       console.log('Received message:', message);
//       setMessages(prev => [ ...prev, message ]);
//     });

//     // Cleanup function
//     return () => {
//       // Stop all tracks in the local stream
//       if (localStream.current) {
//         localStream.current.getTracks().forEach(track => {
//           track.stop();
//           console.log('Stopped audio track:', track.id);
//         });
//       }

//       // Stop the SignalR connection
//       if (newConnection.state === HubConnectionState.Connected) {
//         newConnection.invoke('LeaveRoom', roomId).catch(console.error);
//         newConnection.stop().catch(console.error);
//       }
//     };
//   }, [ roomId, setupLocalStream ]); // Add setupLocalStream to dependency array

//   const toggleMute = () => {
//     if (!localStream.current) {
//       console.log('No local stream available');
//       return;
//     }

//     const newMuteState = !isMuted;
//     localStream.current.getAudioTracks().forEach(track => {
//       track.enabled = !newMuteState;
//       console.log(`Track ${track.id} ${track.enabled ? 'enabled' : 'disabled'}`);
//     });

//     setIsMuted(newMuteState);
//   };

//   const handleSendMessage = async () => {
//     if (newMessage.trim() === '' || !connection) return;

//     try {
//       await connection.invoke('SendMessage', roomId, newMessage);
//       console.log('Message sent:', newMessage);

//       // Add message to local state
//       const message: Message = {
//         senderId: connectionId || 'Unknown',
//         message: newMessage,
//         timestamp: new Date().toISOString()
//       };
//       setMessages(prev => [ ...prev, message ]);

//       // Clear message input
//       setNewMessage('');
//     } catch (err) {
//       console.error('Failed to send message:', err);
//     }
//   };

//   // Compile debug information
//   const debugInfo = [
//     `Connection ID: ${connectionId}`,
//     `Connection State: ${connectionStatus}`,
//     `Participants: ${participants.size}`,
//     `Local Stream: ${localStream.current ? 'Active' : 'Inactive'}`,
//     `Audio Tracks: ${localStream.current?.getAudioTracks().length || 0}`,
//     `Mute State: ${isMuted ? 'Muted' : 'Unmuted'}`
//   ];

//   return {
//     connectionStatus,
//     isMuted,
//     myParticipantInfo,
//     participants,
//     localStream,
//     toggleMute,
//     messages,
//     newMessage,
//     setNewMessage,
//     handleSendMessage,
//     connectionId,
//     connection,
//     debugInfo
//   };
// };