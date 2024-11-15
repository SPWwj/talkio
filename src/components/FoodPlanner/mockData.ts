// mockData.ts
import { FoodItem } from "./types";

export const mockFoods: FoodItem[] = [
  // Breakfast items
  {
    id: "B001",
    name: "Overnight Oats with Fruits",
    calories: 286,
    protein: 12,
    carbs: 45,
    fat: 7,
    sodium: 124,
    price: 6.90,
    restaurant: "Starbucks",
    mealType: new Set(["breakfast"]),
    quantity: 15,
    imageUrl: "/images/Overnight_Oats_with_Fruits.jpg"
  },
  {
    id: "B002",
    name: "Greek Yogurt with Berries",
    calories: 200,
    protein: 12,
    carbs: 25,
    fat: 5,
    sodium: 80,
    price: 5.50,
    restaurant: "Coffee Bean & Tea Leaf",
    mealType: new Set(["breakfast"]),
    quantity: 20,
    imageUrl: "/images/Greek_Yogurt_with_Berries.jpg"
  },
  {
    id: "B003",
    name: "Banana Nut Smoothie",
    calories: 220,
    protein: 10,
    carbs: 35,
    fat: 5,
    sodium: 50,
    price: 4.20,
    restaurant: "Lady M",
    mealType: new Set(["breakfast"]),
    quantity: 18,
    imageUrl: "/images/Banana_Nut_Smoothie.jpg"
  },
  {
    id: "B004",
    name: "Avocado Toast with Egg",
    calories: 300,
    protein: 10,
    carbs: 30,
    fat: 15,
    sodium: 200,
    price: 7.50,
    restaurant: "Brunch Cafe",
    mealType: new Set(["breakfast"]),
    quantity: 16,
    imageUrl: "/images/Avocado_Toast_with_Egg.jpg"
  },
  {
    id: "B005",
    name: "Berry Protein Shake",
    calories: 250,
    protein: 15,
    carbs: 35,
    fat: 6,
    sodium: 120,
    price: 6.00,
    restaurant: "Fitness Bar",
    mealType: new Set(["breakfast"]),
    quantity: 22,
    imageUrl: "/images/Berry_Protein_Shake.png"
  },

  // Lunch items
  {
    id: "L001",
    name: "Chicken Brown Rice Bowl",
    calories: 409,
    protein: 27,
    carbs: 62,
    fat: 8,
    sodium: 378,
    price: 8.90,
    restaurant: "Food Republic",
    mealType: new Set(["lunch"]),
    quantity: 12,
    imageUrl: "/images/Chicken_Brown_Rice_Bowl.jpg"
  },
  {
    id: "L002",
    name: "Grilled Salmon with Quinoa",
    calories: 750,
    protein: 40,
    carbs: 70,
    fat: 25,
    sodium: 400,
    price: 14.00,
    restaurant: "Din Tai Fung",
    mealType: new Set(["lunch"]),
    quantity: 8,
    imageUrl: "/images/Grilled_Salmon_with_Quinoa.jpg"
  },
  {
    id: "L003",
    name: "Beef and Veggie Wrap",
    calories: 720,
    protein: 30,
    carbs: 65,
    fat: 20,
    sodium: 500,
    price: 12.50,
    restaurant: "Sushi Tei",
    mealType: new Set(["lunch"]),
    quantity: 14,
    imageUrl: "/images/Beef_and_Veggie_Wrap.jpg"
  },
  {
    id: "L004",
    name: "Vegan Buddha Bowl",
    calories: 550,
    protein: 15,
    carbs: 80,
    fat: 18,
    sodium: 300,
    price: 9.80,
    restaurant: "Green Eats",
    mealType: new Set(["lunch"]),
    quantity: 10,
    imageUrl: "/images/Vegan_Buddha_Bowl.jpg"
  },
  {
    id: "L005",
    name: "Tofu Stir-fry with Rice",
    calories: 600,
    protein: 20,
    carbs: 75,
    fat: 15,
    sodium: 280,
    price: 8.50,
    restaurant: "Asian Bistro",
    mealType: new Set(["lunch"]),
    quantity: 15,
    imageUrl: "/images/Tofu_Stir_fry_with_Rice.jpg"
  },

  {
    id: "D001",
    name: "Lentil Soup with Whole Grain Bread",
    calories: 400,
    protein: 20,
    carbs: 55,
    fat: 8,
    sodium: 250,
    price: 7.00,
    restaurant: "Mall Food Court",
    mealType: new Set(["dinner"]),
    quantity: 18,
    imageUrl: "/images/Lentil_Soup_with_Whole_Grain_Bread.jpg"
  },
  {
    id: "D002",
    name: "Grilled Chicken Salad",
    calories: 320,
    protein: 30,
    carbs: 12,
    fat: 15,
    sodium: 290,
    price: 10.50,
    restaurant: "Thai Basil",
    mealType: new Set(["dinner"]),
    quantity: 20,
    imageUrl: "/images/Grilled_Chicken_Salad.jpg"
  },
  {
    id: "D003",
    name: "Baked Salmon with Sweet Potato",
    calories: 650,
    protein: 45,
    carbs: 45,
    fat: 20,
    sodium: 500,
    price: 15.00,
    restaurant: "The Manhattan STEAKHOUSE",
    mealType: new Set(["dinner"]),
    quantity: 10,
    imageUrl: "/images/Baked_Salmon_with_Sweet_Potato.jpg"
  },
  {
    id: "D004",
    name: "Spaghetti with Meatballs",
    calories: 680,
    protein: 35,
    carbs: 60,
    fat: 18,
    sodium: 600,
    price: 12.00,
    restaurant: "Pizza Express",
    mealType: new Set(["dinner"]),
    quantity: 25,
    imageUrl: "/images/Spaghetti_with_Meatballs.jpg"
  },
  {
    id: "D005",
    name: "Stuffed Bell Peppers with Quinoa",
    calories: 520,
    protein: 25,
    carbs: 60,
    fat: 15,
    sodium: 320,
    price: 10.00,
    restaurant: "Vegan Delight",
    mealType: new Set(["dinner"]),
    quantity: 16,
    imageUrl: "/images/Stuffed_Bell_Peppers_with_Quinoa.jpg"
  },
  {
    id: "D006",
    name: "Beef Stir-fry with Vegetables",
    calories: 700,
    protein: 40,
    carbs: 50,
    fat: 25,
    sodium: 450,
    price: 13.50,
    restaurant: "Asian Grill",
    mealType: new Set(["dinner"]),
    quantity: 14,
    imageUrl: "/images/Beef_Stir_fry_with_Vegetables.jpg"
  }

];