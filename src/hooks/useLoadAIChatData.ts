import { useState, useEffect } from 'react';
import { ILoadChatData, Message, ReceiverInfo } from '@/types/message';
import { fetchAssistantInfo, fetchConversationHistory } from '@/services/chatService copy';

export const useLoadAIChatData = (): ILoadChatData => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [receiverInfo, setReceiverInfo] = useState<ReceiverInfo | null>(null);

    const loadData = async (roomId: string, token: string) => {
        try {
            const [info, history] = await Promise.all([
                fetchAssistantInfo(new AbortController().signal),
                fetchConversationHistory(new AbortController().signal)
            ]);

            setReceiverInfo(info);

            const processedMessages = history.map((msg: Message) => ({
                ...msg,
                sender: msg.role === 'user' ? 'user' : info?.name || 'assistant',
            }));

            setMessages(processedMessages);
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
        }
    };

    useEffect(() => {
    }, []);

    return { messages, setMessages, receiverInfo, loadData };
};
