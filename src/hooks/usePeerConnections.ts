"use client"

import { Participant } from '@/types/types';
import { useEffect, useRef } from 'react';

export const usePeerConnections = (
  connectionId: string | null,
  participants: Map<string, Participant>,
  localStream: React.RefObject<MediaStream>
) => {
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const statsIntervals = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  useEffect(() => {
    // Create a ref to store the cleanup function
    const refs = {
      peerConnections: peerConnections.current,
      statsIntervals: statsIntervals.current
    };

    // Set up peer connections
    participants.forEach((participant, participantId) => {
      if (!refs.peerConnections.has(participantId)) {
        const peerConnection = new RTCPeerConnection({
          iceServers: [ { urls: 'stun:stun.l.google.com:19302' } ],
        });
        refs.peerConnections.set(participantId, peerConnection);
      }
    });

    return () => {
      // Close all peer connections
      refs.peerConnections.forEach((pc) => pc.close());
      refs.peerConnections.clear();

      // Clear all intervals
      refs.statsIntervals.forEach(clearInterval);
      refs.statsIntervals.clear();
    };
  }, [ connectionId, participants, localStream ]);

  // Return any necessary values or methods
  return {
    getPeerConnection: (participantId: string) => peerConnections.current.get(participantId),
    getAllPeerConnections: () => peerConnections.current
  };
};