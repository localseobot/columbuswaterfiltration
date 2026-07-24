export const services = [
  {
    id: "whole-home",
    icon: "HomeIcon",
    name: "Whole Home Water Filtration",
    tagline: "Clean water from every tap",
    short:
      "A single system that filters all the water entering your home — removing chlorine, sediment, and contaminants before they reach your faucets, showers, and appliances.",
    features: [
      "Removes chlorine, chloramine & sediment",
      "Reduces odors and improves taste",
      "Protects plumbing and appliances",
      "Low-maintenance, long-lasting media",
    ],
  },
  {
    id: "softeners",
    icon: "SparkleIcon",
    name: "Water Softeners",
    tagline: "Say goodbye to hard water",
    short:
      "Central Ohio is known for hard water. Our high-efficiency softeners remove the calcium and magnesium that cause scale buildup, spotty dishes, dry skin, and shortened appliance life.",
    features: [
      "Eliminates scale & mineral buildup",
      "Softer skin, hair, and laundry",
      "Extends water heater & appliance life",
      "Salt-efficient, metered regeneration",
    ],
  },
  {
    id: "reverse-osmosis",
    icon: "BeakerIcon",
    name: "Reverse Osmosis Drinking Water",
    tagline: "Bottled-quality water on tap",
    short:
      "A multi-stage reverse osmosis system delivers crisp, purified drinking water right at your kitchen sink — removing up to 99% of dissolved solids, lead, PFAS, and more.",
    features: [
      "Up to 99% contaminant reduction",
      "Great-tasting water & ice",
      "Dedicated faucet or fridge line",
      "Cuts bottled-water costs for good",
    ],
  },
  {
    id: "well-water",
    icon: "GearIcon",
    name: "Well Water Treatment",
    tagline: "Custom systems for private wells",
    short:
      "Well water in the Columbus area often carries iron, sulfur, hardness, and bacteria. We test your water and design a tailored treatment system to make it clean, clear, and safe.",
    features: [
      "Iron & sulfur (rotten-egg smell) removal",
      "Sediment and turbidity filtration",
      "UV purification for bacteria",
      "pH balancing & custom configurations",
    ],
  },
] as const;

export const benefits = [
  {
    icon: "ShieldIcon",
    title: "Healthier for Your Family",
    body: "Reduce chlorine, lead, PFAS, and other contaminants so every glass, shower, and meal starts with cleaner water.",
  },
  {
    icon: "SparkleIcon",
    title: "No More Hard Water",
    body: "Stop fighting scale, spots, and buildup. Softer water means cleaner dishes, brighter laundry, and softer skin.",
  },
  {
    icon: "DropletIcon",
    title: "Better Taste & Smell",
    body: "Enjoy crisp, odor-free water straight from the tap — no more chlorine taste or that funny smell.",
  },
  {
    icon: "GearIcon",
    title: "Protect Your Home",
    body: "Filtered, softened water extends the life of your water heater, dishwasher, washing machine, and plumbing.",
  },
  {
    icon: "LeafIcon",
    title: "Save Money & Plastic",
    body: "Cut down on bottled water, detergents, and appliance repairs. Better water pays for itself over time.",
  },
  {
    icon: "WavesIcon",
    title: "Peace of Mind",
    body: "Know exactly what's in your water with a free professional test — and trust that it's being handled right.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "The difference was immediate. No more chlorine smell, our dishes actually come out clean, and my skin isn't dry anymore. The whole-home system was worth every penny.",
    name: "Sarah M.",
    location: "Dublin, OH",
  },
  {
    quote:
      "We're on a well and had constant iron staining and that sulfur smell. Their team tested everything, explained our options, and installed a system that completely fixed it.",
    name: "Dave R.",
    location: "Delaware, OH",
  },
  {
    quote:
      "Professional from the free water test to the install. Honest recommendations, no high-pressure sales. Our reverse osmosis water tastes better than any bottled brand.",
    name: "Priya K.",
    location: "Westerville, OH",
  },
] as const;

export const steps = [
  {
    number: "01",
    title: "Free Water Test",
    body: "We come to your home, test your water on the spot, and show you exactly what's in it — completely free.",
  },
  {
    number: "02",
    title: "Custom Recommendation",
    body: "Based on your results, water source, and budget, we recommend the right system for your home. No pressure.",
  },
  {
    number: "03",
    title: "Professional Install",
    body: "Our licensed technicians install your system cleanly and quickly, usually in a few hours, and show you how it works.",
  },
  {
    number: "04",
    title: "Ongoing Support",
    body: "We're local. Filter changes, maintenance, and questions are always just a phone call away.",
  },
] as const;
