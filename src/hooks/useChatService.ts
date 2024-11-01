import { useEffect, useState, useCallback, useMemo } from "react";
import ChatHubService from "../services/chatHubService";
import { Message, Participant, RoomInfo, ReceiverInfo, GroupReceiver } from "@/types/message";

export function useChatService(accessToken: string, room: RoomInfo) {
  const [chatService, setChatService] = useState<ChatHubService | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const initializeChatService = useCallback(async () => {
    setLoading(true);
    const serviceInstance = new ChatHubService(accessToken);
    await serviceInstance.startConnection();
    setChatService(serviceInstance);

    // Join the room regardless of whether it's a direct or group chat
    serviceInstance.joinRoom(room.roomId);

    setLoading(false);
  }, [accessToken, room]);

  useEffect(() => {
    if (accessToken) {
      initializeChatService();

      chatService?.onReceiveMessage((message: Message) => {
        setMessages(prev => [...prev, message]);
      });

      chatService?.onRoomMembers((members: Participant[]) => {
        setParticipants(members);
      });

      chatService?.onUserJoined((notification: string) =>
        setNotifications(prev => [...prev, notification])
      );
      chatService?.onUserLeft((notification: string) =>
        setNotifications(prev => [...prev, notification])
      );

      return () => {
        chatService?.leaveRoom(room.roomId);
        chatService?.offReceiveMessage();
        chatService?.offRoomMembers();
        chatService?.offUserJoined();
        chatService?.offUserLeft();
        chatService?.stopConnection();
      };
    }
  }, [accessToken, room, initializeChatService, chatService]);

  const handleSend = () => {
    if (newMessage && newMessage.content.trim()) {
      chatService?.send(room.roomId, newMessage.content);
      setMessages(prev => [...prev, newMessage]);
      setNewMessage(null);
    }
  };

  const startReceiving = () => {
    chatService?.onReceiveMessage((message: Message) => {
      setMessages(prev => [...prev, message]);
    });
  };

  const derivedReceiverInfo: ReceiverInfo = useMemo(() => {
    if (room.type === "group") {
      return {
        id: room.roomId,
        name: "Group Chat",
        type: "group",
        members: participants,
      } as GroupReceiver;
    } else if (participants.length === 1) {
      return participants[0];
    }
    return null;
  }, [room, participants]);

  return {
    messages,
    setMessages,
    roomInfo: room,
    participants,
    derivedReceiverInfo,
    notifications,
    newMessage,
    setNewMessage,
    handleSend,
    loading,
    loadData: initializeChatService,
    startReceiving,
  };
}
