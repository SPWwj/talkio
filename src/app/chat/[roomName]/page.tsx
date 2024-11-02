"use client";
"use client";
import ChatAIContainer from "@/components/Chat/ChatAIContainer";
import ChatContainer from "@/components/Chat/ChatContainer";
import React, { use } from "react";

export default function Page({
    params,
    searchParams,
}: {
    params: Promise<{ roomName: string }>;
    searchParams: Promise<{ token: string }>;
}) {
    const { roomName } = use(params);
    const { token } = use(searchParams);

    // Ensure accessToken is a string if it exists

    return (
        <div>
            <h1>Welcome to Room: {roomName}</h1>
            <p>Your access token: {token}</p>
            <ChatContainer token={token} roomId={roomName} />
        </div>
    );
}
//http://localhost:3000/chat/123?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJ1c2VybmFtZSI6IlNQV3dqIiwiaWF0IjoxNTE2MjM5MDIyfQ.QCUDYTCX1p_1UrX6hW1Kx4jUsWF9YIVFPA_i8-ahOVA
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5ODc2NTQzMjEiLCJ1c2VybmFtZSI6IldoYWxlamF5IiwiaWF0IjoxNTE3Nzc3Nzc3fQ.H4N0qyv2gxBRRiNjbdBXyj6qDGshH8DfDRAh7vKNbkg