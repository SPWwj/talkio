// components/ParticipantsList.tsx

import React from "react";
import styles from "../app/chat_room/VoiceChat.module.css";
import {Participant} from "@/app/types/types";

interface ParticipantsListProps {
	myParticipantInfo: Participant | null;
	participants: Map<string, Participant>;
	isMuted: boolean;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({
	myParticipantInfo,
	participants,
	isMuted,
}) => (
	<div className={styles.participantsSection}>
		<h3>Participants ({participants.size})</h3>
		<div className={styles.participantCard}>
			{myParticipantInfo && (
				<div className={styles.participantCard}>
					<div>{myParticipantInfo.displayName} (You)</div>
					<div>{isMuted ? "Muted" : "Active"}</div>
				</div>
			)}
			{Array.from(participants.values()).map((participant) => (
				<div key={participant.participantId} className={styles.participantCard}>
					<div>{participant.displayName}</div>
					<div>Connected</div>
				</div>
			))}
		</div>
	</div>
);
