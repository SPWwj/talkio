import React, { useState } from "react";
import { useRive } from "@rive-app/react-canvas";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa"; // Importing icons
import styles from '@/components/UI/StatusBar.module.css';

interface AssistantInfo {
  name: string;
  description?: string;
  model: string;
  createdAt: number;
}

interface StatusBarProps {
  assistantInfo: AssistantInfo;
}

export default function StatusBar({ assistantInfo }: StatusBarProps) {
  // Small avatar Rive instance
  const { RiveComponent: SmallAvatar } = useRive({
    src: "/rive/cat_not_track_mouse.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  // Large avatar Rive instance
  const { RiveComponent: LargeAvatar } = useRive({
    src: "/rive/cat_not_track_mouse.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVoiceToggle = () => {
    setIsVoiceEnabled((prev) => !prev);
    // Add voice enable/disable logic here
  };

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.statusBar}>
      <div className={styles.appTitle}>Chat with Assistant</div>

      <div className={styles.avatarContainer}>
        {/* Small avatar */}
        <div className={styles.avatar} onClick={handleAvatarClick}>
          <SmallAvatar />
        </div>

        {/* Voice Toggle Icon beside avatar */}
        <div className={styles.voiceToggleIcon} onClick={handleVoiceToggle}>
          {isVoiceEnabled ? (
            <FaMicrophone className={styles.iconEnabled} />
          ) : (
            <FaMicrophoneSlash className={styles.iconDisabled} />
          )}
        </div>

        <div className={styles.assistantCard}>
          <h3>{assistantInfo.name}</h3>
          <p>
            <strong>Model:</strong> {assistantInfo.model}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {assistantInfo.description || "No description available."}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(assistantInfo.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div className={styles.modal} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Large avatar */}
            <div className={styles.largeAvatar}>
              <LargeAvatar />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
