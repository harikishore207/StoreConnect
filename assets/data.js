// Static image imports
const Images = {
  fruits: {
    banana_local: require("../assets/fruits/banana_local.png"),
    apple_red: require("../assets/fruits/apple_red.png"),
    mango_alphonso: require("../assets/fruits/mango_alphonso.png"),
  },
  staples: {
    rice_indiagate: require("../assets/staples/rice_indiagate.png"),
    wheat_aashirvaad: require("../assets/staples/wheat_aashirvaad.png"),
  },
  beverages: {
    milk_nandhni: require("../assets/beverages/milk_amul.png"),
    milk_arokya: require("../assets/beverages/milk_aro.png"),
    tea_tata: require("../assets/beverages/tea_tata.png"),
    tea_3roses: require("../assets/beverages/tea_3roses.png"),
    coffee_bru: require("../assets/beverages/coffee_bru.png"),
    coffee_sunrise: require("../assets/beverages/coffee_sunrise.png"),
  },
  cleaning: {
    detergent_surf: require("../assets/cleaning/detergent_surf.png"),
  }
};

export const categories = [
  { id: "fruits", name: "Fruits and Vegetables" },
  { id: "staples", name: "Your Daily Staples" },
  { id: "beverages", name: "Beverages" },
  { id: "snacks", name: "Snacks Store" },
  { id: "cleaning", name: "Cleaning & Household" },
  { id: "hygiene", name: "Beauty and Hygiene" },
];

export const products = [
  {
    id: "banana",
    category: "fruits",
    name: "Bananas",
    variants: [
      { brand: "Local Farm", type: "Robusta", quantity: "1 Dozen", price: 40, image: Images.fruits.banana_local },
    ],
  },
  {
    id: "apple",
    category: "fruits",
    name: "Apples",
    variants: [
      { brand: "Washington", type: "Red Apple", quantity: "1kg", price: 120, image: Images.fruits.apple_red },
    ],
  },
  {
    id: "mango",
    category: "fruits",
    name: "Mangoes",
    variants: [
      { brand: "Alphonso", type: "Sweet Mango", quantity: "1kg", price: 200, image: Images.fruits.mango_alphonso },
    ],
  },
  {
    id: "rice",
    category: "staples",
    name: "Rice",
    variants: [
      { brand: "India Gate", type: "Basmati", quantity: "5kg", price: 350, image: Images.staples.rice_indiagate },
    ],
  },
  {
    id: "wheat",
    category: "staples",
    name: "Wheat Flour",
    variants: [
      { brand: "Aashirvaad", type: "Whole Wheat", quantity: "5kg", price: 250, image: Images.staples.wheat_aashirvaad },
    ],
  },
  {
    id: "milk",
    category: "beverages",
    name: "Milk",
    variants: [
      { brand: "Nandhni", type: "Toned Milk", quantity: "1L", price: 60, image: Images.beverages.milk_nandhni },
      { brand: "Arokya", type: "Toned Milk", quantity: "500mL", price: 30, image: Images.beverages.milk_arokya },
    ],
  },
  {
    id: "tea",
    category: "beverages",
    name: "Tea Powder",
    variants: [
      { brand: "Tata", type: "Assam Tea", quantity: "500g", price: 150, image: Images.beverages.tea_tata },
      { brand: "3Roses", type: "Normal Tea", quantity: "500g", price: 150, image: Images.beverages.tea_3roses },
    ],
  },
  {
    id: "coffee",
    category: "beverages",
    name: "Coffee",
    variants: [
      { brand: "Bru", type: "Filter Coffee", quantity: "250g", price: 190, image: Images.beverages.coffee_bru },
      { brand: "sunrise", type: "Instant Coffee", quantity: "200g", price: 180, image: Images.beverages.coffee_sunrise },
    ],
  },
  {
    id: "detergent",
    category: "cleaning",
    name: "Detergent",
    variants: [
      { brand: "Surf Excel", type: "Powder", quantity: "1kg", price: 120, image: Images.cleaning.detergent_surf },
    ],
  },
];
