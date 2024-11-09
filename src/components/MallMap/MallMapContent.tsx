import React from "react";
import {MapPin, ArrowRight, CircleDot, Info, X, Target} from "lucide-react";
import {useMallMap} from "./hooks/useMallMap";
import {PathNode, DirectoryCategory} from "./types";
import styles from "./MallMap.module.css";
import {categoryIcons} from "./constants/categoryConfig";

export const MallMapContent: React.FC = () => {
	const {
		selectedStore,
		filter,
		startStore,
		filteredStores,
		handleStoreSelect,
		setFilter,
		clearFilter,
	} = useMallMap();

	const renderPathStep = (node: PathNode, index: number, isLast: boolean) => (
		<div key={index} className={styles.pathStep}>
			<CircleDot className={styles.pathStepIcon} size={20} />
			<div className={styles.pathStepContent}>
				<div className={styles.pathStepTitle}>{node.landmark}</div>
				<div className={styles.pathStepDescription}>{node.description}</div>
			</div>
			{!isLast && (
				<div className={styles.pathStepDirection}>
					<ArrowRight size={20} />
					<span className={styles.pathStepDirectionText}>{node.direction}</span>
				</div>
			)}
		</div>
	);

	const renderPath = () => {
		if (!selectedStore || selectedStore.id === startStore.id) return null;

		return (
			<div className={styles.pathContainer}>
				<div className={styles.pathContent}>
					<div className={styles.pathHeader}>
						<MapPin className={styles.pathHeaderIcon} />
						<span className={styles.pathHeaderText}>
							Path from {startStore.name} to {selectedStore.name}
						</span>
					</div>

					<div>
						{selectedStore.path.map((node, index) =>
							renderPathStep(
								node,
								index,
								index === selectedStore.path.length - 1
							)
						)}
					</div>

					<div className={styles.pathArrival}>
						<Info size={16} className={styles.pathArrivalIcon} />
						<span className={styles.pathArrivalText}>
							Arrived at {selectedStore.name}
						</span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.startLocation}>
					<MapPin className={styles.startLocationIcon} size={24} />
					<div>
						<div className={styles.startLocationTitle}>{startStore.name}</div>
						<div className={styles.startLocationSubtitle}>
							{startStore.location}
						</div>
					</div>
				</div>

				{selectedStore && selectedStore.id !== startStore.id && (
					<div className={styles.destinationLocation}>
						<Target className={styles.destinationLocationIcon} size={24} />
						<div>
							<div className={styles.destinationLocationTitle}>
								Destination: {selectedStore.name}
							</div>
							<div className={styles.destinationLocationSubtitle}>
								{selectedStore.location}
							</div>
						</div>
					</div>
				)}

				<div className={styles.filterContainer}>
					{filter !== "all" && (
						<button onClick={clearFilter} className={styles.clearFilterButton}>
							<X size={16} />
							<span>Clear Filter</span>
						</button>
					)}
					{(Object.keys(categoryIcons) as DirectoryCategory[]).map(
						(category) => {
							const Icon = categoryIcons[category];
							return (
								<button
									key={category}
									onClick={() =>
										setFilter(filter === category ? "all" : category)
									}
									className={
										filter === category
											? styles.filterButtonActive
											: styles.filterButton
									}
									title={`Filter ${category}`}
								>
									<Icon size={20} />
									<span className={styles.filterButtonText}>{category}</span>
								</button>
							);
						}
					)}
				</div>
			</div>

			{renderPath()}

			<div className={styles.storeGrid}>
				{filteredStores.map((store) => {
					const Icon = categoryIcons[store.category];
					const isStart = store.id === startStore.id;
					const isSelected = store.id === selectedStore?.id;

					let cardClassName = styles.storeCard;
					if (isStart) {
						cardClassName = styles.startStore;
					} else if (isSelected) {
						cardClassName = styles.storeCardSelected;
					}

					return (
						<div
							key={store.id}
							className={`${cardClassName} ${store.category}`}
							onClick={() => !isStart && handleStoreSelect(store)}
						>
							<div className={styles.storeCardHeader}>
								<Icon size={24} />
								<div className={styles.storeCardContent}>
									<div className={styles.storeCardTitle}>{store.name}</div>
									<div className={styles.storeCardLocation}>
										{store.location}
									</div>
								</div>
							</div>
							{isStart && (
								<div className={styles.startStoreBadge}>
									<MapPin size={14} className={styles.storeCardBadgeIcon} />
									<span>Current Location</span>
								</div>
							)}
							{isSelected && !isStart && (
								<div className={styles.selectedStoreBadge}>
									<Target size={14} className={styles.storeCardBadgeIcon} />
									<span>Selected Destination</span>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};
