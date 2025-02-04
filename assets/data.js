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
      //{ brand: "Organic", type: "Cavendish", quantity: "1 Dozen", price: 50, image: require("../assets/fruits/banana_organic.png") },
      { brand: "Local Farm", type: "Robusta", quantity: "1 Dozen", price: 40, image: require("../assets/fruits/banana_local.png") },
    ],
  },
  {
    id: "apple",
    category: "fruits",
    name: "Apples",
    variants: [
      { brand: "Washington", type: "Red Apple", quantity: "1kg", price: 120, image: require("../assets/fruits/apple_red.png") },
     // { brand: "Kashmiri", type: "Green Apple", quantity: "1kg", price: 130, image: require("../assets/fruits/apple_green.png") },
    ],
  },
  {
    id: "mango",
    category: "fruits",
    name: "Mangoes",
    variants: [
      { brand: "Alphonso", type: "Sweet Mango", quantity: "1kg", price: 200, image: require("../assets/fruits/mango_alphonso.png") },
     // { brand: "Banganapalli", type: "Yellow Mango", quantity: "1kg", price: 180, image: require("../assets/fruits/mango_banganapalli.png") },
    ],
  },
  {
    id: "rice",
    category: "staples",
    name: "Rice",
    variants: [
      { brand: "India Gate", type: "Basmati", quantity: "5kg", price: 350, image: require("../assets/staples/rice_indiagate.png") },
     // { brand: "Daawat", type: "Long Grain", quantity: "5kg", price: 320, image: require("../assets/staples/rice_daawat.png") },
    ],
  },
  {
    id: "wheat",
    category: "staples",
    name: "Wheat Flour",
    variants: [
      { brand: "Aashirvaad", type: "Whole Wheat", quantity: "5kg", price: 250, image: require("../assets/staples/wheat_aashirvaad.png") },
     // { brand: "Pillsbury", type: "Multigrain", quantity: "5kg", price: 280, image: require("../assets/staples/wheat_pillsbury.png") },
    ],
  },
  {
    id: "milk",
    category: "beverages",
    name: "Milk",
    variants: [
      { brand: "Nandhni", type: "Toned Milk", quantity: "1L", price: 60, image: require("../assets/beverages/milk_amul.png") },
      { brand: "Arokya", type: "Toned Milk", quantity: "500mL", price: 30, image: require("../assets/beverages/milk_aro.png") },
      //{ brand: "Nestle", type: "Full Cream", quantity: "1L", price: 65, image: require("../assets/beverages/milk_nestle.png") },
    ],
  },
  {
    id: "tea",
    category: "beverages",
    name: "Tea Powder",
    variants: [
      { brand: "Tata", type: "Assam Tea", quantity: "500g", price: 150, image: require("../assets/beverages/tea_tata.png") },
      { brand: "3Roses", type: "Normal Tea", quantity: "500g", price: 150, image: require("../assets/beverages/tea_3roses.png") },
     // { brand: "Red Label", type: "Masala Tea", quantity: "500g", price: 160, image: require("../assets/beverages/tea_redlabel.png") },
    ],
  },
  {
    id: "coffee",
    category: "beverages",
    name: "Coffee",
    variants: [
      // { brand: "Nescafe", type: "Instant Coffee", quantity: "200g", price: 180, image: require("../assets/beverages/coffee_nescafe.png") },
      { brand: "Bru", type: "Filter Coffee", quantity: "250g", price: 190, image: require("../assets/beverages/coffee_bru.png") },
      { brand: "sunrise", type: "Instant Coffee", quantity: "200g", price: 180, image: require("../assets/beverages/coffee_sunrise.png") },
    ],
  },
  {
    id: "detergent",
    category: "cleaning",
    name: "Detergent",
    variants: [
      { brand: "Surf Excel", type: "Powder", quantity: "1kg", price: 120, image: require("../assets/cleaning/detergent_surf.png") },
    //   { brand: "Ariel", type: "Liquid", quantity: "1L", price: 150, image: require("../assets/cleaning/detergent_ariel.png") },
    //   { brand: "Tide", type: "Powder", quantity: "2kg", price: 200, image: require("../assets/cleaning/detergent_tide.png") },
     ],
  },
  // {
  //   id: "shampoo",
  //   category: "hygiene",
  //   name: "Shampoo",
  //   variants: [
  //     { brand: "Dove", type: "Anti-Dandruff", quantity: "500ml", price: 200, image: require("../assets/hygiene/shampoo_dove.png") },
  //     { brand: "Sunsilk", type: "Smooth & Shine", quantity: "400ml", price: 180, image: require("../assets/hygiene/shampoo_sunsilk.png") },
  //   ],
  // },
  // {
  //   id: "toothpaste",
  //   category: "hygiene",
  //   name: "Toothpaste",
  //   variants: [
  //     { brand: "Colgate", type: "Whitening", quantity: "150g", price: 50, image: require("../assets/hygiene/toothpaste_colgate.png") },
  //     { brand: "Pepsodent", type: "Herbal", quantity: "150g", price: 55, image: require("../assets/hygiene/toothpaste_pepsodent.png") },
  //   ],
  // },
  // {
  //   id: "chips",
  //   category: "snacks",
  //   name: "Potato Chips",
  //   variants: [
  //     { brand: "Lays", type: "Classic Salted", quantity: "100g", price: 50, image: require("../assets/snacks/chips_lays.png") },
  //     { brand: "Bingo", type: "Masala", quantity: "100g", price: 55, image: require("../assets/snacks/chips_bingo.png") },
  //   ],
  // },
  // {
  //   id: "cookies",
  //   category: "snacks",
  //   name: "Cookies",
  //   variants: [
  //     { brand: "Britannia", type: "Chocolate Chip", quantity: "250g", price: 100, image: require("../assets/snacks/cookies_britannia.png") },
  //     { brand: "Parle", type: "Butter", quantity: "250g", price: 90, image: require("../assets/snacks/cookies_parle.png") },
  //   ],
  // },
];
