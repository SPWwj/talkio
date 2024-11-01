import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import styles from "@/components/Chat/Chat.module.css";
import InputField from "../UI/InputField";
import SendButton from "../UI/SendButton";
import StatusBar from "../UI/StatusBar";
import { useChat } from "@/hooks/useChat";

export default function Chat() {
	const {
		messages,
		newMessage,
		isStreaming,
		setNewMessage,
		handleSend,
		scrollToBottom,
		assistantInfo,
	} = useChat();

	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	return (
		<div className={styles.chatContainer}>
			{assistantInfo && (
				<StatusBar assistantInfo={assistantInfo} />
			)}

			<div className={styles.messagesContainer}>
				{messages.map((message) => (
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
}

