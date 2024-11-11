// pages/menu.tsx

import SpecializedMenu from "@/components/FoodPlanner/components/SpecializedMenu";
import {mockFoods} from "@/components/FoodPlanner/mockData";

export default function MenuPage() {
	return <SpecializedMenu restaurantName="Our Restaurant" foods={mockFoods} />;
}
