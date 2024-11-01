// "use client";
// import React from "react";
// import styles from "./VoiceChat.module.css";

// import {StatusIndicator} from "@/components/StatusIndicator";
// import {ParticipantsList} from "@/components/ParticipantsList";
// import {ChatSection} from "@/components/ChatSection";
// import {useSignalRConnection} from "@/hooks/useSignalRConnection";
// import {usePeerConnections} from "@/hooks/usePeerConnections";

// const VoiceChat: React.FC = () => {
// 	const roomId = "123";
// 	const {
// 		connectionStatus,
// 		isMuted,
// 		myParticipantInfo,
// 		participants,
// 		localStream,
// 		toggleMute,
// 		messages,
// 		newMessage,
// 		setNewMessage,
// 		handleSendMessage,
// 		connectionId,
// 		connection, // Get the connection from the hook
// 		debugInfo,
// 	} = useSignalRConnection(roomId);

// 	// Pass the connection to usePeerConnections
// 	usePeerConnections(connectionId, participants, localStream);

// 	// Guard against unmounted state
// 	if (!connection) {
// 		return (
// 			<div className={styles.container}>
// 				<div className={styles.card}>
// 					<div className={styles.header}>
// 						<h2 className={styles.title}>Voice Chat - Room {roomId}</h2>
// 						<StatusIndicator connectionStatus="Connecting..." />
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className={styles.container}>
// 			<div className={styles.card}>
// 				<div className={styles.header}>
// 					<h2 className={styles.title}>Voice Chat - Room {roomId}</h2>
// 					<StatusIndicator connectionStatus={connectionStatus} />
// 				</div>

// 				<button
// 					onClick={toggleMute}
// 					className={`${styles.button} ${
// 						isMuted ? styles.buttonMuted : styles.buttonUnmuted
// 					}`}
// 					disabled={!localStream.current}
// 				>
// 					{isMuted ? "Unmute Microphone" : "Mute Microphone"}
// 				</button>

// 				<div className={styles.audioIndicator}>
// 					<div
// 						className={`${styles.audioIndicator} ${
// 							localStream?.current?.active
// 								? styles.audioReady
// 								: styles.audioNotReady
// 						}`}
// 					/>
// 					{localStream?.current?.active ? (
// 						<span className={styles.audioStatus}>
// 							Audio Ready {isMuted ? "(Muted)" : "(Active)"}
// 						</span>
// 					) : (
// 						<span className={styles.audioStatus}>No Audio</span>
// 					)}
// 				</div>

// 				<ParticipantsList
// 					myParticipantInfo={myParticipantInfo}
// 					participants={participants}
// 					isMuted={isMuted}
// 				/>

// 				<ChatSection
// 					messages={messages}
// 					newMessage={newMessage}
// 					setNewMessage={setNewMessage}
// 					handleSendMessage={handleSendMessage}
// 					myParticipantId={connectionId || ""}
// 				/>

// 				{process.env.NODE_ENV === "development" && (
// 					<div className={styles.debugInfo}>
// 						{debugInfo.map((info, index) => (
// 							<div key={index}>{info}</div>
// 						))}
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// };

// export default VoiceChat;
