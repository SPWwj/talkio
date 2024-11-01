import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

interface ChatEvents {
  ReceiveMessage: [ userName: string, message: string ];
  RoomMembers: string[];
  RoomMembersUpdated: string[];
  userjoined: [ userName: string, roomName: string ];
  UserLeft: [ userName: string, roomName: string ];
}

class ChatService {
  private connection: HubConnection | null = null;

  constructor(private readonly accessToken: string) { }

  public async startConnection(): Promise<void> {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5186/hubs/chat", {
          accessTokenFactory: async () => this.accessToken,
        })
        .configureLogging(LogLevel.Debug) // Changed to Debug for more detailed logs
        .withAutomaticReconnect()
        .build();

      // Register handlers before starting the connection
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

    this.connection.on("ReceiveMessage", (...args) => {
      console.log("ReceiveMessage received with args:", args);
    });

    this.connection.on("RoomMembers", (members) => {
      console.log("RoomMembers received:", members);
    });

    this.connection.on("RoomMembersUpdated", (members) => {
      console.log("RoomMembersUpdated received:", members);
    });

    this.connection.on("userjoined", (...args) => {
      console.log("User joined:", args);
    });

    this.connection.on("UserLeft", (...args) => {
      console.log("User left:", args);
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

  public joinRoom(room: string): void {
    this.connection?.invoke("JoinRoom", room);
  }

  public leaveRoom(room: string): void {
    this.connection?.invoke("LeaveRoom", room);
  }

  public send(room: string, message: string): void {
    this.connection?.invoke("SendMessageToRoom", room, message);
  }

  public onReceiveMessage(callback: (...args: ChatEvents[ 'ReceiveMessage' ]) => void): void {
    this.connection?.on("ReceiveMessage", callback);
  }

  public offReceiveMessage(): void {
    this.connection?.off("ReceiveMessage");
  }

  public onRoomMembers(callback: (members: ChatEvents[ 'RoomMembers' ]) => void): void {
    this.connection?.on("RoomMembers", callback);
  }

  public offRoomMembers(): void {
    this.connection?.off("RoomMembers");
  }

  public onRoomMembersUpdated(callback: (members: ChatEvents[ 'RoomMembersUpdated' ]) => void): void {
    this.connection?.on("RoomMembersUpdated", callback);
  }

  public offRoomMembersUpdated(): void {
    this.connection?.off("RoomMembersUpdated");
  }

  public onUserJoined(callback: (...args: ChatEvents[ 'userjoined' ]) => void): void {
    this.connection?.on("userjoined", callback);
  }

  public offUserJoined(): void {
    this.connection?.off("userjoined");
  }

  public onUserLeft(callback: (...args: ChatEvents[ 'UserLeft' ]) => void): void {
    this.connection?.on("UserLeft", callback);
  }

  public offUserLeft(): void {
    this.connection?.off("UserLeft");
  }
}

export default ChatService;