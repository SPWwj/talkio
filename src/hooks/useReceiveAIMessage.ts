import { useState, useRef } from 'react';
import { IReceiveMessage, Message, ReceiverInfo } from '@/types/message';
import { fetchAssistantMessage } from '@/services/chatService copy';

export const useReceiveAIMessage = (
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    roomId: string,
    token: string,
    receiverInfo: ReceiverInfo | null // New dependency
): IReceiveMessage => {
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const startReceiving = async (userMessage: string) => {
        if (!receiverInfo) return; // Only start if receiverInfo is available

        setLoading(true);
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        const newMessage: Message = {
            id: `${Date.now()}-receiver`,
            role: `assistance`,
            sender: receiverInfo.name,
            content: '',
            datetime: new Date().toLocaleString(),
        };

        setMessages((prev) => [...prev, newMessage]);

        try {
            const response = await fetchAssistantMessage(userMessage, abortControllerRef.current.signal);
            if (response && response.body) {
                const reader = response.body.getReader();
                let messageContent = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = new TextDecoder().decode(value);
                    const lines = chunk.split('\n\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const decodedData = decodeURIComponent(line.slice(6));
                            messageContent += decodedData;
                            updateReceiverMessage(newMessage.id, messageContent);
                        }
                    }
                }
            } else {
                console.error('Invalid response or response body missing');
            }
        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                console.error('Receiving error:', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateReceiverMessage = (messageId: string, content: string) => {
        setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === messageId ? { ...msg, content } : msg)));
    };

    return { loading, startReceiving };
};
