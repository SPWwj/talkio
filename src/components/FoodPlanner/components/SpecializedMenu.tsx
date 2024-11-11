"use client";
// components/SpecializedMenu.tsx
import {useState} from "react";
import {MenuCard} from "./MenuCard";
import {FoodItem} from "../types";
import styles from "@/components/FoodPlanner/styles/Menu.module.css";

interface MenuProps {
	restaurantName: string;
	foods: FoodItem[];
}

export const SpecializedMenu: React.FC<MenuProps> = ({
	restaurantName,
	foods,
}) => {
	const [selectedMealType, setSelectedMealType] = useState<string>("all");
	const mealTypes = new Set(foods.flatMap((food) => Array.from(food.mealType)));
	const filteredFoods =
		selectedMealType === "all"
			? foods
			: foods.filter((food) => food.mealType.has(selectedMealType));

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h1 className={styles.title}>{restaurantName}</h1>
			</header>

			<div className={styles.filterContainer}>
				<button
					className={
						selectedMealType === "all"
							? styles.filterButtonActive
							: styles.filterButton
					}
					onClick={() => setSelectedMealType("all")}
				>
					All
				</button>
				{Array.from(mealTypes).map((type) => (
					<button
						key={type}
						className={
							selectedMealType === type
								? styles.filterButtonActive
								: styles.filterButton
						}
						onClick={() => setSelectedMealType(type)}
					>
						{type}
					</button>
				))}
			</div>

			<div className={styles.grid}>
				{filteredFoods.map((food, index) => (
					<MenuCard key={index} food={food} />
				))}
			</div>
		</div>
	);
};

export default SpecializedMenu;
