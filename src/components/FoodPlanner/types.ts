// types.ts
export interface FoodItem {
  id: string; // Added static ID field
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  price: number;
  restaurant: string;
  mealType: Set<string>;
  quantity: number;
  imageUrl: string;
}
