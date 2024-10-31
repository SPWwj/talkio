// components/StatusIndicator.tsx

import React from "react";
import styles from "../app/chat_room/VoiceChat.module.css";

interface StatusIndicatorProps {
	connectionStatus: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
	connectionStatus,
}) => (
	<div className={styles.status}>
		<span>Status:</span>
		<span
			className={
				connectionStatus === "Connected"
					? styles.statusConnected
					: connectionStatus === "Connecting"
					? styles.statusConnecting
					: styles.statusDisconnected
			}
		>
			{connectionStatus}
		</span>
	</div>
);
