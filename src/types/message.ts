import { AssistantDto } from "./assistantDto";

export interface Message {
    id: string;
    role: string;
    sender: string;
    content: string;
    datetime: string;
}
export interface ILoadChatData {
    loadData: (roomId: string, token: string) => Promise<void>;
    receiverInfo: ReceiverInfo | null;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export interface ISendMessage {
    newMessage: string;
    setNewMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSend: () => void;
}

export interface IReceiveMessage {
    loading: boolean;
    startReceiving: (message: string) => void;
}

export type ReceiverInfo =
    | AssistantDto
    | {
        id: string;
        name: string;
        type: 'user' | 'group';
        description?: string;
        createdAt?: number;
        metadata?: string;
    };
