// useChatService.ts
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import ChatHubService from "../services/chatHubService";
import {
  Message,
  Participant,
  RoomInfo,
  ReceiverInfo,
  GroupReceiver,
  IChat,
} from "@/types/message";

export function useChatService(accessToken: string, room: RoomInfo): IChat {
  const chatServiceRef = useRef<ChatHubService>();
  if (!chatServiceRef.current) {
    chatServiceRef.current = new ChatHubService(accessToken);
  }
  const chatService = chatServiceRef.current;

  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const initializeChatService = useCallback(async () => {
    if (!chatService) return;

    try {
      setLoading(true);
      await chatService.startConnection();
      await chatService.joinRoom(room.roomId);
    } catch (error) {
      console.error("Failed to initialize chat service:", error);
    } finally {
      setLoading(false);
    }
  }, [chatService, room.roomId]);

  useEffect(() => {
    if (!chatService) return;

    const messageHandler = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    const membersHandler = (members: Participant[]) => {
      setParticipants(members);
    };

    const userJoinedHandler = (userName: string, roomName: string) => {
      setNotifications((prev) => [...prev, `${userName} joined ${roomName}`]);
    };

    const userLeftHandler = (userName: string, roomName: string) => {
      setNotifications((prev) => [...prev, `${userName} left ${roomName}`]);
    };

    // Register event handlers
    chatService.onReceiveMessage(messageHandler);
    chatService.onRoomMembers(membersHandler);
    chatService.onUserJoined(userJoinedHandler);
    chatService.onUserLeft(userLeftHandler);

    // Initialize the connection
    initializeChatService();

    return () => {
      // Clean up event handlers
      chatService.offReceiveMessage(messageHandler);
      chatService.offRoomMembers(membersHandler);
      chatService.offUserJoined(userJoinedHandler);
      chatService.offUserLeft(userLeftHandler);
      chatService.leaveRoom(room.roomId);
      // Do not stop the connection here
    };
  }, [chatService, room.roomId]);

  // Stop connection when component unmounts
  useEffect(() => {
    return () => {
      chatService.stopConnection();
    };
  }, [chatService]);

  const handleSend = useCallback(() => {
    if (!chatService) return;

    if (newMessage.trim()) {
      chatService.send(room.roomId, newMessage);
      setNewMessage("");
    }
  }, [chatService, newMessage, room.roomId]);


  const derivedReceiverInfo: ReceiverInfo = useMemo(() => {
    if (room.type === "group") {
      return {
        id: room.roomId,
        name: "Group Chat",
        type: "group",
        members: participants,
      } as GroupReceiver;
    } else if (participants.length === 1) {
      return {
        id: participants[0].id,
        username: participants[0].username,
        type: "direct",
      };
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
