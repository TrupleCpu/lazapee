import "dotenv/config";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { supabase } from "../config/supabase.js";

const hashedPassword = await bcrypt.hash("admin123", 10);

await supabase.from("users").insert({
  email: "admin@lazapee.com",
  password: hashedPassword,
  role: "admin",
});

// CATEGORIES
const categoriesData = [
  {
    id: randomUUID(),
    slug: "computing",
    title: "Computing",
    description: "Laptops, Desktops, and Workstations for pros.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: randomUUID(),
    slug: "smartphones",
    title: "Smartphones",
    description: "Latest mobile innovation and flagship devices.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: randomUUID(),
    slug: "accessories",
    title: "Accessories",
    description: "Essential gear to complete your tech setup.",
    image:
      "https://images.unsplash.com/photo-1616410011236-7a42121dd981?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: randomUUID(),
    slug: "audio",
    title: "Audio",
    description: "Immersive sound with premium headphones and speakers.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: randomUUID(),
    slug: "smart-home",
    title: "Smart Home",
    description: "Connect your living space with intelligent devices.",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: randomUUID(),
    slug: "wearables",
    title: "Wearables",
    description: "Fitness trackers and smartwatches for on-the-go tech.",
    image:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop",
  },
];

// Lookup map: slug -> category UUID (so products can reference the right category)
const categoryIdBySlug = Object.fromEntries(
  categoriesData.map((c) => [c.slug, c.id])
);

// PRODUCTS
const productsData = [
  // ---------- COMPUTING ----------
  {
    id: randomUUID(),
    slug: "x-1000",
    category_id: categoryIdBySlug["computing"],
    title: "X-1000 Quantum Processor",
    subtitle: "8-Core / Silicon Photonics",
    badge: "NEW RELEASE",
    price: 1299.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "Experience next-gen performance with the X-1000 Quantum Processor. Engineered for massive throughput and ultra-low latency, this unit utilizes proprietary cooling architectures and silicon-photonics to deliver unparalleled computational power.",
    images: [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "nova-book-pro-15",
    category_id: categoryIdBySlug["computing"],
    title: "NovaBook Pro 15",
    subtitle: "Intel i9 / 32GB RAM / 1TB SSD",
    badge: "BESTSELLER",
    price: 1899.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "The NovaBook Pro 15 combines a stunning Retina-class display with workstation-grade performance. Perfect for developers, editors, and designers who need power on the go without compromise.",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "titan-desktop-r7",
    category_id: categoryIdBySlug["computing"],
    title: "Titan Desktop R7",
    subtitle: "Ryzen 7 / RTX 4070 / 16GB RAM",
    badge: null,
    price: 1549.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "Built for gamers and creators alike, the Titan Desktop R7 delivers smooth 4K gaming and fast render times in a sleek tempered-glass chassis with customizable RGB lighting.",
    images: [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "featherlight-air-13",
    category_id: categoryIdBySlug["computing"],
    title: "FeatherLight Air 13",
    subtitle: "M-Series Chip / Fanless Design",
    badge: "ULTRALIGHT",
    price: 1099.0,
    in_stock: true,
    stock_status: "Low Stock",
    stock_type: "lowStock",
    description:
      "Weighing less than a paperback, the FeatherLight Air 13 delivers all-day battery life and silent fanless operation, making it the ideal companion for students and travelers.",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "cinema-view-monitor-32",
    category_id: categoryIdBySlug["computing"],
    title: 'CinemaView Monitor 32"',
    subtitle: "4K UHD / 144Hz / HDR10",
    badge: null,
    price: 549.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "Transform your workspace with the CinemaView 32-inch monitor. Featuring vibrant HDR10 color and a buttery-smooth 144Hz refresh rate for both productivity and play.",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "keyquake-mechanical-tkl",
    category_id: categoryIdBySlug["computing"],
    title: "KeyQuake Mechanical TKL",
    subtitle: "Hot-Swappable / RGB Backlit",
    badge: "TOP RATED",
    price: 129.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "A tenkeyless mechanical keyboard with hot-swappable switches, per-key RGB, and a durable aluminum frame — built for typists and gamers who demand precision.",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800&auto=format&fit=crop",
    ],
  },

  // ---------- SMARTPHONES ----------
  {
    id: randomUUID(),
    slug: "aeon-phone-15-pro",
    category_id: categoryIdBySlug["smartphones"],
    title: "Aeon Phone 15 Pro",
    subtitle: "256GB / Titanium Frame",
    badge: "NEW RELEASE",
    price: 1199.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "The Aeon Phone 15 Pro sets a new standard with its titanium frame, pro-grade triple camera system, and blazing-fast on-device AI processing for photography and productivity.",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592286927505-1def25115558?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601972602288-3be527b4f18a?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "galaxy-nova-edge",
    category_id: categoryIdBySlug["smartphones"],
    title: "Galaxy Nova Edge",
    subtitle: "512GB / Curved AMOLED",
    badge: "BESTSELLER",
    price: 999.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "Featuring a stunning curved AMOLED display and an under-display camera, the Galaxy Nova Edge blends immersive visuals with flagship-level performance.",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "pixel-flare-9",
    category_id: categoryIdBySlug["smartphones"],
    title: "Pixel Flare 9",
    subtitle: "128GB / Pure Android Experience",
    badge: null,
    price: 699.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "Pixel Flare 9 offers a clean software experience, computational photography that rivals DSLRs, and guaranteed years of timely updates.",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "nomad-fold-3",
    category_id: categoryIdBySlug["smartphones"],
    title: "Nomad Fold 3",
    subtitle: 'Foldable / 7.6" Inner Display',
    badge: "INNOVATIVE",
    price: 1599.0,
    in_stock: false,
    stock_status: "Out of Stock",
    stock_type: "outOfStock",
    description:
      "Unfold a tablet-sized canvas from your pocket. The Nomad Fold 3 features a reinforced hinge rated for 200,000 folds and a crease-resistant display.",
    images: [
      "https://images.unsplash.com/photo-1592286927505-1def25115558?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601972602288-3be527b4f18a?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "budget-lite-a3",
    category_id: categoryIdBySlug["smartphones"],
    title: "BudgetLite A3",
    subtitle: "64GB / 5000mAh Battery",
    badge: "VALUE PICK",
    price: 229.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "An affordable daily driver with a massive 5000mAh battery, clean display, and reliable performance for calls, browsing, and social media.",
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=800&auto=format&fit=crop",
    ],
  },

  // ---------- ACCESSORIES ----------
  {
    id: randomUUID(),
    slug: "prime-case-armor",
    category_id: categoryIdBySlug["accessories"],
    title: "PrimeCase Armor",
    subtitle: "Military-Grade Drop Protection",
    badge: null,
    price: 39.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "PrimeCase Armor combines shock-absorbing TPU with a hardened polycarbonate shell to survive drops up to 3 meters, without adding bulk.",
    images: [
      "https://images.unsplash.com/photo-1616410011236-7a42121dd981?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601972602288-3be527b4f18a?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "voltcharge-gan-65w",
    category_id: categoryIdBySlug["accessories"],
    title: "VoltCharge GaN 65W",
    subtitle: "3-Port Fast Charger",
    badge: "COMPACT",
    price: 49.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "Charge your laptop, phone, and earbuds simultaneously with this compact GaN charger, delivering up to 65W of intelligent, shared power output.",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "linklight-usb-c-hub",
    category_id: categoryIdBySlug["accessories"],
    title: "LinkLight USB-C Hub",
    subtitle: "7-in-1 / HDMI 4K / SD Card",
    badge: null,
    price: 59.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "Expand your laptop's connectivity with 7 ports in one sleek aluminum hub, including 4K HDMI output, SD card reader, and 100W pass-through charging.",
    images: [
      "https://images.unsplash.com/photo-1625842200452-a5c1e4d70b7e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "anchor-wireless-stand",
    category_id: categoryIdBySlug["accessories"],
    title: "Anchor Wireless Stand",
    subtitle: "3-in-1 Charging Dock",
    badge: "TOP RATED",
    price: 69.0,
    in_stock: true,
    stock_status: "Low Stock",
    stock_type: "lowStock",
    description:
      "A minimalist 3-in-1 charging dock for your phone, watch, and earbuds. Finished in brushed aluminum to match any modern desk setup.",
    images: [
      "https://images.unsplash.com/photo-1591290619762-c9dfc25f1a1c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618384887925-4b6a1d0b6f8f?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "guardian-glass-shield",
    category_id: categoryIdBySlug["accessories"],
    title: "Guardian Glass Shield",
    subtitle: "9H Tempered Screen Protector",
    badge: null,
    price: 19.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "Ultra-clear 9H tempered glass with oleophobic coating to resist fingerprints and scratches, includes an easy-align installation frame.",
    images: [
      "https://images.unsplash.com/photo-1601972602288-3be527b4f18a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616410011236-7a42121dd981?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "traveler-cable-organizer",
    category_id: categoryIdBySlug["accessories"],
    title: "Traveler Cable Organizer",
    subtitle: "Water-Resistant EVA Case",
    badge: null,
    price: 24.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "Keep your cables, adapters, and drives organized in this compact, water-resistant EVA case with elastic loops and a mesh pocket.",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1625842200452-a5c1e4d70b7e?q=80&w=800&auto=format&fit=crop",
    ],
  },

  // ---------- AUDIO ----------
  {
    id: randomUUID(),
    slug: "echo-bass-over-ear",
    category_id: categoryIdBySlug["audio"],
    title: "EchoBass Over-Ear",
    subtitle: "Active Noise Cancellation",
    badge: "BESTSELLER",
    price: 249.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "Immerse yourself in rich, room-filling sound with EchoBass Over-Ear headphones, featuring industry-leading ANC and 40 hours of battery life.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "pulse-buds-pro",
    category_id: categoryIdBySlug["audio"],
    title: "PulseBuds Pro",
    subtitle: "True Wireless / ANC / IPX4",
    badge: "NEW RELEASE",
    price: 179.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "PulseBuds Pro deliver studio-quality sound in a compact true-wireless form factor, with adaptive noise cancellation and sweat resistance for workouts.",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590658006821-6b6c1e0b8b23?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "boombeacon-portable-speaker",
    category_id: categoryIdBySlug["audio"],
    title: "BoomBeacon Portable Speaker",
    subtitle: "360° Sound / Waterproof IPX7",
    badge: null,
    price: 99.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "Take the party anywhere with the BoomBeacon, delivering 360-degree sound, deep bass, and full waterproofing for pool days and campsites alike.",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "studioframe-monitor-speakers",
    category_id: categoryIdBySlug["audio"],
    title: "StudioFrame Monitor Speakers",
    subtitle: "Pair / Reference-Grade Flat Response",
    badge: "PRO AUDIO",
    price: 329.0,
    in_stock: true,
    stock_status: "Low Stock",
    stock_type: "lowStock",
    description:
      "Get an honest, uncolored mix with StudioFrame reference monitors, built for producers and audio engineers who need accuracy above all.",
    images: [
      "https://images.unsplash.com/photo-1558379850-3d0e0e6b8f8e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558379850-3d0e0e6b8f8e?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "clipmic-wireless-lapel",
    category_id: categoryIdBySlug["audio"],
    title: "ClipMic Wireless Lapel",
    subtitle: "Dual-Channel / Content Creator Kit",
    badge: null,
    price: 89.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "A dual-channel wireless lapel mic system with a compact charging case, perfect for vloggers, interviewers, and podcasters on the move.",
    images: [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
    ],
  },

  // ---------- SMART HOME ----------
  {
    id: randomUUID(),
    slug: "hearthglow-smart-bulb-4pk",
    category_id: categoryIdBySlug["smart-home"],
    title: "HearthGlow Smart Bulb (4-Pack)",
    subtitle: "16M Colors / Voice Control",
    badge: null,
    price: 44.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "Set the mood in any room with HearthGlow smart bulbs — 16 million colors, scheduling, and seamless integration with all major voice assistants.",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "sentry-cam-outdoor-2k",
    category_id: categoryIdBySlug["smart-home"],
    title: "Sentry Cam Outdoor 2K",
    subtitle: "Night Vision / Motion Alerts",
    badge: "TOP RATED",
    price: 79.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "Keep watch over your property day and night with Sentry Cam's crisp 2K resolution, color night vision, and instant smartphone motion alerts.",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "thermosense-smart-thermostat",
    category_id: categoryIdBySlug["smart-home"],
    title: "ThermoSense Smart Thermostat",
    subtitle: "Learning AI / Energy Saver",
    badge: "NEW RELEASE",
    price: 149.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "ThermoSense learns your schedule and preferences to automatically optimize comfort and cut energy costs, all controllable from your phone.",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "lockwise-smart-deadbolt",
    category_id: categoryIdBySlug["smart-home"],
    title: "LockWise Smart Deadbolt",
    subtitle: "Fingerprint + App + Keypad",
    badge: null,
    price: 189.0,
    in_stock: false,
    stock_status: "Out of Stock",
    stock_type: "outOfStock",
    description:
      "Secure your front door with three ways to unlock: fingerprint, smartphone app, or keypad code — plus real-time entry notifications.",
    images: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "roboswish-robot-vacuum",
    category_id: categoryIdBySlug["smart-home"],
    title: "RoboSwish Robot Vacuum",
    subtitle: "LiDAR Mapping / Self-Empty Dock",
    badge: "BESTSELLER",
    price: 449.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "RoboSwish maps your home with precision LiDAR, avoids obstacles intelligently, and empties itself automatically for weeks of hands-free cleaning.",
    images: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
    ],
  },

  // ---------- WEARABLES ----------
  {
    id: randomUUID(),
    slug: "pulsefit-watch-x",
    category_id: categoryIdBySlug["wearables"],
    title: "PulseFit Watch X",
    subtitle: "Heart Rate + SpO2 + GPS",
    badge: "BESTSELLER",
    price: 299.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "Track every workout with precision using PulseFit Watch X's built-in GPS, continuous heart rate monitoring, and blood oxygen sensing.",
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "aura-band-fitness",
    category_id: categoryIdBySlug["wearables"],
    title: "Aura Band Fitness",
    subtitle: "Sleep Tracking / 14-Day Battery",
    badge: null,
    price: 99.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "A lightweight fitness band offering detailed sleep analysis, activity tracking, and up to 14 days of battery life on a single charge.",
    images: [
      "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "vistaframe-smart-glasses",
    category_id: categoryIdBySlug["wearables"],
    title: "VistaFrame Smart Glasses",
    subtitle: "Open-Ear Audio / Camera",
    badge: "INNOVATIVE",
    price: 329.0,
    in_stock: true,
    stock_status: "Low Stock",
    stock_type: "lowStock",
    description:
      "Stay connected hands-free with VistaFrame Smart Glasses, featuring open-ear audio, a discreet camera, and voice assistant integration.",
    images: [
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "ringlink-smart-ring",
    category_id: categoryIdBySlug["wearables"],
    title: "RingLink Smart Ring",
    subtitle: "Sleep + Recovery Tracker",
    badge: "NEW RELEASE",
    price: 279.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "A discreet titanium smart ring that tracks sleep quality, recovery, and readiness scores without a screen, notifications, or distractions.",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "kidtrack-gps-wearable",
    category_id: categoryIdBySlug["wearables"],
    title: "KidTrack GPS Wearable",
    subtitle: "Real-Time Location + SOS",
    badge: null,
    price: 59.0,
    in_stock: true,
    stock_status: "In Stock",
    stock_type: "inStock",
    description:
      "Give parents peace of mind with KidTrack, a durable wearable that provides real-time GPS location, geofencing alerts, and a one-touch SOS button.",
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: randomUUID(),
    slug: "chronosteel-hybrid-watch",
    category_id: categoryIdBySlug["wearables"],
    title: "ChronoSteel Hybrid Watch",
    subtitle: "Analog Face + Smart Sensors",
    badge: "TOP RATED",
    price: 219.0,
    in_stock: false,
    stock_status: "Out of Stock",
    stock_type: "outOfStock",
    description:
      "ChronoSteel pairs a classic analog watch face with hidden smart sensors for activity tracking and notifications — the best of both worlds.",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop",
    ],
  },
];

// Insert categories
const { error: categoriesError } = await supabase
  .from("categories")
  .insert(categoriesData);

if (categoriesError) {
  console.error("Error seeding categories:", categoriesError.message);
} else {
  console.log(`Seeded ${categoriesData.length} categories.`);
}

// Insert products
const { error: productsError } = await supabase
  .from("products")
  .insert(productsData);

if (productsError) {
  console.error("Error seeding products:", productsError.message);
} else {
  console.log(`Seeded ${productsData.length} products.`);
}