import React, { useEffect, useState } from "react";
import { useRive } from "@rive-app/react-canvas";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import styles from "@/components/UI/StatusBar.module.css";
import { ReceiverInfo } from "@/types/message";

interface StatusBarProps {
  receiverInfo: ReceiverInfo;
}

export default function StatusBar({ receiverInfo }: StatusBarProps) {
  const { RiveComponent: SmallAvatar } = useRive({
    src: "/rive/cat_not_track_mouse.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  const { RiveComponent: LargeAvatar } = useRive({
    src: "/rive/cat_not_track_mouse.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVoiceToggle = () => {
    setIsVoiceEnabled((prev) => !prev);
  };

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className={styles.statusBar}>
      <div className={styles.appTitle}>
        Chat with {receiverInfo.name}
      </div>

      <div className={styles.avatarContainer}>
        <div className={styles.avatar} onClick={handleAvatarClick}>
          <SmallAvatar />
        </div>

        <div className={styles.voiceToggleIcon} onClick={handleVoiceToggle}>
          {isVoiceEnabled ? (
            <FaMicrophone className={styles.iconEnabled} />
          ) : (
            <FaMicrophoneSlash className={styles.iconDisabled} />
          )}
        </div>

        <div className={styles.receiverCard}>
          <h3>{receiverInfo.name}</h3>

          {/* Conditionally render fields based on receiver type */}
          {"model" in receiverInfo && receiverInfo.model && (
            <p>
              <strong>Model:</strong> {receiverInfo.model}
            </p>
          )}
          <p>
            <strong>Description:</strong>{" "}
            {receiverInfo.description || "No description available."}
          </p>
          {receiverInfo.createdAt && (
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(receiverInfo.createdAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.largeAvatar}>
              <LargeAvatar />
            </div>
            <div className={styles.detailedInfo}>
              <h3>{receiverInfo.name}</h3>

              {"model" in receiverInfo && receiverInfo.model && (
                <p>
                  <strong>Model:</strong> {receiverInfo.model}
                </p>
              )}
              <p>
                <strong>Description:</strong>{" "}
                {receiverInfo.description || "No description available."}
              </p>
              {receiverInfo.createdAt && (
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(receiverInfo.createdAt).toLocaleString()}
                </p>
              )}
              {"metadata" in receiverInfo && receiverInfo.metadata && (
                <p>
                  <strong>Metadata:</strong> {receiverInfo.metadata.toString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
