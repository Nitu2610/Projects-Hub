const homeAppliancesProducts = [
      // =========================================================
  // REFRIGERATORS
  // =========================================================

  {
    title: "LG 655L Side-by-Side Refrigerator",
    description:
      "Large-capacity side-by-side refrigerator with inverter technology, multi-airflow cooling and frost-free operation.",
    color: "Shiny Steel",
    price: 89990,
    discountedPrice: 82990,
    stock: 7,
    category: "refrigerators",
    specification: {
      Brand: "LG",
      Model: "GL-S262APZX",
      Capacity: "655 L",
      Type: "Side-by-Side",
      EnergyRating: "3 Star",
      Compressor: "Smart Inverter Compressor",
      Cooling: "Multi Air Flow",
      DefrostSystem: "Frost Free",
      Warranty: "1 Year Product + 10 Years Compressor",
    },
  },

  {
    title: "Samsung 653L Side-by-Side Refrigerator",
    description:
      "Premium side-by-side refrigerator offering spacious storage, digital inverter technology and all-around cooling.",
    color: "Black Inox",
    price: 94990,
    discountedPrice: 87990,
    stock: 6,
    category: "refrigerators",
    specification: {
      Brand: "Samsung",
      Model: "RS76CG8113B1",
      Capacity: "653 L",
      Type: "Side-by-Side",
      EnergyRating: "3 Star",
      Compressor: "Digital Inverter Compressor",
      Cooling: "All Around Cooling",
      DefrostSystem: "Frost Free",
      Warranty: "1 Year Product + 20 Years Compressor",
    },
  },

  {
    title: "Whirlpool 265L Frost Free Refrigerator",
    description:
      "Double-door refrigerator with frost-free cooling, inverter compressor and flexible storage for medium-sized households.",
    color: "Sapphire",
    price: 31990,
    discountedPrice: 27990,
    stock: 14,
    category: "refrigerators",
    specification: {
      Brand: "Whirlpool",
      Model: "IF INV CNV 278 ELT",
      Capacity: "265 L",
      Type: "Double Door",
      EnergyRating: "3 Star",
      Compressor: "Intellisense Inverter",
      Cooling: "Zeothermal Insulation",
      DefrostSystem: "Frost Free",
      Warranty: "1 Year Product + 10 Years Compressor",
    },
  },

  {
    title: "Godrej 244L Double Door Refrigerator",
    description:
      "Energy-efficient double-door refrigerator with frost-free operation and spacious compartments for everyday household use.",
    color: "Jewel Blue",
    price: 29990,
    discountedPrice: 25990,
    stock: 17,
    category: "refrigerators",
    specification: {
      Brand: "Godrej",
      Model: "EON Vogue 244B",
      Capacity: "244 L",
      Type: "Double Door",
      EnergyRating: "3 Star",
      Compressor: "Inverter Compressor",
      Cooling: "Multi Air Flow",
      DefrostSystem: "Frost Free",
      Warranty: "1 Year Product + 10 Years Compressor",
    },
  },

  {
    title: "Haier 237L Double Door Refrigerator",
    description:
      "Compact double-door refrigerator with frost-free cooling, inverter technology and practical storage compartments.",
    color: "Dazzle Steel",
    price: 28990,
    discountedPrice: 24990,
    stock: 13,
    category: "refrigerators",
    specification: {
      Brand: "Haier",
      Model: "HEF-252TS-P",
      Capacity: "237 L",
      Type: "Double Door",
      EnergyRating: "3 Star",
      Compressor: "Inverter Compressor",
      Cooling: "Twin Energy Saving Mode",
      DefrostSystem: "Frost Free",
      Warranty: "1 Year Product + 10 Years Compressor",
    },
  },

  {
    title: "IFB 197L Direct Cool Refrigerator",
    description:
      "Compact single-door refrigerator designed for smaller households with efficient cooling and practical storage.",
    color: "Brilliant Silver",
    price: 18990,
    discountedPrice: 16990,
    stock: 20,
    category: "refrigerators",
    specification: {
      Brand: "IFB",
      Model: "197L Direct Cool",
      Capacity: "197 L",
      Type: "Single Door",
      EnergyRating: "4 Star",
      Compressor: "Inverter Compressor",
      Cooling: "Direct Cool",
      DefrostSystem: "Manual Defrost",
      Warranty: "1 Year Product + 10 Years Compressor",
    },
  },

  // =========================================================
  // WASHING MACHINES
  // =========================================================

  {
    title: "LG 9kg Front Load Washing Machine",
    description:
      "Fully automatic front-load washing machine with inverter motor, multiple wash programs and steam technology.",
    color: "Middle Black",
    price: 45990,
    discountedPrice: 40990,
    stock: 10,
    category: "washing machines",
    specification: {
      Brand: "LG",
      Model: "FHP1209Z5M",
      Capacity: "9 kg",
      Type: "Front Load",
      EnergyRating: "5 Star",
      Motor: "AI Direct Drive",
      SpinSpeed: "1200 RPM",
      WashPrograms: "14",
      SpecialFeature: "Steam Wash",
      Warranty: "2 Years Product + 10 Years Motor",
    },
  },

  {
    title: "Samsung 8kg Front Load Washing Machine",
    description:
      "Smart front-load washing machine featuring EcoBubble technology, digital inverter motor and multiple wash programs.",
    color: "Inox",
    price: 39990,
    discountedPrice: 34990,
    stock: 12,
    category: "washing machines",
    specification: {
      Brand: "Samsung",
      Model: "WW80T504DAX",
      Capacity: "8 kg",
      Type: "Front Load",
      EnergyRating: "5 Star",
      Motor: "Digital Inverter",
      SpinSpeed: "1400 RPM",
      WashPrograms: "14",
      SpecialFeature: "EcoBubble Technology",
      Warranty: "3 Years Product + 10 Years Motor",
    },
  },

  {
    title: "IFB 8kg Front Load Washing Machine",
    description:
      "Fully automatic front-load washing machine with Aqua Energie technology, steam wash and high-speed spinning.",
    color: "Silver",
    price: 37990,
    discountedPrice: 32990,
    stock: 11,
    category: "washing machines",
    specification: {
      Brand: "IFB",
      Model: "Executive ZXS 8 kg",
      Capacity: "8 kg",
      Type: "Front Load",
      EnergyRating: "5 Star",
      Motor: "Inverter Motor",
      SpinSpeed: "1400 RPM",
      WashPrograms: "15",
      SpecialFeature: "Aqua Energie",
      Warranty: "4 Years Product + 10 Years Motor",
    },
  },

  {
    title: "Whirlpool 7.5kg Top Load Washing Machine",
    description:
      "Fully automatic top-load washing machine with multiple wash programs, inverter technology and convenient digital controls.",
    color: "Grey",
    price: 27990,
    discountedPrice: 23990,
    stock: 16,
    category: "washing machines",
    specification: {
      Brand: "Whirlpool",
      Model: "360 BW PRO",
      Capacity: "7.5 kg",
      Type: "Top Load",
      EnergyRating: "5 Star",
      Motor: "ZPF Technology",
      SpinSpeed: "740 RPM",
      WashPrograms: "12",
      SpecialFeature: "Hard Water Wash",
      Warranty: "2 Years Product + 10 Years Motor",
    },
  },

  {
    title: "Godrej 7kg Fully Automatic Washing Machine",
    description:
      "Compact fully automatic washing machine with efficient motor, multiple wash programs and easy-to-use controls.",
    color: "Graphite Grey",
    price: 22990,
    discountedPrice: 19990,
    stock: 19,
    category: "washing machines",
    specification: {
      Brand: "Godrej",
      Model: "WT EON 701",
      Capacity: "7 kg",
      Type: "Top Load",
      EnergyRating: "5 Star",
      Motor: "Inverter Motor",
      SpinSpeed: "700 RPM",
      WashPrograms: "10",
      SpecialFeature: "Turbo 6 Pulsator",
      Warranty: "2 Years Product + 10 Years Motor",
    },
  },

  {
    title: "Bosch 8kg Front Load Washing Machine",
    description:
      "Premium front-load washing machine with inverter motor, anti-vibration design and a wide range of washing programs.",
    color: "Silver",
    price: 44990,
    discountedPrice: 39990,
    stock: 8,
    category: "washing machines",
    specification: {
      Brand: "Bosch",
      Model: "WAJ2426WIN",
      Capacity: "8 kg",
      Type: "Front Load",
      EnergyRating: "5 Star",
      Motor: "EcoSilence Drive",
      SpinSpeed: "1200 RPM",
      WashPrograms: "15",
      SpecialFeature: "Anti-Vibration Design",
      Warranty: "2 Years Product + 10 Years Motor",
    },
  },

  // =========================================================
  // AIR CONDITIONERS
  // =========================================================

  {
    title: "LG 1.5 Ton 5 Star Split AC",
    description:
      "Energy-efficient split air conditioner with dual inverter technology, HD filter and fast cooling performance.",
    color: "White",
    price: 54990,
    discountedPrice: 48990,
    stock: 9,
    category: "air conditioners",
    specification: {
      Brand: "LG",
      Model: "PS-Q19YNZE",
      Capacity: "1.5 Ton",
      Type: "Split AC",
      EnergyRating: "5 Star",
      Compressor: "Dual Inverter",
      CoolingCapacity: "5000 W",
      Refrigerant: "R32",
      Filter: "HD Filter",
      Warranty: "1 Year Product + 10 Years Compressor",
    },
  },

  {
    title: "Daikin 1.5 Ton 5 Star Split AC",
    description:
      "High-efficiency split air conditioner with inverter compressor, PM 2.5 filter and powerful cooling performance.",
    color: "White",
    price: 57990,
    discountedPrice: 51990,
    stock: 8,
    category: "air conditioners",
    specification: {
      Brand: "Daikin",
      Model: "FTKM50UV16",
      Capacity: "1.5 Ton",
      Type: "Split AC",
      EnergyRating: "5 Star",
      Compressor: "Swing Inverter",
      CoolingCapacity: "5000 W",
      Refrigerant: "R32",
      Filter: "PM 2.5 Filter",
      Warranty: "1 Year Product + 10 Years Compressor",
    },
  },

  {
    title: "Voltas 1.5 Ton 5 Star Split AC",
    description:
      "Efficient split AC with inverter compressor, multiple cooling modes and air purification features for everyday comfort.",
    color: "White",
    price: 44990,
    discountedPrice: 39990,
    stock: 13,
    category: "air conditioners",
    specification: {
      Brand: "Voltas",
      Model: "1.5 Ton 5 Star Inverter AC",
      Capacity: "1.5 Ton",
      Type: "Split AC",
      EnergyRating: "5 Star",
      Compressor: "Inverter Compressor",
      CoolingCapacity: "5000 W",
      Refrigerant: "R32",
      Modes: "Cool, Dry, Fan",
      Warranty: "1 Year Product + 10 Years Compressor",
    },
  },

  {
    title: "Samsung 1.5 Ton 5 Star WindFree AC",
    description:
      "Premium split air conditioner with WindFree cooling technology, inverter compressor and smart connectivity.",
    color: "White",
    price: 64990,
    discountedPrice: 57990,
    stock: 7,
    category: "air conditioners",
    specification: {
      Brand: "Samsung",
      Model: "AR18CY5AMWK",
      Capacity: "1.5 Ton",
      Type: "Split AC",
      EnergyRating: "5 Star",
      Compressor: "Digital Inverter",
      CoolingCapacity: "5000 W",
      Refrigerant: "R32",
      SpecialFeature: "WindFree Cooling",
      Connectivity: "Wi-Fi",
    },
  },

  {
    title: "Blue Star 1.5 Ton 3 Star Split AC",
    description:
      "Reliable split air conditioner offering efficient cooling, inverter technology and convenient comfort settings.",
    color: "White",
    price: 41990,
    discountedPrice: 36990,
    stock: 15,
    category: "air conditioners",
    specification: {
      Brand: "Blue Star",
      Model: "IA318DNU",
      Capacity: "1.5 Ton",
      Type: "Split AC",
      EnergyRating: "3 Star",
      Compressor: "Inverter Compressor",
      CoolingCapacity: "5000 W",
      Refrigerant: "R32",
      Filter: "Dust Filter",
      Warranty: "1 Year Product + 10 Years Compressor",
    },
  },

  {
    title: "Carrier 1.5 Ton 5 Star Split AC",
    description:
      "Energy-efficient inverter split AC with advanced air filtration and multiple operating modes for comfortable cooling.",
    color: "White",
    price: 49990,
    discountedPrice: 44990,
    stock: 11,
    category: "air conditioners",
    specification: {
      Brand: "Carrier",
      Model: "Estra 1.5 Ton",
      Capacity: "1.5 Ton",
      Type: "Split AC",
      EnergyRating: "5 Star",
      Compressor: "Inverter Compressor",
      CoolingCapacity: "5000 W",
      Refrigerant: "R32",
      Modes: "Cool, Dry, Fan, Sleep",
      Warranty: "1 Year Product + 10 Years Compressor",
    },
  },

  // =========================================================
  // MICROWAVES
  // =========================================================

  {
    title: "LG 28L Convection Microwave Oven",
    description:
      "Versatile convection microwave oven suitable for reheating, grilling and baking with multiple automatic cooking programs.",
    color: "Black",
    price: 18990,
    discountedPrice: 15990,
    stock: 14,
    category: "microwaves",
    specification: {
      Brand: "LG",
      Model: "MC2846SL",
      Capacity: "28 L",
      Type: "Convection",
      PowerOutput: "900 W",
      CookingModes: "Microwave, Grill, Convection",
      AutoMenus: "211",
      Control: "Touch Panel",
      SpecialFeature: "Diet Fry",
      Warranty: "1 Year Product",
    },
  },

  {
    title: "Samsung 28L Convection Microwave Oven",
    description:
      "Multi-functional convection microwave designed for baking, grilling and everyday cooking with preset cooking menus.",
    color: "Black",
    price: 17990,
    discountedPrice: 14990,
    stock: 18,
    category: "microwaves",
    specification: {
      Brand: "Samsung",
      Model: "MC28A5013AK",
      Capacity: "28 L",
      Type: "Convection",
      PowerOutput: "900 W",
      CookingModes: "Microwave, Grill, Convection",
      AutoMenus: "15",
      Control: "Touch Panel",
      SpecialFeature: "Slim Fry",
      Warranty: "1 Year Product",
    },
  },

  {
    title: "IFB 30L Convection Microwave Oven",
    description:
      "Large-capacity convection microwave with multiple cooking functions, preset menus and easy digital controls.",
    color: "Black",
    price: 19990,
    discountedPrice: 16990,
    stock: 12,
    category: "microwaves",
    specification: {
      Brand: "IFB",
      Model: "30BRC2",
      Capacity: "30 L",
      Type: "Convection",
      PowerOutput: "900 W",
      CookingModes: "Microwave, Grill, Convection",
      AutoMenus: "101",
      Control: "Touch Panel",
      SpecialFeature: "Multi-Stage Cooking",
      Warranty: "1 Year Product",
    },
  },

  {
    title: "Whirlpool 20L Solo Microwave Oven",
    description:
      "Compact solo microwave oven designed for quick reheating, defrosting and everyday cooking.",
    color: "Black",
    price: 7990,
    discountedPrice: 6490,
    stock: 23,
    category: "microwaves",
    specification: {
      Brand: "Whirlpool",
      Model: "MAGICOOK PRO 20SE",
      Capacity: "20 L",
      Type: "Solo",
      PowerOutput: "700 W",
      CookingModes: "Microwave",
      AutoMenus: "5",
      Control: "Mechanical Knob",
      SpecialFeature: "Steam Cleaning",
      Warranty: "1 Year Product",
    },
  },

  {
    title: "Panasonic 27L Convection Microwave Oven",
    description:
      "Convection microwave with baking, grilling and microwave functions designed for versatile home cooking.",
    color: "Black",
    price: 16990,
    discountedPrice: 13990,
    stock: 16,
    category: "microwaves",
    specification: {
      Brand: "Panasonic",
      Model: "NN-CT645B",
      Capacity: "27 L",
      Type: "Convection",
      PowerOutput: "900 W",
      CookingModes: "Microwave, Grill, Convection",
      AutoMenus: "101",
      Control: "Touch Panel",
      SpecialFeature: "Magic Grill",
      Warranty: "1 Year Product",
    },
  },

  {
    title: "Godrej 20L Solo Microwave Oven",
    description:
      "Compact solo microwave designed for simple reheating, cooking and defrosting with easy-to-use controls.",
    color: "Black",
    price: 7490,
    discountedPrice: 5990,
    stock: 25,
    category: "microwaves",
    specification: {
      Brand: "Godrej",
      Model: "GMX 20SA2",
      Capacity: "20 L",
      Type: "Solo",
      PowerOutput: "700 W",
      CookingModes: "Microwave",
      AutoMenus: "5",
      Control: "Mechanical Knob",
      SpecialFeature: "Multi-Stage Cooking",
      Warranty: "1 Year Product",
    },
  },

  // =========================================================
  // STABILIZERS
  // =========================================================

  {
    title: "V-Guard VG 400 Voltage Stabilizer",
    description:
      "Automatic voltage stabilizer designed to protect compatible refrigerators and home appliances from voltage fluctuations.",
    color: "White",
    price: 2999,
    discountedPrice: 2499,
    stock: 30,
    category: "stabilizers",
    specification: {
      Brand: "V-Guard",
      Model: "VG 400",
      Capacity: "3 A",
      InputRange: "90-290 V",
      OutputVoltage: "220 V",
      Application: "Refrigerators",
      Protection: "Overload and High Voltage Protection",
      Display: "Digital Display",
      Mounting: "Wall Mount",
    },
  },

  {
    title: "V-Guard VWI 400 Voltage Stabilizer",
    description:
      "Digital voltage stabilizer providing protection against voltage fluctuations for compatible refrigerators and appliances.",
    color: "White",
    price: 3499,
    discountedPrice: 2899,
    stock: 27,
    category: "stabilizers",
    specification: {
      Brand: "V-Guard",
      Model: "VWI 400",
      Capacity: "4 A",
      InputRange: "90-290 V",
      OutputVoltage: "220 V",
      Application: "Refrigerators",
      Protection: "Overload Protection",
      Display: "Digital Display",
      Mounting: "Wall Mount",
    },
  },

  {
    title: "Microtek EMR 2013 Voltage Stabilizer",
    description:
      "Automatic voltage stabilizer designed for protecting air conditioners from unstable voltage conditions.",
    color: "White",
    price: 4999,
    discountedPrice: 4299,
    stock: 21,
    category: "stabilizers",
    specification: {
      Brand: "Microtek",
      Model: "EMR 2013",
      Capacity: "6 A",
      InputRange: "90-300 V",
      OutputVoltage: "220 V",
      Application: "Air Conditioners",
      Protection: "Overload and Short Circuit Protection",
      Display: "Digital Display",
      Mounting: "Wall Mount",
    },
  },

  {
    title: "V-Guard ID4 2KVA Voltage Stabilizer",
    description:
      "High-capacity stabilizer designed to provide voltage protection for larger home appliances and equipment.",
    color: "Grey",
    price: 6999,
    discountedPrice: 5999,
    stock: 15,
    category: "stabilizers",
    specification: {
      Brand: "V-Guard",
      Model: "ID4 2KVA",
      Capacity: "2 KVA",
      InputRange: "90-300 V",
      OutputVoltage: "230 V",
      Application: "Air Conditioners and Appliances",
      Protection: "Overload and Thermal Protection",
      Display: "Digital Display",
      Mounting: "Wall Mount",
    },
  },

  {
    title: "Microtek EM4160 Voltage Stabilizer",
    description:
      "Automatic stabilizer designed for air conditioners with wide input voltage range and built-in safety protection.",
    color: "White",
    price: 5499,
    discountedPrice: 4699,
    stock: 18,
    category: "stabilizers",
    specification: {
      Brand: "Microtek",
      Model: "EM4160",
      Capacity: "6 KVA",
      InputRange: "90-300 V",
      OutputVoltage: "230 V",
      Application: "Air Conditioners",
      Protection: "Overload and Short Circuit Protection",
      Display: "Digital Display",
      Mounting: "Wall Mount",
    },
  },

  {
    title: "Syspro Voltsafe 4KVA Stabilizer",
    description:
      "Automatic voltage stabilizer designed for large appliances with wide input range and protection against electrical fluctuations.",
    color: "White",
    price: 5999,
    discountedPrice: 5199,
    stock: 16,
    category: "stabilizers",
    specification: {
      Brand: "Syspro",
      Model: "Voltsafe 4KVA",
      Capacity: "4 KVA",
      InputRange: "90-300 V",
      OutputVoltage: "230 V",
      Application: "Air Conditioners",
      Protection: "Overload and High Voltage Protection",
      Display: "Digital Display",
      Mounting: "Wall Mount",
    },
  },
]


module.exports = homeAppliancesProducts;