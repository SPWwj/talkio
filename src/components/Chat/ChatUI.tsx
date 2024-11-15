import React, {useRef, useEffect, useState, useCallback} from "react";
import {Message, ReceiverInfo, UserInfo} from "@/types/message";
import styles from "@/components/Chat/ChatUI.module.css";
import InputField from "../UI/InputField";
import SendButton from "../UI/SendButton";
import StatusBar from "../UI/StatusBar";
import MessageBubble from "./MessageBubble";

interface ChatUIProps {
	messages: Message[];
	newMessage: string;
	isLoading: boolean;
	receiverInfo: ReceiverInfo;
	userInfo: UserInfo;
	isVoiceEnabled?: boolean | null;
	onToggleVoice?: () => void;
	onMessageChange: (value: string) => void;
	onSendMessage: () => void;
	messagesEndRef: React.RefObject<HTMLDivElement>;
	remoteStreams?: MediaStream[] | null;
}

const ChatUI: React.FC<ChatUIProps> = ({
	messages,
	newMessage,
	isLoading: isStreaming,
	receiverInfo: assistantInfo,
	userInfo,
	isVoiceEnabled = false,
	onToggleVoice,
	onMessageChange,
	onSendMessage,
	messagesEndRef,
	remoteStreams,
}) => {
	const [audioStarted, setAudioStarted] = useState(false);
	const audioRefs = useRef<{[key: string]: HTMLAudioElement | null}>({});
	const chatContainerRef = useRef<HTMLDivElement>(null);

	const startAudio = useCallback(() => {
		setAudioStarted(true);
	}, []);

	// Automatically scroll to the bottom when messages are updated
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
	}, [messages, messagesEndRef, isStreaming, newMessage]);

	// Observe changes in chat container to scroll when dynamic content renders
	useEffect(() => {
		if (!chatContainerRef.current) return;

		const observer = new MutationObserver(() => {
			messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
		});

		observer.observe(chatContainerRef.current, {
			childList: true,
			subtree: true,
		});

		return () => observer.disconnect();
	}, [messagesEndRef]);

	useEffect(() => {
		if (!remoteStreams || !audioStarted) return;

		remoteStreams.forEach((stream) => {
			const audioElement = audioRefs.current[stream.id];
			if (audioElement && audioElement.srcObject !== stream) {
				audioElement.srcObject = stream;
			}
		});
	}, [remoteStreams, audioStarted]);

	const handleMessageChange = useCallback(
		(value: string) => {
			onMessageChange(value);
		},
		[onMessageChange]
	);

	const handleSendMessage = useCallback(() => {
		onSendMessage();
	}, [onSendMessage]);

	return (
		<div className={styles.chatContainer}>
			{assistantInfo && (
				<StatusBar
					receiverInfo={assistantInfo}
					isVoiceEnabled={isVoiceEnabled}
					onToggleVoice={onToggleVoice}
				/>
			)}
			<div className={styles.messagesContainer} ref={chatContainerRef}>
				{messages.map((message: Message) => (
					<MessageBubble
						key={message.id}
						message={message}
						userInfo={userInfo}
					/>
				))}
				{isStreaming && (
					<div className={styles.typingIndicator}>Assistant is typing...</div>
				)}
				<div ref={messagesEndRef} />
			</div>
			<div className={styles.inputContainer}>
				<InputField
					value={newMessage}
					onChange={handleMessageChange}
					onSend={handleSendMessage}
					disabled={isStreaming}
				/>
				<SendButton onClick={handleSendMessage} disabled={isStreaming} />
			</div>
			{!audioStarted && remoteStreams && remoteStreams.length > 0 && (
				<button onClick={startAudio} className={styles.startAudioButton}>
					Start Audio
				</button>
			)}
			{audioStarted &&
				remoteStreams &&
				remoteStreams.map((stream) => (
					<audio
						key={stream.id}
						ref={(element) => {
							audioRefs.current[stream.id] = element;
						}}
						autoPlay
						controls={true}
						style={{display: "none"}}
					/>
				))}
		</div>
	);
};

export default React.memo(ChatUI);
