"use client";
import ChatAIContainer from "@/components/Chat/ChatAIContainer";
import ChatContainer from "@/components/Chat/ChatContainer";
import React, { use } from "react";

export default function Page({
    params,
    searchParams,
}: {
    params: Promise<{ roomName: string }>;
    searchParams: Promise<{ accessToken?: string | string[] }>;
}) {
    const { roomName } = use(params);
    const { accessToken } = use(searchParams);

    // Ensure accessToken is a string if it exists
    const token = typeof accessToken === "string" ? accessToken : "";

    return (
        <div>
            <h1>Welcome to Room: {roomName}</h1>
            <p>Your access token: {token}</p>
            <ChatContainer token={"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJ1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.VvAAr5KTI8wIv5qkI88X8qOehQW6nMIWcxiNhq4jXas"} roomId={roomName} />
        </div>
    );
}
