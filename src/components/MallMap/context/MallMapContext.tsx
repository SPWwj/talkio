import React, {createContext, useState, useEffect} from "react";
import {stores} from "../data/stores";
import {
	MallMapContextType,
	MallMapProviderProps,
	DirectoryItem,
	DirectoryCategory,
} from "../types";

export const MallMapContext = createContext<MallMapContextType | undefined>(
	undefined
);

export const MallMapProvider: React.FC<MallMapProviderProps> = ({
	children,
	startLocation,
	endLocation,
}) => {
	const [selectedStore, setSelectedStore] = useState<DirectoryItem | null>(
		null
	);
	const [filter, setFilter] = useState<DirectoryCategory | "all">("all");

	console.log("Start Location:", startLocation);
	console.log("End Location:", endLocation);

	const startStore =
		stores.find((s) => s.location === startLocation) || stores[0];

	useEffect(() => {
		console.log("Search for end location: " + endLocation);
		const endStore = stores.find((s) => s.location === endLocation);
		console.log("location found: " + endStore);

		if (endStore) {
			setSelectedStore(endStore);
		}
	}, [endLocation]);

	const handleStoreSelect = (store: DirectoryItem) => {
		if (store.id === startStore.id) return;
		setSelectedStore(store);
	};

	const clearFilter = () => {
		setFilter("all");
	};

	const filteredStores = stores.filter(
		(store) => filter === "all" || store.category === filter
	);

	return (
		<MallMapContext.Provider
			value={{
				selectedStore,
				filter,
				startStore,
				filteredStores,
				handleStoreSelect,
				setFilter,
				clearFilter,
			}}
		>
			{children}
		</MallMapContext.Provider>
	);
};
