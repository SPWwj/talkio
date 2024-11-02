// ChatAIContainer.tsx
import React, { useRef } from 'react';
import { useAIChat } from '@/hooks/useAIChat';
import ChatUI from './ChatUI';

interface ChatContainerProps {
    roomId: string;
    token: string;
}

const ChatAIContainer: React.FC<ChatContainerProps> = ({ roomId, token }) => {
    const {
        messages,
        newMessage,
        setNewMessage,
        handleSend,
        receiverInfo,
        loading: isLoading,
        myInfo,
    } = useAIChat(roomId, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5ODc2NTQzMjEiLCJ1c2VybmFtZSI6IldoYWxlamF5IiwiaWF0IjoxNTE3Nzc3Nzc3fQ.H4N0qyv2gxBRRiNjbdBXyj6qDGshH8DfDRAh7vKNbkg");

    const messagesEndRef = useRef<HTMLDivElement>(null);

    return (
        <ChatUI
            messages={messages}
            newMessage={newMessage}
            isLoading={isLoading}
            receiverInfo={receiverInfo}
            userInfo={myInfo}
            onMessageChange={setNewMessage}
            onSendMessage={handleSend}
            messagesEndRef={messagesEndRef}
        />
    );
};

export default ChatAIContainer;
