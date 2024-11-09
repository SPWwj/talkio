import { DirectoryItem } from "../types";

export const stores: DirectoryItem[] = [
  {
    id: "1",
    name: "Din Tai Fung",
    category: "Dining",
    location: "Level 3, North Wing #03-12",
    description: "Taiwanese cuisine, Famous for xiaolongbao and dumplings. Michelin-starred restaurant known for exceptional dim sum and noodles.",
    hours: "11:00 AM - 10:00 PM",
    priceRange: "$$$",
    contact: "555-0201",
    path: [
      { landmark: "Main Entrance", direction: "Go up", description: "Take the escalator to Level 3" },
      { landmark: "North Wing", direction: "Turn right", description: "Walk along the corridor" },
      { landmark: "Din Tai Fung", direction: "Arrive", description: "Restaurant on your right" }
    ]
  },
  {
    id: "2",
    name: "Sushi Tei",
    category: "Dining",
    location: "Level 2, East Wing #02-15",
    description: "Japanese cuisine specializing in fresh sushi, sashimi, and authentic Japanese dishes. Features a conveyor belt sushi system.",
    hours: "11:30 AM - 10:00 PM",
    priceRange: "$$",
    contact: "555-0202",
    path: [
      { landmark: "Main Entrance", direction: "Go up", description: "Take the escalator to Level 2" },
      { landmark: "East Wing", direction: "Turn left", description: "Walk past several stores" },
      { landmark: "Sushi Tei", direction: "Arrive", description: "Restaurant on your left" }
    ]
  },
  {
    id: "3",
    name: "Seoul Garden",
    category: "Dining",
    location: "Level 3, South Wing #03-22",
    description: "Korean BBQ buffet featuring a wide selection of meats, seafood, and traditional Korean dishes. Interactive dining experience.",
    hours: "11:30 AM - 10:00 PM",
    priceRange: "$$",
    contact: "555-0203",
    path: [
      { landmark: "Main Entrance", direction: "Go up", description: "Take the escalator to Level 3" },
      { landmark: "South Wing", direction: "Turn right", description: "Walk past a few stores" },
      { landmark: "Seoul Garden", direction: "Arrive", description: "Restaurant ahead on your left" }
    ]
  },
  {
    id: "4",
    name: "Thai Basil",
    category: "Dining",
    location: "Level 2, West Wing #02-08",
    description: "Authentic Thai cuisine featuring traditional dishes with fresh ingredients. Known for pad thai and green curry.",
    hours: "11:30 AM - 9:30 PM",
    priceRange: "$$",
    contact: "555-0204",
    path: [
      { landmark: "Main Entrance", direction: "Go up", description: "Take the escalator to Level 2" },
      { landmark: "West Wing", direction: "Go straight", description: "Walk along the corridor" },
      { landmark: "Thai Basil", direction: "Arrive", description: "Restaurant on your right" }
    ]
  },
  {
    id: "5",
    name: "The Manhattan STEAKHOUSE",
    category: "Dining",
    location: "Level 3, West Wing #03-01",
    description: "Premium steakhouse serving high-quality cuts of beef. Extensive wine selection and elegant dining atmosphere.",
    hours: "12:00 PM - 11:00 PM",
    priceRange: "$$$$",
    contact: "555-0205",
    path: [
      { landmark: "Main Entrance", direction: "Go up", description: "Take the escalator to Level 3" },
      { landmark: "West Wing", direction: "Turn left", description: "Walk along the corridor" },
      { landmark: "The Manhattan STEAKHOUSE", direction: "Arrive", description: "Restaurant on your left" }
    ]
  },
  {
    id: "6",
    name: "Pizza Express",
    category: "Dining",
    location: "Level 2, Central Wing #02-32",
    description: "Italian restaurant specializing in hand-made pizzas and pasta. Authentic Italian recipes and ingredients.",
    hours: "11:00 AM - 10:00 PM",
    priceRange: "$$",
    contact: "555-0206",
    path: [
      { landmark: "Main Entrance", direction: "Go up", description: "Take the escalator to Level 2" },
      { landmark: "Central Wing", direction: "Go straight", description: "Walk along the main corridor" },
      { landmark: "Pizza Express", direction: "Arrive", description: "Restaurant on your right" }
    ]
  },
  {
    id: "7",
    name: "McDonald's",
    category: "Dining",
    location: "Level 1, South Wing #01-05",
    description: "Global fast-food chain serving burgers, fries, and other quick meals. Features McCafé and dessert counter.",
    hours: "8:00 AM - 11:00 PM",
    priceRange: "$",
    contact: "555-0207",
    path: [
      { landmark: "Main Entrance", direction: "Turn right", description: "Walk along the main hallway" },
      { landmark: "South Wing", direction: "Continue straight", description: "Pass a few stores" },
      { landmark: "McDonald's", direction: "Arrive", description: "Restaurant on your left" }
    ]
  },
  {
    id: "8",
    name: "KFC",
    category: "Dining",
    location: "Level 2, Food Court #FC-01",
    description: "Famous fried chicken restaurant offering various chicken meals, sides, and sandwiches.",
    hours: "10:00 AM - 10:00 PM",
    priceRange: "$",
    contact: "555-0208",
    path: [
      { landmark: "Main Entrance", direction: "Go up", description: "Take the escalator to Level 2" },
      { landmark: "Food Court", direction: "Turn left", description: "Follow the signs to the food court" },
      { landmark: "KFC", direction: "Arrive", description: "Restaurant on your right" }
    ]
  },
  {
    id: "9",
    name: "Food Republic",
    category: "Dining",
    location: "Level 2, Central Wing #02-09",
    description: "Large food court featuring diverse local and international cuisine. Multiple stalls offering various dishes.",
    hours: "10:00 AM - 10:00 PM",
    priceRange: "$",
    contact: "555-0209",
    path: [
      { landmark: "Main Entrance", direction: "Go up", description: "Take the escalator to Level 2" },
      { landmark: "Central Wing", direction: "Go straight", description: "Walk along the main corridor" },
      { landmark: "Food Republic", direction: "Arrive", description: "Food court on your left" }
    ]
  },
  {
    id: "10",
    name: "Starbucks",
    category: "Dining",
    location: "Level 1, North Wing #01-01",
    description: "Popular coffee chain serving specialty coffee drinks, teas, pastries, and light meals.",
    hours: "8:00 AM - 10:00 PM",
    priceRange: "$$",
    contact: "555-0210",
    path: [
      { landmark: "Main Entrance", direction: "Go straight", description: "Continue along the main corridor" },
      { landmark: "North Wing", direction: "Arrive", description: "Coffee shop on your right" }
    ]
  },
  {
    id: "11",
    name: "Coffee Bean & Tea Leaf",
    category: "Dining",
    location: "Level 2, North Wing #02-03",
    description: "Specialty coffee and tea cafe offering premium beverages, cakes, and light snacks.",
    hours: "9:00 AM - 9:30 PM",
    priceRange: "$$",
    contact: "555-0211",
    path: [
      { landmark: "Main Entrance", direction: "Go up", description: "Take the escalator to Level 2" },
      { landmark: "North Wing", direction: "Turn right", description: "Walk past several stores" },
      { landmark: "Coffee Bean & Tea Leaf", direction: "Arrive", description: "Cafe on your left" }
    ]
  },
  {
    id: "12",
    name: "Häagen-Dazs",
    category: "Dessert",
    location: "Level 2, North Wing #02-05",
    description: "Premium ice cream parlor offering various flavors, sundaes, and ice cream cakes.",
    hours: "11:00 AM - 10:00 PM",
    priceRange: "$$",
    contact: "555-0212",
    path: [
      { landmark: "Main Entrance", direction: "Go up", description: "Take the escalator to Level 2" },
      { landmark: "North Wing", direction: "Turn right", description: "Walk past Coffee Bean" },
      { landmark: "Häagen-Dazs", direction: "Arrive", description: "Ice cream parlor on your right" }
    ]
  },
  {
    id: "13",
    name: "Lady M",
    category: "Dessert",
    location: "Level 1, East Wing #01-25",
    description: "Luxury cake boutique known for Mille Crêpes and high-end pastries.",
    hours: "11:00 AM - 9:00 PM",
    priceRange: "$$$",
    contact: "555-0213",
    path: [
      { landmark: "Main Entrance", direction: "Turn left", description: "Walk towards East Wing" },
      { landmark: "East Wing", direction: "Continue straight", description: "Pass several stores" },
      { landmark: "Lady M", direction: "Arrive", description: "Cake boutique on your right" }
    ]
  },
  {
    id: "14",
    name: "Restroom",
    category: "Facility",
    location: "All Levels, Near Elevators #E-01",
    description: "Public restrooms with baby changing facilities. Wheelchair accessible.",
    hours: "Mall Hours",
    priceRange: "Free",
    contact: "N/A",
    path: [
      { landmark: "Main Entrance", direction: "Follow signs", description: "Look for restroom signs near elevators" },
      { landmark: "Elevators", direction: "Arrive", description: "Restrooms located next to elevators" }
    ]
  },
  {
    id: "15",
    name: "Information Counter",
    category: "Facility",
    location: "Level 1, Central Atrium #C-02",
    description: "Customer service counter for mall information, lost and found, and concierge services.",
    hours: "10:00 AM - 10:00 PM",
    priceRange: "Free",
    contact: "555-0001",
    path: [
      { landmark: "Main Entrance", direction: "Go straight", description: "Walk towards Central Atrium" },
      { landmark: "Central Atrium", direction: "Arrive", description: "Information Counter in the center" }
    ]
  },
  {
    id: "16",
    name: "ATM Zone",
    category: "Facility",
    location: "Level 1, Near Main Entrance #ATM-01",
    description: "Multiple ATMs from major banks available. Currency exchange service nearby.",
    hours: "24/7",
    priceRange: "Free",
    contact: "N/A",
    path: [
      { landmark: "Main Entrance", direction: "Turn right", description: "Look for ATM signs" },
      { landmark: "ATM Zone", direction: "Arrive", description: "ATMs located along the wall" }
    ]
  },
  {
    id: "17",
    name: "Mall Food Court",
    category: "Dining",
    location: "Level 1, West Wing #L1-05",
    description: "Food court with a variety of local and international food stalls. Seating area available.",
    hours: "10:00 AM - 10:00 PM",
    priceRange: "$",
    contact: "555-0214",
    path: [
      { landmark: "Main Entrance", direction: "Turn left", description: "Head towards West Wing" },
      { landmark: "West Wing", direction: "Go straight", description: "Follow signs to Food Court" },
      { landmark: "Mall Food Court", direction: "Arrive", description: "Food Court entrance ahead" }
    ]
  }, {
    id: "18", 
    name: "Main Entrance",
    category: "Facility",
    location: "Ground Floor, North Wing #GF-01",
    description: "Primary entrance to the mall with direct access to parking and public transport.",
    hours: "24/7",
    priceRange: "Free",
    contact: "N/A",
    path: [
      { landmark: "Main Entrance", direction: "You are here", description: "This is the main entrance of the mall" }
    ]
  },
];