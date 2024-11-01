import React, { useRef, useEffect } from 'react';
import { useLoadAIChatData } from '@/hooks/useLoadAIChatData';
import { useReceiveAIMessage } from '@/hooks/useReceiveAIMessage';
import { useSendAIMessage } from '@/hooks/useSendAIMessage';
import { Message } from '@/types/message';
import styles from '@/components/Chat/ChatComponent.module.css';
import { useChat } from '@/hooks/useChat';
import InputField from '../UI/InputField';
import SendButton from '../UI/SendButton';
import StatusBar from '../UI/StatusBar';
import MessageBubble from './MessageBubble';

interface ChatComponentProps {
    roomId: string;
    token: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ roomId, token }) => {
    const loadChatData = useLoadAIChatData();
	const receiveMessage = useReceiveAIMessage(loadChatData.setMessages, roomId, token, loadChatData.receiverInfo);
    const sendMessage = useSendAIMessage(loadChatData.setMessages, receiveMessage.startReceiving);

    const {
        messages,
        newMessage,
        setNewMessage,
        handleSend,
        scrollToBottom,
        receiverInfo: assistantInfo,
        loading: isStreaming
    } = useChat(loadChatData, sendMessage, receiveMessage, roomId, token);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom(messagesEndRef);
    }, [messages]);

    return (
        <div className={styles.chatContainer}>
            {assistantInfo && <StatusBar receiverInfo={assistantInfo} />}

            <div className={styles.messagesContainer}>
                {messages.map((message: Message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}
                {isStreaming && (
                    <div className={styles.typingIndicator}>Assistant is typing...</div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputContainer}>
                <InputField
                    value={newMessage}
                    onChange={setNewMessage}
                    onSend={handleSend}
                    disabled={isStreaming}
                />
                <SendButton onClick={handleSend} disabled={isStreaming} />
            </div>
        </div>
    );
};

export default ChatComponent;
