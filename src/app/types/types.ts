// types.ts

export interface Participant {
  participantId: string;
  displayName: string;
}

export interface Message {
  senderId: string;
  message: string;
  timestamp: string;
}
