// components/MenuCard.tsx
import {useState} from "react";
import {Heart, Utensils, ImageIcon} from "lucide-react";
import Image from "next/image";
import styles from "@/components/FoodPlanner/styles/MenuCard.module.css";
import {FoodItem} from "../types";

interface MenuCardProps {
	food: FoodItem;
}

export const MenuCard: React.FC<MenuCardProps> = ({food}) => {
	const [isLiked, setIsLiked] = useState(false);
	const [imageError, setImageError] = useState(false);

	return (
		<div className={styles.card}>
			<div className={styles.imageContainer}>
				{!imageError ? (
					<Image
						src={food.imageUrl}
						alt={food.name}
						className={styles.image}
						width={400}
						height={300}
						onError={() => setImageError(true)}
						priority={false}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				) : (
					<div className={styles.placeholderContainer}>
						<ImageIcon size={40} className={styles.placeholderIcon} />
						<span className={styles.placeholderText}>{food.name}</span>
					</div>
				)}
				<button
					onClick={() => setIsLiked(!isLiked)}
					className={styles.likeButton}
					aria-label={isLiked ? "Unlike" : "Like"}
				>
					<Heart
						size={18}
						color={isLiked ? "#ff4d4d" : "#666"}
						fill={isLiked ? "#ff4d4d" : "none"}
					/>
				</button>
			</div>

			<div className={styles.content}>
				<div className={styles.cardHeader}>
					<h3 className={styles.foodName}>{food.name}</h3>
					<span className={styles.price}>${food.price.toFixed(2)}</span>
				</div>

				<div className={styles.tags}>
					{Array.from(food.mealType).map((type) => (
						<span key={type} className={styles.tag}>
							{type}
						</span>
					))}
				</div>

				<p className={styles.nutrition}>
					{food.calories} cal • {food.protein}g protein
				</p>
			</div>

			<div className={styles.footer}>
				<div className={styles.quantity}>
					<Utensils size={14} />
					<span>{food.quantity}</span>
				</div>
			</div>
		</div>
	);
};
