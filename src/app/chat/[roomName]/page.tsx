"use client";
import ChatComponent from "@/components/ChatComponent";
import React, {use} from "react";

export default function Page({
	params,
	searchParams,
}: {
	params: Promise<{roomName: string}>;
	searchParams: Promise<{accessToken?: string | string[]}>;
}) {
	const {roomName} = use(params);
	const {accessToken} = use(searchParams);

	// Ensure accessToken is a string if it exists
	const token = typeof accessToken === "string" ? accessToken : "";

	return (
		<div>
			<h1>Welcome to Room: {roomName}</h1>
			<p>Your access token: {token}</p>
			<ChatComponent accessToken={token} room={roomName} />
		</div>
	);
}