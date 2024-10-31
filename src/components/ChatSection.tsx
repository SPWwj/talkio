import React from "react";
import styles from "../app/chat_room/VoiceChat.module.css";
import {Message} from "@/app/types/types";

interface ChatSectionProps {
	messages: Message[];
	newMessage: string;
	setNewMessage: React.Dispatch<React.SetStateAction<string>>;
	handleSendMessage: () => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
	messages,
	newMessage,
	setNewMessage,
	handleSendMessage,
}) => (
	<div className={styles.chatSection}>
		<h3>Chat</h3>
		<div className={styles.chatInput}>
			{messages.map((msg, index) => (
				<div key={index}>
					<span>{msg.senderId}</span>: {msg.message}
				</div>
			))}
		</div>
		<div>
			<input
				type="text"
				value={newMessage}
				onChange={(e) => setNewMessage(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
				placeholder="Type a message..."
			/>
			<button onClick={handleSendMessage}>Send</button>
		</div>
	</div>
);
