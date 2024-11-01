// chatHubService.ts
import {
  Message,
  Participant,
  JoinRoomRequestDto,
  LeaveRoomRequestDto,
  SendMessageRequestDto,
} from "@/types/message";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
  HubConnectionState,
} from "@microsoft/signalr";

class ChatHubService {
  private connection: HubConnection | null = null;
  private isConnecting: boolean = false;
  private connectionEstablishedPromise: Promise<void> | null = null;

  // Store event handlers
  private receiveMessageHandlers: Array<(message: Message) => void> = [];
  private roomMembersHandlers: Array<(members: Participant[]) => void> = [];
  private userJoinedHandlers: Array<(userName: string, roomName: string) => void> = [];
  private userLeftHandlers: Array<(userName: string, roomName: string) => void> = [];

  constructor(public readonly accessToken: string) { }

  public async startConnection(): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) return;
    if (this.isConnecting && this.connectionEstablishedPromise) {
      await this.connectionEstablishedPromise;
      return;
    }

    this.isConnecting = true;

    this.connectionEstablishedPromise = new Promise<void>(async (resolve, reject) => {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl("http://localhost:5186/hubs/chat", {
            accessTokenFactory: async () => this.accessToken,
          })
          .configureLogging(LogLevel.Debug)
          .withAutomaticReconnect()
          .build();

        // Register stored event handlers before starting the connection
        this.registerEventHandlers(connection);

        this.connection = connection;

        await connection.start();
        console.log("SignalR Connected");

        // Wait until the connection state is 'Connected'
        while (this.connection.state !== HubConnectionState.Connected) {
          await new Promise((res) => setTimeout(res, 10));
        }

        resolve();
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        reject(err);
      } finally {
        this.isConnecting = false;
      }
    });

    return this.connectionEstablishedPromise;
  }

  private registerEventHandlers(connection: HubConnection) {
    this.receiveMessageHandlers.forEach((handler) => {
      connection.on("ReceiveMessage", (message: Message) => {
        handler(message);
      });
    });

    this.roomMembersHandlers.forEach((handler) => {
      connection.on("RoomMembers", (members: Participant[]) => {
        handler(members);
      });
    });

    this.userJoinedHandlers.forEach((handler) => {
      connection.on("UserJoined", handler);
    });

    this.userLeftHandlers.forEach((handler) => {
      connection.on("UserLeft", handler);
    });
  }

  public async stopConnection(): Promise<void> {
    if (!this.connection) return;

    try {
      await this.connection.stop();
      this.connection = null;
      console.log("SignalR Disconnected");
    } catch (err) {
      console.error("SignalR Disconnection Error: ", err);
    }
  }

  public async joinRoom(roomId: string): Promise<void> {
    if (!this.connection) {
      throw new Error("Cannot join room: connection is not established.");
    }
    if (this.connection.state !== HubConnectionState.Connected) {
      throw new Error("Cannot join room: connection is not in 'Connected' state.");
    }
    const request: JoinRoomRequestDto = { RoomId: roomId };
    await this.connection.invoke("JoinRoom", request);
  }

  public async leaveRoom(roomId: string): Promise<void> {
    if (!this.connection) return;
    if (this.connection.state !== HubConnectionState.Connected) {
      throw new Error("Cannot leave room: connection is not in 'Connected' state.");
    }
    const request: LeaveRoomRequestDto = { RoomId: roomId };
    await this.connection.invoke("LeaveRoom", request);
  }

  public async send(roomId: string, messageContent: string): Promise<void> {
    if (!this.connection) return;
    if (this.connection.state !== HubConnectionState.Connected) {
      throw new Error("Cannot send message: connection is not in 'Connected' state.");
    }

    const messageDto: Message = {
      id: crypto.randomUUID(),
      role: "user",
      sender: "currentUser", // Replace with actual user ID
      content: messageContent,
      datetime: new Date().toISOString(),
    };

    const request: SendMessageRequestDto = {
      RoomId: roomId,
      Message: messageDto,
    };

    await this.connection.invoke("SendMessageToRoom", request);
  }

  public onReceiveMessage(callback: (message: Message) => void): void {
    this.receiveMessageHandlers.push(callback);
    if (this.connection) {
      this.connection.on("ReceiveMessage", (message: Message) => {
        callback(message);
      });
    }
  }

  public offReceiveMessage(callback: (message: Message) => void): void {
    this.receiveMessageHandlers = this.receiveMessageHandlers.filter((h) => h !== callback);
    if (this.connection) {
      this.connection.off("ReceiveMessage", callback);
    }
  }

  public onRoomMembers(callback: (members: Participant[]) => void): void {
    this.roomMembersHandlers.push(callback);
    if (this.connection) {
      this.connection.on("RoomMembers", (members: Participant[]) => {
        callback(members);
      });
    }
  }

  public offRoomMembers(callback: (members: Participant[]) => void): void {
    this.roomMembersHandlers = this.roomMembersHandlers.filter((h) => h !== callback);
    if (this.connection) {
      this.connection.off("RoomMembers", callback);
    }
  }

  public onUserJoined(callback: (userName: string, roomName: string) => void): void {
    this.userJoinedHandlers.push(callback);
    if (this.connection) {
      this.connection.on("UserJoined", callback);
    }
  }

  public offUserJoined(callback: (userName: string, roomName: string) => void): void {
    this.userJoinedHandlers = this.userJoinedHandlers.filter((h) => h !== callback);
    if (this.connection) {
      this.connection.off("UserJoined", callback);
    }
  }

  public onUserLeft(callback: (userName: string, roomName: string) => void): void {
    this.userLeftHandlers.push(callback);
    if (this.connection) {
      this.connection.on("UserLeft", callback);
    }
  }

  public offUserLeft(callback: (userName: string, roomName: string) => void): void {
    this.userLeftHandlers = this.userLeftHandlers.filter((h) => h !== callback);
    if (this.connection) {
      this.connection.off("UserLeft", callback);
    }
  }
}

export default ChatHubService;
