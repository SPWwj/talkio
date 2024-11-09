import React from "react";
import {MallMapContent} from "./MallMapContent";
import {MallMapProvider} from "./context/MallMapContext";
import {MallMapProps} from "./types";

export const MallMap: React.FC<MallMapProps> = ({
	startLocation,
	endLocation,
}) => {
	return (
		<MallMapProvider startLocation={startLocation} endLocation={endLocation}>
			<MallMapContent />
		</MallMapProvider>
	);
};

export default MallMap;
