import { LucideIcon } from "lucide-react";

export interface PathNode {
  landmark: string;
  direction: string;
  description: string;
}
export interface DirectoryItem {
  id: string;
  name: string;
  category: DirectoryCategory;
  location: string;
  description: string;
  hours: string;
  priceRange: string;
  contact: string;
  path: PathNode[];
}

export type DirectoryCategory =
  | "Dining"
  | "Dessert"
  | "Facility";

export type CategoryIcons = {
  [ K in DirectoryCategory ]: LucideIcon;
};

export type CategoryColors = {
  [ K in DirectoryCategory ]: string;
};

export interface MallMapContextType {
  selectedStore: DirectoryItem | null;
  filter: DirectoryCategory | "all";
  startStore: DirectoryItem;
  filteredStores: DirectoryItem[];
  handleStoreSelect: (store: DirectoryItem) => void;
  setFilter: (filter: DirectoryCategory | "all") => void;
  clearFilter: () => void;
}


export interface MallMapProviderProps {
  children: React.ReactNode;
  startLocation: string;
  endLocation: string;
}

export interface MallMapProps {
  startLocation: string;
  endLocation: string;
}