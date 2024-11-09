import React, {useMemo} from "react";
import {Message, UserInfo} from "@/types/message";
import {formatTime} from "@/utils/dateTime";
import styles from "@/components/Chat/MessageBubble.module.css";
import MarkdownRenderer from "./MarkdownRenderer";

interface MessageBubbleProps {
	message: Message;
	userInfo: UserInfo;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({message, userInfo}) => {
	// Memoize the computation of isUser to prevent unnecessary re-computations
	const isUser = useMemo(
		() =>
			message.senderId === userInfo.id ||
			(message.type === "ai" && message.role === "user"),
		[message.senderId, message.type, message.role, userInfo.id]
	);

	// Memoize the formatted time
	const formattedTime = useMemo(
		() => formatTime(message.datetime),
		[message.datetime]
	);

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
			<div className={styles.messageTimestamp}>{formattedTime}</div>
		</div>
	);
};

// Memoize the component to prevent re-renders when props haven't changed
export default React.memo(MessageBubble);
