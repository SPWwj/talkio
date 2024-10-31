"use client"
import { useState, useEffect, useRef } from 'react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Message, Participant } from '@/app/types/types';

interface SignalRHookReturn {
  connectionStatus: HubConnectionState | string;
  isMuted: boolean;
  myParticipantInfo: Participant | null;
  participants: Map<string, Participant>;
  localStream: React.MutableRefObject<MediaStream | null>;
  toggleMute: () => void;
  messages: Message[];
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => Promise<void>;
  connectionId: string | null;
  debugInfo: string[];
}

export const useSignalRConnection = (roomId: string): SignalRHookReturn => {
  const [ connection, setConnection ] = useState<HubConnection | null>(null);
  const [ connectionStatus, setConnectionStatus ] = useState<HubConnectionState | string>('Disconnected');
  const [ participants, setParticipants ] = useState<Map<string, Participant>>(new Map());
  const [ isMuted, setIsMuted ] = useState<boolean>(true);
  const [ myParticipantInfo, setMyParticipantInfo ] = useState<Participant | null>(null);
  const [ messages, setMessages ] = useState<Message[]>([]);
  const [ newMessage, setNewMessage ] = useState<string>('');
  const [ connectionId, setConnectionId ] = useState<string | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7166/hubs/rtc')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection.onclose(() => setConnectionStatus('Disconnected'));
    newConnection.onreconnecting(() => setConnectionStatus('Reconnecting'));
    newConnection.onreconnected(() => setConnectionStatus('Connected'));

    const startConnection = async () => {
      try {
        await newConnection.start();
        setConnectionStatus(newConnection.state);
        setConnectionId(newConnection.connectionId);

        const participantInfo = {
          participantId: newConnection.connectionId || '',
          displayName: `User (${newConnection.connectionId?.slice(0, 6) || 'unknown'})`,
        };
        setMyParticipantInfo(participantInfo);

        // Automatically join the specified room
        await newConnection.invoke('JoinRoom', roomId);
        setParticipants((prev) => new Map(prev).set(participantInfo.participantId, participantInfo));
      } catch (err) {
        setConnectionStatus('Failed' + err);
      }
    };

    startConnection();

    // Set up event handlers after connection starts
    if (newConnection) {
      newConnection.on('ParticipantJoined', (participant: Participant) => {
        setParticipants((prev) => new Map(prev).set(participant.participantId, participant));
      });

      newConnection.on('ParticipantLeft', (participantId: string) => {
        setParticipants((prev) => {
          const updated = new Map(prev);
          updated.delete(participantId);
          return updated;
        });
      });

      newConnection.on('ReceiveMessage', (message: Message) => {
        setMessages((prev) => [ ...prev, message ]);
      });
    }

    return () => {
      newConnection.stop();
    };
  }, [ roomId ]);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach((track) => (track.enabled = newMuteState));
    }
    setIsMuted(newMuteState);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !connection) return;
    const message = {
      senderId: connectionId || 'Unknown',
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    try {
      await connection.invoke('SendMessage', roomId, newMessage);
      setMessages((prev) => [ ...prev, message ]); // Update messages with the sent message
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return {
    connectionStatus,
    isMuted,
    myParticipantInfo,
    participants,
    localStream,
    toggleMute,
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    connectionId,
    debugInfo: [
      `Connection ID: ${connectionId}`,
      `Participants: ${participants.size}`,
      `Local Stream: ${localStream.current ? 'Active' : 'Inactive'}`,
    ],
  };
};
