import React from "react";
import styles from "../app/chat_room/VoiceChat.module.css";
import {Message} from "@/types/types";

interface ChatSectionProps {
	messages: Message[];
	newMessage: string;
	setNewMessage: React.Dispatch<React.SetStateAction<string>>;
	handleSendMessage: () => Promise<void>; // Updated to match the actual return type
	myParticipantId?: string; // Made optional with ?
}

export const ChatSection: React.FC<ChatSectionProps> = ({
	messages,
	newMessage,
	setNewMessage,
	handleSendMessage,
	myParticipantId = "", // Provide default value
}) => (
	<div className={styles.chatSection}>
		<h3>Chat</h3>
		<div className={styles.chatInput}>
			{messages.map((msg, index) => (
				<div
					key={index}
					className={
						msg.senderId === myParticipantId ? styles.myMessage : styles.message
					}
				>
					<span className={styles.sender}>
						{msg.senderId === myParticipantId ? "You" : msg.senderId}
					</span>
					: {msg.message}
				</div>
			))}
		</div>
		<div className={styles.inputContainer}>
			<input
				type="text"
				value={newMessage}
				onChange={(e) => setNewMessage(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
				placeholder="Type a message..."
				className={styles.input}
			/>
			<button
				onClick={handleSendMessage}
				className={styles.button}
				disabled={!newMessage.trim()}
			>
				Send
			</button>
		</div>
	</div>
);
