"use client";
import React from "react";
import styles from "./VoiceChat.module.css";
import {useSignalRConnection} from "@/hooks/useSignalRConnection";
import {usePeerConnections} from "@/hooks/usePeerConnections";
import {StatusIndicator} from "@/components/StatusIndicator";
import {ParticipantsList} from "@/components/ParticipantsList";
import {ChatSection} from "@/components/ChatSection";

const VoiceChat: React.FC = () => {
	const roomId = "123";
	const {
		connectionStatus,
		isMuted,
		myParticipantInfo,
		participants,
		localStream,
		toggleMute,
		messages,
		newMessage,
		setNewMessage,
		handleSendMessage,
		connectionId,
		debugInfo,
	} = useSignalRConnection(roomId);

	usePeerConnections(connectionId, participants, localStream);

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<div className={styles.header}>
					<h2 className={styles.title}>Voice Chat - Room {roomId}</h2>
					<StatusIndicator connectionStatus={connectionStatus} />
				</div>

				<button
					onClick={toggleMute}
					className={`${styles.button} ${
						isMuted ? styles.buttonMuted : styles.buttonUnmuted
					}`}
				>
					{isMuted ? "Unmute Microphone" : "Mute Microphone"}
				</button>

				<div className={styles.audioIndicator}>
					<div
						className={`${styles.audioIndicator} ${
							localStream?.current?.active
								? styles.audioReady
								: styles.audioNotReady
						}`}
					/>
					{localStream?.current?.active ? "Audio Ready" : "No Audio"}
				</div>

				<ParticipantsList
					myParticipantInfo={myParticipantInfo}
					participants={participants}
					isMuted={isMuted}
				/>
				<ChatSection
					messages={messages}
					newMessage={newMessage}
					setNewMessage={setNewMessage}
					handleSendMessage={handleSendMessage}
				/>

				<div className={styles.debugInfo}>
					{debugInfo.map((info, index) => (
						<div key={index}>{info}</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default VoiceChat;
