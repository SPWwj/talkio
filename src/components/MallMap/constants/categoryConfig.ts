import {
  UtensilsCrossed,
  IceCream2,
  Building2
} from "lucide-react";
import { CategoryIcons, CategoryColors } from "../types";

// Define icons for each category
export const categoryIcons: CategoryIcons = {
  "Dining": UtensilsCrossed,
  "Dessert": IceCream2,
  "Facility": Building2
};

// Define colors for each category
export const categoryColors: CategoryColors = {
  "Dining": "text-blue-600",
  "Dessert": "text-pink-500",
  "Facility": "text-gray-600"
};