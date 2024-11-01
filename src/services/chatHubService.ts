import { Message, Participant } from "@/types/message";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

interface ChatEvents {
  ReceiveMessage: [message: Message];
  RoomMembers: [members: Participant[]];
  RoomMembersUpdated: [members: Participant[]];
  UserJoined: [userName: string, roomName: string];
  UserLeft: [userName: string, roomName: string];
}

class ChatHubService {
  private connection: HubConnection | null = null;

  constructor(private readonly accessToken: string) { }

  public async startConnection(): Promise<void> {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5186/hubs/chat", {
          accessTokenFactory: async () => this.accessToken,
        })
        .configureLogging(LogLevel.Debug)
        .withAutomaticReconnect()
        .build();

      this.connection = connection;
      this.registerEventHandlers();

      await connection.start();
      console.log("SignalR Connected");
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
    }
  }

  private registerEventHandlers(): void {
    if (!this.connection) return;

    this.connection.on("ReceiveMessage", (message: Message) => {
      console.log("ReceiveMessage received:", message);
    });

    this.connection.on("RoomMembers", (members: Participant[]) => {
      console.log("RoomMembers received:", members);
    });

    this.connection.on("RoomMembersUpdated", (members: Participant[]) => {
      console.log("RoomMembersUpdated received:", members);
    });

    this.connection.on("UserJoined", (userName: string, roomName: string) => {
      console.log("User joined:", userName, "in room:", roomName);
    });

    this.connection.on("UserLeft", (userName: string, roomName: string) => {
      console.log("User left:", userName, "from room:", roomName);
    });
  }

  public async stopConnection(): Promise<void> {
    try {
      await this.connection?.stop();
      this.connection = null;
      console.log("SignalR Disconnected");
    } catch (err) {
      console.error("SignalR Disconnection Error: ", err);
    }
  }

  public joinRoom(roomId: string): void {
    this.connection?.invoke("JoinRoom", roomId);
  }

  public leaveRoom(roomId: string): void {
    this.connection?.invoke("LeaveRoom", roomId);
  }

  public send(roomId: string, messageContent: string): void {
    const message: Message = {
      id: crypto.randomUUID(),
      role: "user",
      sender: "currentUser",
      content: messageContent,
      datetime: new Date().toISOString(),
    };
    this.connection?.invoke("SendMessageToRoom", roomId, message);
  }

  public onReceiveMessage(callback: (message: Message) => void): void {
    this.connection?.on("ReceiveMessage", callback);
  }

  public offReceiveMessage(): void {
    this.connection?.off("ReceiveMessage");
  }

  public onRoomMembers(callback: (members: Participant[]) => void): void {
    this.connection?.on("RoomMembers", callback);
  }

  public offRoomMembers(): void {
    this.connection?.off("RoomMembers");
  }

  public onRoomMembersUpdated(callback: (members: Participant[]) => void): void {
    this.connection?.on("RoomMembersUpdated", callback);
  }

  public offRoomMembersUpdated(): void {
    this.connection?.off("RoomMembersUpdated");
  }

  public onUserJoined(callback: (...args: ChatEvents['UserJoined']) => void): void {
    this.connection?.on("UserJoined", callback);
  }

  public offUserJoined(): void {
    this.connection?.off("UserJoined");
  }

  public onUserLeft(callback: (...args: ChatEvents['UserLeft']) => void): void {
    this.connection?.on("UserLeft", callback);
  }

  public offUserLeft(): void {
    this.connection?.off("UserLeft");
  }
}

export default ChatHubService;
