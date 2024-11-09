"use client";
// pages/mallMap.tsx
import MallMap from "@/components/MallMap/MallMap";
import React from "react";

const MallMapPage: React.FC = () => {
	return (
		<div>
			<h1>Mall Map</h1>
			<MallMap
				startLocation="Level 1, West Wing #L1-05"
				endLocation="Level 2, West Wing #02-08"
			/>
		</div>
	);
};

export default MallMapPage;
