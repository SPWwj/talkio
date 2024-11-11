// components/NutritionLabel.tsx
import styles from "@/components/FoodPlanner/styles/NutritionLabel.module.css";
import {FoodItem} from "../types";

interface NutritionLabelProps {
	food: FoodItem;
}

export const NutritionLabel: React.FC<NutritionLabelProps> = ({food}) => (
	<div className={styles.nutritionContainer}>
		<h3 className={styles.nutritionTitle}>Nutrition Facts</h3>
		<div className={styles.nutritionGrid}>
			<div className={styles.nutritionRow}>
				<span>Calories</span>
				<span>{food.calories}</span>
			</div>
			<div className={styles.nutritionRow}>
				<span>Protein</span>
				<span>{food.protein}g</span>
			</div>
			<div className={styles.nutritionRow}>
				<span>Carbs</span>
				<span>{food.carbs}g</span>
			</div>
			<div className={styles.nutritionRow}>
				<span>Fat</span>
				<span>{food.fat}g</span>
			</div>
			<div className={styles.nutritionRow}>
				<span>Sodium</span>
				<span>{food.sodium}mg</span>
			</div>
		</div>
	</div>
);
