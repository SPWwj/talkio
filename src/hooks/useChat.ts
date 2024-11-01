import { ILoadChatData, ISendMessage, IReceiveMessage } from '@/types/message';
import React from 'react';
import { useRef } from 'react';

export const useChat = (
    loadChatData: ILoadChatData,
    sendMessage: ISendMessage,
    receiveMessage: IReceiveMessage,
    roomId: string,
    token: string
) => {
    const { messages, setMessages, receiverInfo, loadData } = loadChatData;
    const { loading, startReceiving } = receiveMessage;
    const { newMessage, setNewMessage, handleSend } = sendMessage;

    const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
        loadData(roomId, token);
    }, [roomId, token]);

    return {
        messages,
        newMessage,
        loading,
        setNewMessage,
        handleSend,
        scrollToBottom,
        receiverInfo,
    };
};
