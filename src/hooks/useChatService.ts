import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import ChatHubService from "../services/chatHubService";
import {
  Message,
  RoomInfo,
  ReceiverInfo,
  GroupReceiver,
  IChat,
  UserInfo,
} from "@/types/message";
import { decodeToken } from "@/utils/tokenHelper";

export function useChatService(accessToken: string, room: RoomInfo): IChat & { myInfo: UserInfo } {
  const chatServiceRef = useRef<ChatHubService>();
  if (!chatServiceRef.current) {
    chatServiceRef.current = new ChatHubService(accessToken);
  }
  const chatService = chatServiceRef.current;

  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<UserInfo[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const userInfo: UserInfo = useMemo(() => decodeToken(accessToken), [accessToken]);

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

    const membersHandler = (members: UserInfo[]) => {
      setParticipants(members);
    };

    const userJoinedHandler = (userName: string, roomName: string) => {
      setNotifications((prev) => [...prev, `${userName} joined ${roomName}`]);
    };

    const userLeftHandler = (userName: string, roomName: string) => {
      setNotifications((prev) => [...prev, `${userName} left ${roomName}`]);
    };

    chatService.onReceiveMessage(messageHandler);
    chatService.onRoomMembers(membersHandler);
    chatService.onUserJoined(userJoinedHandler);
    chatService.onUserLeft(userLeftHandler);

    initializeChatService();

    return () => {
      chatService.offReceiveMessage(messageHandler);
      chatService.offRoomMembers(membersHandler);
      chatService.offUserJoined(userJoinedHandler);
      chatService.offUserLeft(userLeftHandler);
      chatService.leaveRoom(room.roomId);
    };
  }, [chatService, room.roomId]);

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
    } else {
      const otherParticipant = participants.find((p) => p.id !== userInfo.id);
      return otherParticipant
        ? {
          id: otherParticipant.id,
          username: otherParticipant.username,
          type: "direct",
        }
        : null;
    }
  }, [room, participants, userInfo]);

  return {
    messages,
    receiverInfo: derivedReceiverInfo,
    newMessage,
    setNewMessage,
    handleSend,
    loading,
    loadData: initializeChatService,
    myInfo: userInfo, // Exporting myInfo here
  };
}
