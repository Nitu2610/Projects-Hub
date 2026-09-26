const gamingProducts = [

    // Gaming Consoles

    {
  title: "Sony PlayStation 5 Slim",
  description:
    "Compact next-generation gaming console with high-speed SSD storage, ray tracing and immersive 4K gaming support.",
  color: "White",
  price: 54990,
  discountedPrice: 49990,
  stock: 12,
  category: "gaming consoles",
  specification: {
    Brand: "Sony",
    Model: "PlayStation 5 Slim",
    Storage: "1 TB SSD",
    Resolution: "Up to 4K",
    HDR: "Yes",
    RayTracing: "Yes",
    Connectivity: "Wi-Fi 6, Bluetooth, Ethernet",
    Controller: "DualSense Wireless Controller",
  },
},

{
  title: "Sony PlayStation 5 Digital Edition",
  description:
    "Digital-only next-generation gaming console designed for fast downloads, smooth 4K gameplay and immersive gaming experiences.",
  color: "White",
  price: 44990,
  discountedPrice: 40990,
  stock: 10,
  category: "gaming consoles",
  specification: {
    Brand: "Sony",
    Model: "PlayStation 5 Digital Edition",
    Storage: "825 GB SSD",
    Resolution: "Up to 4K",
    HDR: "Yes",
    RayTracing: "Yes",
    Connectivity: "Wi-Fi 6, Bluetooth, Ethernet",
    Controller: "DualSense Wireless Controller",
  },
},

{
  title: "Microsoft Xbox Series X",
  description:
    "Powerful 4K gaming console with fast SSD storage, high frame-rate support and backward compatibility with selected Xbox games.",
  color: "Black",
  price: 54990,
  discountedPrice: 51990,
  stock: 8,
  category: "gaming consoles",
  specification: {
    Brand: "Microsoft",
    Model: "Xbox Series X",
    Storage: "1 TB SSD",
    Resolution: "Up to 4K",
    FrameRate: "Up to 120 FPS",
    HDR: "Yes",
    Connectivity: "Wi-Fi, Bluetooth, Ethernet",
    Controller: "Xbox Wireless Controller",
  },
},

{
  title: "Microsoft Xbox Series S",
  description:
    "Compact all-digital gaming console offering fast loading, high frame-rate gaming and access to the Xbox Game Pass ecosystem.",
  color: "White",
  price: 34990,
  discountedPrice: 31990,
  stock: 15,
  category: "gaming consoles",
  specification: {
    Brand: "Microsoft",
    Model: "Xbox Series S",
    Storage: "512 GB SSD",
    Resolution: "Up to 1440p",
    FrameRate: "Up to 120 FPS",
    HDR: "Yes",
    Connectivity: "Wi-Fi, Bluetooth, Ethernet",
    Controller: "Xbox Wireless Controller",
  },
},

{
  title: "Nintendo Switch OLED",
  description:
    "Hybrid gaming console featuring a vibrant OLED display, detachable controllers and flexible handheld, tabletop and TV gaming modes.",
  color: "White",
  price: 37990,
  discountedPrice: 34990,
  stock: 9,
  category: "gaming consoles",
  specification: {
    Brand: "Nintendo",
    Model: "Switch OLED",
    Display: "7-inch OLED",
    Storage: "64 GB",
    Resolution: "Up to 1080p TV",
    Battery: "Up to 9 hours",
    Modes: "TV, Tabletop, Handheld",
    Controller: "Joy-Con Controllers",
  },
},

{
  title: "Nintendo Switch 2",
  description:
    "Next-generation Nintendo hybrid console designed for handheld, tabletop and TV gaming with improved performance and display capabilities.",
  color: "Black",
  price: 44990,
  discountedPrice: 42990,
  stock: 7,
  category: "gaming consoles",
  specification: {
    Brand: "Nintendo",
    Model: "Switch 2",
    Display: "7.9-inch LCD",
    Storage: "256 GB",
    Resolution: "Up to 4K TV",
    HDR: "Yes",
    RefreshRate: "Up to 120 Hz",
    Modes: "TV, Tabletop, Handheld",
  },
},

{
  title: "Valve Steam Deck OLED 512GB",
  description:
    "Portable PC gaming console with an OLED display, fast storage and access to a large library of PC games through Steam.",
  color: "Black",
  price: 54999,
  discountedPrice: 51999,
  stock: 6,
  category: "gaming consoles",
  specification: {
    Brand: "Valve",
    Model: "Steam Deck OLED",
    Storage: "512 GB NVMe SSD",
    Display: "7.4-inch OLED",
    Resolution: "1280 x 800",
    RefreshRate: "90 Hz",
    RAM: "16 GB",
    OperatingSystem: "SteamOS",
  },
},

{
  title: "ASUS ROG Ally X",
  description:
    "High-performance handheld gaming PC featuring a large battery, fast memory and Windows-based access to PC gaming platforms.",
  color: "Black",
  price: 89990,
  discountedPrice: 84990,
  stock: 5,
  category: "gaming consoles",
  specification: {
    Brand: "ASUS",
    Model: "ROG Ally X",
    Display: "7-inch IPS",
    Resolution: "1920 x 1080",
    Processor: "AMD Ryzen Z1 Extreme",
    RAM: "24 GB",
    Storage: "1 TB SSD",
    OperatingSystem: "Windows 11",
  },
},

{
  title: "Lenovo Legion Go",
  description:
    "Large-screen Windows gaming handheld with detachable controllers, high refresh rate display and powerful AMD processing.",
  color: "Shadow Black",
  price: 79990,
  discountedPrice: 74990,
  stock: 6,
  category: "gaming consoles",
  specification: {
    Brand: "Lenovo",
    Model: "Legion Go",
    Display: "8.8-inch IPS",
    Resolution: "2560 x 1600",
    RefreshRate: "144 Hz",
    Processor: "AMD Ryzen Z1 Extreme",
    RAM: "16 GB",
    Storage: "1 TB SSD",
  },
},

{
  title: "Sony PlayStation Portal",
  description:
    "Remote gaming handheld designed to stream compatible PlayStation 5 games over a home Wi-Fi connection.",
  color: "White",
  price: 21990,
  discountedPrice: 19990,
  stock: 11,
  category: "gaming consoles",
  specification: {
    Brand: "Sony",
    Model: "PlayStation Portal",
    Display: "8-inch LCD",
    Resolution: "1080p",
    RefreshRate: "60 Hz",
    Connectivity: "Wi-Fi",
    Battery: "Up to 6 hours",
    Compatibility: "PlayStation 5",
  },
},

// Gaming Accessories

{
  title: "Sony DualSense Wireless Controller",
  description:
    "Wireless PlayStation controller featuring adaptive triggers, haptic feedback and an integrated microphone.",
  color: "White",
  price: 6990,
  discountedPrice: 5990,
  stock: 25,
  category: "gaming accessories",
  specification: {
    Brand: "Sony",
    Model: "DualSense",
    Compatibility: "PlayStation 5, PC",
    Connectivity: "Bluetooth, USB-C",
    Features: "Haptic Feedback, Adaptive Triggers",
    Microphone: "Built-in",
    Battery: "Rechargeable",
    Port: "USB-C",
  },
},

{
  title: "Xbox Wireless Controller",
  description:
    "Ergonomic wireless gaming controller with textured grips, responsive controls and broad Xbox and PC compatibility.",
  color: "Black",
  price: 5990,
  discountedPrice: 5290,
  stock: 22,
  category: "gaming accessories",
  specification: {
    Brand: "Microsoft",
    Model: "Xbox Wireless Controller",
    Compatibility: "Xbox Series X|S, Xbox One, PC",
    Connectivity: "Bluetooth, Xbox Wireless",
    Port: "USB-C",
    Battery: "AA Batteries",
    Features: "Textured Grip, Hybrid D-Pad",
    Platform: "Xbox, Windows",
  },
},

{
  title: "Logitech G502 X Gaming Mouse",
  description:
    "High-precision gaming mouse featuring programmable controls, hybrid optical-mechanical switches and customizable settings.",
  color: "Black",
  price: 7995,
  discountedPrice: 6995,
  stock: 18,
  category: "gaming accessories",
  specification: {
    Brand: "Logitech",
    Model: "G502 X",
    Sensor: "HERO",
    DPI: "Up to 25600",
    Buttons: "13 Programmable",
    Connectivity: "USB",
    Switches: "LIGHTFORCE Hybrid",
    Weight: "89 g",
  },
},

{
  title: "Razer DeathAdder V3 Gaming Mouse",
  description:
    "Lightweight ergonomic gaming mouse designed for fast and precise competitive gameplay.",
  color: "Black",
  price: 6999,
  discountedPrice: 5999,
  stock: 16,
  category: "gaming accessories",
  specification: {
    Brand: "Razer",
    Model: "DeathAdder V3",
    Sensor: "Focus Pro Optical",
    DPI: "Up to 30000",
    Buttons: "6",
    Connectivity: "USB",
    PollingRate: "Up to 8000 Hz",
    Weight: "63 g",
  },
},

{
  title: "HyperX Cloud III Gaming Headset",
  description:
    "Comfortable wired gaming headset with spatial audio, clear voice capture and durable construction.",
  color: "Black",
  price: 9990,
  discountedPrice: 8490,
  stock: 14,
  category: "gaming accessories",
  specification: {
    Brand: "HyperX",
    Model: "Cloud III",
    Driver: "53 mm",
    Connectivity: "3.5 mm, USB-C",
    Microphone: "Detachable",
    Audio: "DTS Headphone:X",
    Compatibility: "PC, PlayStation, Xbox, Nintendo Switch",
    SurroundSound: "Yes",
  },
},

{
  title: "Razer BlackShark V2 X Gaming Headset",
  description:
    "Lightweight gaming headset with surround sound support, noise-isolating ear cushions and a flexible microphone.",
  color: "Black",
  price: 4999,
  discountedPrice: 3999,
  stock: 20,
  category: "gaming accessories",
  specification: {
    Brand: "Razer",
    Model: "BlackShark V2 X",
    Driver: "50 mm",
    Connectivity: "3.5 mm",
    Microphone: "Bendable",
    Audio: "7.1 Surround Sound",
    Compatibility: "PC, PlayStation, Xbox, Switch",
    Weight: "240 g",
  },
},

{
  title: "Logitech G213 Prodigy Gaming Keyboard",
  description:
    "Full-size gaming keyboard with dedicated media controls, programmable lighting and spill-resistant construction.",
  color: "Black",
  price: 4995,
  discountedPrice: 4295,
  stock: 17,
  category: "gaming accessories",
  specification: {
    Brand: "Logitech",
    Model: "G213 Prodigy",
    Layout: "Full Size",
    SwitchType: "Membrane",
    Backlight: "RGB",
    Connectivity: "USB",
    MediaControls: "Dedicated",
    Compatibility: "Windows, macOS",
  },
},

{
  title: "Razer BlackWidow V3 Mechanical Keyboard",
  description:
    "Mechanical gaming keyboard with tactile switches, customizable RGB lighting and dedicated media controls.",
  color: "Black",
  price: 12999,
  discountedPrice: 10999,
  stock: 10,
  category: "gaming accessories",
  specification: {
    Brand: "Razer",
    Model: "BlackWidow V3",
    SwitchType: "Mechanical",
    Switch: "Green",
    Backlight: "Razer Chroma RGB",
    Connectivity: "USB",
    Layout: "Full Size",
    MediaControls: "Dedicated",
  },
},

{
  title: "Logitech G29 Driving Force Racing Wheel",
  description:
    "Force-feedback racing wheel with responsive pedals and realistic controls for compatible racing games.",
  color: "Black",
  price: 29995,
  discountedPrice: 26995,
  stock: 7,
  category: "gaming accessories",
  specification: {
    Brand: "Logitech",
    Model: "G29 Driving Force",
    Compatibility: "PlayStation, PC",
    Rotation: "900 Degrees",
    Feedback: "Dual-Motor Force Feedback",
    Pedals: "3 Pedals",
    Connectivity: "USB",
    Features: "Leather Steering Wheel",
  },
},

{
  title: "Cosmic Byte GS430 Gaming Chair",
  description:
    "Ergonomic gaming chair with adjustable reclining support, padded seating and integrated armrests.",
  color: "Black",
  price: 11999,
  discountedPrice: 9999,
  stock: 9,
  category: "gaming accessories",
  specification: {
    Brand: "Cosmic Byte",
    Model: "GS430",
    Material: "Synthetic Leather",
    Frame: "Steel",
    Recline: "Adjustable",
    Armrest: "Padded",
    Cushion: "High Density Foam",
    WeightCapacity: "120 kg",
  },
},

{
  title: "WD_BLACK C50 Expansion Card 1TB",
  description:
    "High-speed storage expansion designed to increase compatible Xbox console storage without sacrificing performance.",
  color: "Black",
  price: 16999,
  discountedPrice: 14999,
  stock: 8,
  category: "gaming accessories",
  specification: {
    Brand: "WD_BLACK",
    Model: "C50",
    Capacity: "1 TB",
    Interface: "PCIe Gen4",
    Compatibility: "Xbox Series X|S",
    FormFactor: "Expansion Card",
    StorageType: "NVMe SSD",
    Purpose: "Console Storage Expansion",
  },
},

]

module.exports = gamingProducts;