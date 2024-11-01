import { useEffect, useState } from "react";
import ChatService from "../services/chatService";

export function useChatService(accessToken: string, room: string) {
  const [ chatService, setChatService ] = useState<ChatService | null>(null);
  const [ messages, setMessages ] = useState<Array<{ userName: string; message: string }>>([]);
  const [ roomMembers, setRoomMembers ] = useState<string[]>([]);
  const [ notifications, setNotifications ] = useState<string[]>([]);
  useEffect(() => {
    if (accessToken) {
      const serviceInstance = new ChatService(accessToken);

      async function connectAndJoinRoom() {
        await serviceInstance.startConnection();
        setChatService(serviceInstance);
        serviceInstance.joinRoom(room);
      }

      connectAndJoinRoom();

      // Register message handlers
      serviceInstance.onReceiveMessage((userName, message) => {
        setMessages(prev => [ ...prev, { userName, message } ]);
      });

      serviceInstance.onRoomMembers(members => {
        setRoomMembers(members);
      });

      serviceInstance.onRoomMembersUpdated(members => {
        setRoomMembers(members);
      });

      serviceInstance.onUserJoined((userName, roomName) => {
        setNotifications(prev => [ ...prev, `${userName} joined ${roomName}` ]);
      });

      serviceInstance.onUserLeft((userName, roomName) => {
        setNotifications(prev => [ ...prev, `${userName} left ${roomName}` ]);
      });

      return () => {
        serviceInstance.leaveRoom(room);
        serviceInstance.offReceiveMessage();
        serviceInstance.offRoomMembers();
        serviceInstance.offRoomMembersUpdated();
        serviceInstance.offUserJoined();
        serviceInstance.offUserLeft();
        serviceInstance.stopConnection();
      };
    }
  }, [ accessToken, room ]);

  const sendMessage = (message: string) => {
    chatService?.send(room, message);
  };

  return {
    messages,
    roomMembers,
    notifications,
    sendMessage,
  };
}