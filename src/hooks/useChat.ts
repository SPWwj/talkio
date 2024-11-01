import { fetchAssistantInfo, fetchAssistantMessage, fetchConversationHistory } from '@/services/chatService copy';
import { Message } from '@/types/message';
import { useState, useRef, useEffect } from 'react';

interface AssistantInfo {
    name: string;
    description?: string;
    model: string;
    createdAt: number;
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

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [assistantInfo, setAssistantInfo] = useState<AssistantInfo | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [info, history] = await Promise.all([
                    fetchAssistantInfo(new AbortController().signal),
                    fetchConversationHistory(new AbortController().signal)
                ]);
                setAssistantInfo(info);
                setMessages(history);
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
            }
        };

        loadInitialData();
    }, []);

    const handleSend = () => {
        if (newMessage.trim()) {
            const userMessage: Message = {
                id: generateUniqueId(),
                sender: 'user',
                content: newMessage,
                datetime: new Date().toLocaleString(),
            };
            console.log("Log time" + userMessage.datetime);
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            startStreaming(newMessage);
            setNewMessage('');
        }
    };

    const startStreaming = async (userMessage: string) => {
        setIsStreaming(true);
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        const newAssistantMessage: Message = {
            id: generateUniqueId(),
            sender: 'assistant',
            content: '',
            datetime: new Date().toLocaleString(),
        };

        setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);

        try {
            const response = await fetchAssistantMessage(userMessage, abortControllerRef.current.signal);

            if (response && response.body) {
                const reader = response.body.getReader();
                let assistantMessageContent = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = new TextDecoder().decode(value);
                    const lines = chunk.split('\n\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const encodedData = line.slice(6);
                            const decodedData = decodeURIComponent(encodedData);
                            assistantMessageContent += decodedData;
                            updateAssistantMessage(newAssistantMessage.id, assistantMessageContent);
                        }
                    }
                }
            } else {
                console.error('Invalid response or response body missing');
            }
        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                console.error('Streaming error:', error.message);
            }
        } finally {
            setIsStreaming(false);
        }
    };

    const updateAssistantMessage = (messageId: string, content: string) => {
        setMessages((prevMessages) => {
            return prevMessages.map((msg) => {
                if (msg.id === messageId) {
                    return { ...msg, content };
                }
                return msg;
            });
        });
    };

    const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return {
        messages,
        newMessage,
        isStreaming,
        setNewMessage,
        handleSend,
        scrollToBottom,
        assistantInfo,
    };
};
