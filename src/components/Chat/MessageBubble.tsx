import {Message, UserInfo} from "@/types/message";
import {formatTime} from "@/utils/dateTime";
import React from "react";

import styles from "@/components/Chat/MessageBubble.module.css";
import MarkdownRenderer from "./MarkdownRenderer";

interface MessageBubbleProps {
	message: Message;
	userInfo: UserInfo;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({message, userInfo}) => {
	const isUser =
		message.senderId === userInfo.id ||
		(message.type === "ai" && message.role === "user");

	return (
		<div
			className={`${styles.messageBubble} ${
				isUser ? styles.yourMessage : styles.otherMessage
			}`}
		>
			{!isUser && <div className={styles.senderName}>{message.sender}</div>}
			<div className={styles.messageContent}>
				<MarkdownRenderer content={message.content} />
			</div>
			<div className={styles.messageTimestamp}>
				{formatTime(message.datetime)}
			</div>
		</div>
	);
};

export default MessageBubble;
