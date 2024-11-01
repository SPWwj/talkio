// ChatComponent.tsx
import React, {useState} from "react";
import {useChatService} from "../hooks/useChatService";

type ChatComponentProps = {
	accessToken: string;
	room: string;
};

const ChatComponent: React.FC<ChatComponentProps> = ({accessToken, room}) => {
	const {messages, sendMessage, roomMembers, notifications} = useChatService(
		accessToken,
		room
	);
	const [newMessage, setNewMessage] = useState("");

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			sendMessage(newMessage);
			setNewMessage("");
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<div className="chat-container">
			<h2 className="chat-header">Chat Room: {room}</h2>

			<div className="chat-layout">
				{/* Members sidebar */}
				<div className="members-sidebar">
					<h3 className="sidebar-header">Members</h3>
					<ul className="members-list">
						{roomMembers.map((member, index) => (
							<li key={index} className="member-item">
								{member}
							</li>
						))}
					</ul>
				</div>

				{/* Chat area */}
				<div className="chat-main">
					{/* System notifications */}
					{notifications?.slice(-1)[0] && (
						<div className="notification-area">
							<p className="notification-text">{notifications.slice(-1)[0]}</p>
						</div>
					)}

					{/* Messages */}
					<div className="messages-container">
						{messages.map((msg, index) => (
							<div key={index} className="message-item">
								<span className="message-username">{msg.userName}: </span>
								<span className="message-text">{msg.message}</span>
							</div>
						))}
					</div>

					{/* Message input */}
					<div className="input-container">
						<input
							type="text"
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Type your message..."
							className="message-input"
						/>
						<button onClick={handleSendMessage} className="send-button">
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatComponent;
