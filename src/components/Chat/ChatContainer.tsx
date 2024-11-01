// ChatContainer.tsx
import React, { useRef } from 'react';
import { useLoadAIChatData } from '@/hooks/useLoadAIChatData';
import { useReceiveAIMessage } from '@/hooks/useReceiveAIMessage';
import { useSendAIMessage } from '@/hooks/useSendAIMessage';
import { Message } from '@/types/message';
import { useChat } from '@/hooks/useChat';
import ChatUI from './ChatUI';

interface ChatContainerProps {
    roomId: string;
    token: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ roomId, token }) => {
    const loadChatData = useLoadAIChatData();
	const receiveMessage = useReceiveAIMessage(loadChatData.setMessages, roomId, token, loadChatData.receiverInfo);
    const sendMessage = useSendAIMessage(loadChatData.setMessages, receiveMessage.startReceiving);

    const {
        messages,
        newMessage,
        setNewMessage,
        handleSend,
        receiverInfo: assistantInfo,
        loading: isStreaming
    } = useChat(loadChatData, sendMessage, receiveMessage, roomId, token);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    return (
        <ChatUI
            messages={messages}
            newMessage={newMessage}
            isStreaming={isStreaming}
            assistantInfo={assistantInfo}
            onMessageChange={setNewMessage}
            onSendMessage={handleSend}
            messagesEndRef={messagesEndRef}
        />
    );
};

export default ChatContainer;
