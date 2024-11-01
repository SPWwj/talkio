// ChatUI.tsx
import React, { useRef, useEffect } from 'react';
import { Message } from '@/types/message';
import styles from '@/components/Chat/ChatUI.module.css';
import InputField from '../UI/InputField';
import SendButton from '../UI/SendButton';
import StatusBar from '../UI/StatusBar';
import MessageBubble from './MessageBubble';

interface ChatUIProps {
    messages: Message[];
    newMessage: string;
    isStreaming: boolean;
    assistantInfo: any;
    onMessageChange: (value: string) => void;
    onSendMessage: () => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatUI: React.FC<ChatUIProps> = ({
    messages,
    newMessage,
    isStreaming,
    assistantInfo,
    onMessageChange,
    onSendMessage,
    messagesEndRef
}) => {
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
                    onChange={onMessageChange}
                    onSend={onSendMessage}
                    disabled={isStreaming}
                />
                <SendButton onClick={onSendMessage} disabled={isStreaming} />
            </div>
        </div>
    );
};

export default ChatUI;
