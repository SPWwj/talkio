import { useState } from 'react';
import { ISendMessage, Message } from '@/types/message';

export const useSendAIMessage = (
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    startReceiving: (message: string) => void
): ISendMessage => {
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim()) {
            const userMessage: Message = {
                id: generateUniqueId(),
                role: ' user',
                sender: 'user',
                content: newMessage,
                datetime: new Date().toLocaleString(),
            };
            setMessages((prev) => [...prev, userMessage]);
            startReceiving(newMessage);
            setNewMessage('');
        }
    };

    return { newMessage, setNewMessage, handleSend };
};
const generateUniqueId = (() => {
    let counter = 0;
    return () => {
        const timestamp = Date.now();
        const uniqueId = `${timestamp}-${counter}`;
        counter = (counter + 1) % 1000;
        return uniqueId;
    };
})();