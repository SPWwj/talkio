import { useEffect, useState, useCallback, useMemo } from "react";
import ChatHubService from "../services/chatHubService";
import { Message, Participant, RoomInfo, ReceiverInfo, GroupReceiver, IChat } from "@/types/message";

export function useChatService(accessToken: string, room: RoomInfo): IChat {
  const [chatService, setChatService] = useState<ChatHubService | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const initializeChatService = useCallback(async () => {
    setLoading(true);
    const serviceInstance = new ChatHubService(accessToken);
    await serviceInstance.startConnection();
    setChatService(serviceInstance);

    serviceInstance.joinRoom(room.roomId);
    setLoading(false);
  }, [accessToken, room]);

  useEffect(() => {
    if (accessToken) {
      initializeChatService();

      chatService?.onReceiveMessage((message: Message) => {
        setMessages((prev) => [...prev, message]);
      });

      chatService?.onRoomMembers((members: Participant[]) => {
        setParticipants(members);
      });

      chatService?.onUserJoined((notification: string) =>
        setNotifications((prev) => [...prev, notification])
      );
      chatService?.onUserLeft((notification: string) =>
        setNotifications((prev) => [...prev, notification])
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
    if (newMessage.trim()) {
      chatService?.send(room.roomId, newMessage);
      const userMessage: Message = {
        id: generateUniqueId(),
        role: 'user',
        sender: 'user',
        content: newMessage,
        datetime: new Date().toLocaleString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setNewMessage('');
    }
  };

  const startReceiving = () => {
    chatService?.onReceiveMessage((message: Message) => {
      setMessages((prev) => [...prev, message]);
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
    receiverInfo: derivedReceiverInfo,
    newMessage,
    setNewMessage,
    handleSend,
    loading,
    loadData: initializeChatService,
  };
}

const generateUniqueId = (() => {
  let counter = 0;
  return () => {
    const timestamp = Date.now();
    const uniqueId = `${timestamp}-${counter}`;
    counter = (counter + 1) % 1000;
    return uniqueId;
  };
})();
