import { API_URL } from "../config"
import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  FaStar, FaThumbsUp, FaThumbsDown, FaShoppingCart,
  FaBolt, FaArrowLeft, FaTrash, FaCheckCircle,
  FaTruck, FaBan, FaCreditCard, FaHeadset,
  FaBatteryFull, FaBox, FaShieldAlt, FaTag,
  FaCog, FaChevronDown, FaChevronUp
} from "react-icons/fa"
import { MdLocalOffer, MdVerified } from "react-icons/md"
import { CartContext } from "../context/CartContext"
import "./ProductDetails.css"

const staticProducts = [
  {
    id: 1, name: "RC Lamborghini Aventador", price: 2500, originalPrice: 3500, rating: 4.2, reviews: 128,
    desc: "High performance remote control supercar with turbo boost.", image: "/images/RC Lamborghini Aventador blackp1.jpg",
    badge: "BESTSELLER", category: "RC Cars",
    specs: {
      brand: "SpeedKing", model: "SKA-001", ageRating: "8+ years", material: "ABS Plastic + Metal Chassis",
      batteryType: "3.7V 1200mAh Li-ion (included)", chargingTime: "90 minutes", playTime: "30–40 minutes",
      range: "Up to 50 meters", scale: "1:12", topSpeed: "25 km/h", warranty: "6 months",
      inTheBox: ["RC Lamborghini Aventador", "Remote Controller", "Li-ion Battery", "USB Charging Cable", "User Manual", "Spare Parts Kit"]
    }
  },
  {
    id: 2, name: "BMW M4 Diecast Model", price: 1200, originalPrice: 1800, rating: 4.8, reviews: 245,
    desc: "Premium diecast collectible model, 1:18 scale.", image: "/images/BMW M4 Diecast Modelp2.jpg",
    badge: "TOP RATED", category: "Diecast",
    specs: {
      brand: "DieCastPro", model: "DCP-BMW-M4", ageRating: "14+ years", material: "Premium Die-cast Zinc Alloy",
      batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
      range: "N/A", scale: "1:18", topSpeed: "N/A", warranty: "12 months",
      inTheBox: ["BMW M4 Diecast Model", "Display Stand", "Certificate of Authenticity", "Protective Case", "Collector's Booklet"]
    }
  },
  {
    id: 3, name: "Nissan GT‑R R35", price: 1200, originalPrice: 1560, rating: 5, reviews: 80,
    desc: "Premium diecast collectible model.", image: "/images/Nissan GT‑R R35p3.jpg",
    specs: {
      brand: "DieCastPro", model: "DCP-GTR-R35", ageRating: "14+ years", material: "Die-cast Zinc Alloy",
      batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
      range: "N/A", scale: "1:18", topSpeed: "N/A", warranty: "12 months",
      inTheBox: ["Nissan GT-R R35 Model", "Display Stand", "Protective Box"]
    }
  },
  {
    id: 4, name: "Miniature Ducati Bike", price: 900, originalPrice: 1170, rating: 4, reviews: 60,
    desc: "Detailed scale model of Ducati superbike.", image: "/images/Miniature Ducati Bikep4.jpg",
    specs: {
      brand: "MotoScale", model: "MS-DUC-01", ageRating: "12+ years", material: "Die-cast Metal + Rubber Tyres",
      batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
      range: "N/A", scale: "1:12", topSpeed: "N/A", warranty: "6 months",
      inTheBox: ["Miniature Ducati Bike", "Kickstand", "Display Base", "Collector's Card"]
    }
  },
  {
    id: 5, name: "RC Monster Truck", price: 3000, originalPrice: 3900, rating: 5, reviews: 95,
    desc: "Powerful off-road remote control monster truck.", image: "/images/RC Monster Truckp5.jpg",
    specs: {
      brand: "TurboRacer", model: "TR-MT-500", ageRating: "8+ years", material: "Reinforced ABS Plastic",
      batteryType: "7.4V 1800mAh Li-ion (included)", chargingTime: "2 hours", playTime: "45–60 minutes",
      range: "Up to 80 meters", scale: "1:10", topSpeed: "35 km/h", warranty: "6 months",
      inTheBox: ["RC Monster Truck", "2.4GHz Remote Controller", "Li-ion Battery Pack", "Charger", "Tool Kit", "Spare Tyres", "User Manual"]
    }
  },
  {
    id: 6, name: "Ferrari 488 GTB Diecast", price: 1500, originalPrice: 1950, rating: 4, reviews: 72,
    desc: "Luxury Ferrari scale model for collectors.", image: "/images/Ferrari 488 GTB Diecastp6.jpg",
    specs: {
      brand: "LuxCast", model: "LC-F488-GTB", ageRating: "14+ years", material: "High-grade Die-cast Metal",
      batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
      range: "N/A", scale: "1:18", topSpeed: "N/A", warranty: "12 months",
      inTheBox: ["Ferrari 488 GTB Model", "Acrylic Display Case", "Certificate of Authenticity", "Collector's Booklet"]
    }
  },
  {
    id: 7, name: "RC Drift Racing Car", price: 2200, originalPrice: 2860, rating: 4, reviews: 110,
    desc: "High speed RC drift car with smooth handling.", image: "/images/RC Drift Racing Carp7.jpg",
    specs: {
      brand: "DriftKing", model: "DK-D200", ageRating: "8+ years", material: "ABS Plastic + Rubber Drift Tyres",
      batteryType: "3.7V 1000mAh Li-ion (included)", chargingTime: "60 minutes", playTime: "25–35 minutes",
      range: "Up to 40 meters", scale: "1:14", topSpeed: "20 km/h", warranty: "6 months",
      inTheBox: ["RC Drift Car", "2.4GHz Controller", "Li-ion Battery", "USB Charger", "4 Drift Tyre Set", "Manual"]
    }
  },
  {
    id: 8, name: "Miniature Yamaha R1", price: 950, originalPrice: 1235, rating: 4, reviews: 55,
    desc: "Premium Yamaha R1 miniature bike model.", image: "/images/Miniature Yamaha R1p8.jpg",
    specs: {
      brand: "MotoScale", model: "MS-YAM-R1", ageRating: "12+ years", material: "Die-cast Metal + Rubber Tyres",
      batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
      range: "N/A", scale: "1:12", topSpeed: "N/A", warranty: "6 months",
      inTheBox: ["Yamaha R1 Miniature", "Display Stand", "Collector's Card"]
    }
  },
  {
    id: 9, name: "RC Buggy Off Road", price: 2800, originalPrice: 3640, rating: 5, reviews: 88,
    desc: "Durable off-road buggy with strong suspension.", image: "/images/RC Buggy Off Roadp9.jpg",
    specs: {
      brand: "TurboRacer", model: "TR-BG-400", ageRating: "8+ years", material: "High-impact ABS + Metal Axles",
      batteryType: "7.4V 1500mAh Li-ion (included)", chargingTime: "90 minutes", playTime: "40–50 minutes",
      range: "Up to 60 meters", scale: "1:12", topSpeed: "30 km/h", warranty: "6 months",
      inTheBox: ["RC Buggy", "2.4GHz Controller", "Battery Pack", "Charger", "Spare Wheels", "Tool Kit", "Manual"]
    }
  },
  {
    id: 10, name: "Porsche 911 Diecast", price: 1700, originalPrice: 2210, rating: 4, reviews: 67,
    desc: "Classic Porsche collectible miniature model.", image: "/images/Porsche 911 Diecastp10.jpg",
    specs: {
      brand: "LuxCast", model: "LC-P911-C", ageRating: "14+ years", material: "Premium Die-cast Alloy",
      batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
      range: "N/A", scale: "1:18", topSpeed: "N/A", warranty: "12 months",
      inTheBox: ["Porsche 911 Model", "Display Stand", "Acrylic Case", "Certificate of Authenticity"]
    }
  },
  {
    id: 11, name: "Nissan GT-R R35 RC Car", price: 2600, originalPrice: 3380, rating: 5, reviews: 92,
    desc: "High performance RC sports car with aggressive design.", image: "/images/Nissan GT-R R35 RC Carp11.jpg",
    specs: {
      brand: "SpeedKing", model: "SKA-GTR-11", ageRating: "8+ years", material: "ABS Plastic + Metal Chassis",
      batteryType: "3.7V 1200mAh Li-ion (included)", chargingTime: "90 minutes", playTime: "30–40 minutes",
      range: "Up to 50 meters", scale: "1:12", topSpeed: "28 km/h", warranty: "6 months",
      inTheBox: ["RC Nissan GT-R", "2.4GHz Remote", "Li-ion Battery", "Charger", "Spare Parts Kit", "User Manual"]
    }
  },
  {
    id: 12, name: "Audi R8 V10 Diecast", price: 1800, originalPrice: 2340, rating: 4, reviews: 78,
    desc: "Premium diecast model of the iconic Audi R8 supercar.", image: "/images/Audi R8 V10 Diecastp12.jpg",
    specs: {
      brand: "DieCastPro", model: "DCP-R8-V10", ageRating: "14+ years", material: "Die-cast Zinc Alloy",
      batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
      range: "N/A", scale: "1:18", topSpeed: "N/A", warranty: "12 months",
      inTheBox: ["Audi R8 V10 Model", "Display Stand", "Collector's Box", "Certificate of Authenticity"]
    }
  },
  {
  id: 13, name: "Pulsar Bike", price: 850, originalPrice: 1100, rating: 4.3, reviews: 74,
  desc: "Detailed Bajaj Pulsar scale model for bike lovers.", image: "/images/pulsar bike.jpg",
  badge: null, category: "Diecast",
  specs: {
    brand: "MotoScale", model: "MS-PUL-150", ageRating: "12+ years", material: "Die-cast Metal + Rubber Tyres",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:12", topSpeed: "N/A", warranty: "6 months",
    inTheBox: ["Pulsar Bike Miniature", "Display Stand", "Collector's Card"]
  }
},
{
  id: 14, name: "Mahindra Thar RC Car", price: 2700, originalPrice: 3500, rating: 4.6, reviews: 102,
  desc: "Rugged 4x4 remote control Thar with off-road capability.", image: "/images/thar.jpg",
  badge: "NEW", category: "RC Cars",
  specs: {
    brand: "TurboRacer", model: "TR-THAR-4X4", ageRating: "8+ years", material: "ABS Plastic + Rubber Tyres",
    batteryType: "7.4V 1500mAh Li-ion (included)", chargingTime: "90 minutes", playTime: "40–50 minutes",
    range: "Up to 70 meters", scale: "1:12", topSpeed: "28 km/h", warranty: "6 months",
    inTheBox: ["RC Thar Car", "2.4GHz Remote Controller", "Li-ion Battery", "USB Charger", "Spare Tyres", "User Manual"]
  }
},
{
  id: 15, name: "Kawasaki Ninja", price: 980, originalPrice: 1300, rating: 4.5, reviews: 91,
  desc: "Premium Kawasaki Ninja scale model with sport finish.", image: "/images/kawasaki bike.jpg",
  badge: null, category: "Diecast",
  specs: {
    brand: "MotoScale", model: "MS-KAW-NJA", ageRating: "12+ years", material: "Die-cast Metal + Rubber Tyres",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:12", topSpeed: "N/A", warranty: "6 months",
    inTheBox: ["Kawasaki Ninja", "Kickstand", "Display Base", "Collector's Card"]
  }
},
{
  id: 16, name: "Royal Enfield Bullet", price: 920, originalPrice: 1200, rating: 4.7, reviews: 115,
  desc: "Classic Royal Enfield Bullet collectible miniature model.", image: "/images/royal enfield.jpg",
  badge: "POPULAR", category: "Diecast",
  specs: {
    brand: "MotoScale", model: "MS-RE-BULLET", ageRating: "12+ years", material: "Die-cast Metal + Rubber Tyres",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:12", topSpeed: "N/A", warranty: "6 months",
    inTheBox: ["Royal Enfield Bullet Miniature", "Kickstand", "Display Base", "Collector's Card"]
  }
},
// ── Trucks & Off-Road ──
{
  id: 17, name: "RAM 1500 TRX RC Car", price: 3200, originalPrice: 4200, rating: 4.7, reviews: 134,
  desc: "High-performance RC pickup truck with monster suspension.", image: "/images/RAM 1500 TRX.jpg",
  badge: "NEW", category: "RC Cars",
  specs: {
    brand: "TurboRacer", model: "TR-RAM-TRX", ageRating: "8+ years", material: "ABS Plastic + Rubber Tyres",
    batteryType: "7.4V 1800mAh Li-ion (included)", chargingTime: "2 hours", playTime: "45–55 minutes",
    range: "Up to 80 meters", scale: "1:12", topSpeed: "32 km/h", warranty: "6 months",
    inTheBox: ["RC RAM 1500 TRX", "2.4GHz Remote Controller", "Li-ion Battery", "Charger", "Spare Tyres", "Tool Kit", "User Manual"]
  }
},
{
  id: 18, name: "CAT 797F Dump Truck Diecast", price: 2200, originalPrice: 2900, rating: 4.5, reviews: 88,
  desc: "Iconic CAT mining dump truck premium diecast model.", image: "/images/CAT 797F Dump Truck.jpg",
  badge: null, category: "Diecast",
  specs: {
    brand: "DieCastPro", model: "DCP-CAT-797F", ageRating: "14+ years", material: "Premium Die-cast Zinc Alloy",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:50", topSpeed: "N/A", warranty: "12 months",
    inTheBox: ["CAT 797F Model", "Display Stand", "Certificate of Authenticity", "Collector's Booklet"]
  }
},
{
  id: 19, name: "Ford F-150 Raptor RC Car", price: 3000, originalPrice: 3900, rating: 4.8, reviews: 156,
  desc: "Powerful off-road RC Ford Raptor with 4WD drive system.", image: "/images/Ford F-150 Raptor.jpg",
  badge: "BESTSELLER", category: "RC Cars",
  specs: {
    brand: "TurboRacer", model: "TR-F150-RAP", ageRating: "8+ years", material: "ABS Plastic + Metal Chassis",
    batteryType: "7.4V 1600mAh Li-ion (included)", chargingTime: "90 minutes", playTime: "40–50 minutes",
    range: "Up to 80 meters", scale: "1:12", topSpeed: "30 km/h", warranty: "6 months",
    inTheBox: ["RC Ford F-150 Raptor", "2.4GHz Remote", "Li-ion Battery", "Charger", "Spare Tyres", "User Manual"]
  }
},
{
  id: 20, name: "Ferrari LaFerrari Diecast", price: 2500, originalPrice: 3200, rating: 4.9, reviews: 201,
  desc: "Luxury Ferrari LaFerrari hybrid supercar diecast collectible.", image: "/images/Ferrari LaFerrari.jpg",
  badge: "TOP RATED", category: "Diecast",
  specs: {
    brand: "LuxCast", model: "LC-LAF-HYB", ageRating: "14+ years", material: "High-grade Die-cast Metal",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:18", topSpeed: "N/A", warranty: "12 months",
    inTheBox: ["Ferrari LaFerrari Model", "Acrylic Display Case", "Certificate of Authenticity", "Collector's Booklet"]
  }
},
{
  id: 21, name: "Tesla Model S Plaid Diecast", price: 1900, originalPrice: 2500, rating: 4.6, reviews: 119,
  desc: "Premium Tesla Model S Plaid electric car scale model.", image: "/images/Tesla Model S Plaid.jpg",
  badge: null, category: "Diecast",
  specs: {
    brand: "DieCastPro", model: "DCP-TESLA-SP", ageRating: "14+ years", material: "Die-cast Zinc Alloy",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:18", topSpeed: "N/A", warranty: "12 months",
    inTheBox: ["Tesla Model S Plaid Model", "Display Stand", "Collector's Box"]
  }
},

// ── Heavy Trucks ──
{
  id: 22, name: "Tata Prima Truck Diecast", price: 1600, originalPrice: 2100, rating: 4.3, reviews: 76,
  desc: "Detailed Tata Prima heavy truck diecast collectible.", image: "/images/Tata Prima.jpg",
  badge: null, category: "Diecast",
  specs: {
    brand: "DieCastPro", model: "DCP-TATA-PRM", ageRating: "14+ years", material: "Die-cast Zinc Alloy",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:32", topSpeed: "N/A", warranty: "12 months",
    inTheBox: ["Tata Prima Model", "Display Stand", "Collector's Card"]
  }
},
{
  id: 23, name: "MAN TGX Truck Diecast", price: 1750, originalPrice: 2300, rating: 4.4, reviews: 82,
  desc: "European MAN TGX long-haul truck premium scale model.", image: "/images/MAN TGX.jpg",
  badge: null, category: "Diecast",
  specs: {
    brand: "DieCastPro", model: "DCP-MAN-TGX", ageRating: "14+ years", material: "Die-cast Zinc Alloy",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:32", topSpeed: "N/A", warranty: "12 months",
    inTheBox: ["MAN TGX Model", "Display Stand", "Certificate of Authenticity"]
  }
},
{
  id: 24, name: "Scania R730 Truck Diecast", price: 1850, originalPrice: 2400, rating: 4.6, reviews: 97,
  desc: "Iconic Scania R730 V8 truck collector's diecast model.", image: "/images/Scania R730.jpg",
  badge: "POPULAR", category: "Diecast",
  specs: {
    brand: "DieCastPro", model: "DCP-SCA-R730", ageRating: "14+ years", material: "Premium Die-cast Metal",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:32", topSpeed: "N/A", warranty: "12 months",
    inTheBox: ["Scania R730 Model", "Display Stand", "Certificate of Authenticity", "Collector's Booklet"]
  }
},
{
  id: 25, name: "Jeep Wrangler Rubicon RC Car", price: 2900, originalPrice: 3800, rating: 4.7, reviews: 143,
  desc: "Rugged RC Jeep Wrangler with rock-crawling capability.", image: "/images/Jeep Wrangler Rubicon.jpg",
  badge: null, category: "RC Cars",
  specs: {
    brand: "TurboRacer", model: "TR-JEEP-RUB", ageRating: "8+ years", material: "ABS Plastic + Rubber Tyres",
    batteryType: "7.4V 1600mAh Li-ion (included)", chargingTime: "90 minutes", playTime: "40–50 minutes",
    range: "Up to 75 meters", scale: "1:12", topSpeed: "25 km/h", warranty: "6 months",
    inTheBox: ["RC Jeep Wrangler", "2.4GHz Remote", "Li-ion Battery", "Charger", "Spare Tyres", "User Manual"]
  }
},
{
  id: 26, name: "Volvo FH16 Truck Diecast", price: 1950, originalPrice: 2550, rating: 4.5, reviews: 89,
  desc: "Premium Volvo FH16 750hp truck diecast scale model.", image: "/images/Volvo FH16.jpg",
  badge: null, category: "Diecast",
  specs: {
    brand: "DieCastPro", model: "DCP-VOL-FH16", ageRating: "14+ years", material: "Die-cast Zinc Alloy",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:32", topSpeed: "N/A", warranty: "12 months",
    inTheBox: ["Volvo FH16 Model", "Display Stand", "Certificate of Authenticity"]
  }
},

// ── Bikes ──
{
  id: 27, name: "TVS Apache RR 310 Miniature", price: 880, originalPrice: 1150, rating: 4.4, reviews: 98,
  desc: "Detailed TVS Apache RR 310 race bike miniature model.", image: "/images/TVS Apache RR 310.jpg",
  badge: null, category: "Diecast",
  specs: {
    brand: "MotoScale", model: "MS-TVS-RR310", ageRating: "12+ years", material: "Die-cast Metal + Rubber Tyres",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:12", topSpeed: "N/A", warranty: "6 months",
    inTheBox: ["TVS Apache RR 310 Miniature", "Display Stand", "Collector's Card"]
  }
},
{
  id: 28, name: "BMW S1000RR Miniature", price: 1050, originalPrice: 1400, rating: 4.8, reviews: 131,
  desc: "Premium BMW S1000RR superbike precision scale model.", image: "/images/BMW M4 Diecast Modelp2.jpg",
  badge: "TOP RATED", category: "Diecast",
  specs: {
    brand: "MotoScale", model: "MS-BMW-S1RR", ageRating: "12+ years", material: "Die-cast Metal + Rubber Tyres",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:12", topSpeed: "N/A", warranty: "6 months",
    inTheBox: ["BMW S1000RR Miniature", "Display Stand", "Collector's Card", "Certificate of Authenticity"]
  }
},
{
  id: 29, name: "Suzuki Hayabusa Miniature", price: 1000, originalPrice: 1350, rating: 4.7, reviews: 122,
  desc: "Iconic Suzuki Hayabusa GSX1300R collector's miniature.", image: "/images/Suzuki Hayabusa.jpg",
  badge: "POPULAR", category: "Diecast",
  specs: {
    brand: "MotoScale", model: "MS-SUZ-HAYA", ageRating: "12+ years", material: "Die-cast Metal + Rubber Tyres",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:12", topSpeed: "N/A", warranty: "6 months",
    inTheBox: ["Hayabusa Miniature", "Display Stand", "Collector's Card"]
  }
},
{
  id: 30, name: "Honda CBR1000RR Miniature", price: 970, originalPrice: 1280, rating: 4.5, reviews: 107,
  desc: "Precision Honda CBR1000RR Fireblade scale model.", image: "/images/Honda CBR1000RR.jpg",
  badge: null, category: "Diecast",
  specs: {
    brand: "MotoScale", model: "MS-HON-CBR1K", ageRating: "12+ years", material: "Die-cast Metal + Rubber Tyres",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:12", topSpeed: "N/A", warranty: "6 months",
    inTheBox: ["Honda CBR1000RR Miniature", "Display Stand", "Collector's Card"]
  }
},
{
  id: 31, name: "KTM Duke 390 Miniature", price: 840, originalPrice: 1100, rating: 4.3, reviews: 86,
  desc: "Sporty KTM Duke 390 detailed miniature bike model.", image: "/images/KTM Duke 390.jpg",
  badge: null, category: "Diecast",
  specs: {
    brand: "MotoScale", model: "MS-KTM-D390", ageRating: "12+ years", material: "Die-cast Metal + Rubber Tyres",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:12", topSpeed: "N/A", warranty: "6 months",
    inTheBox: ["KTM Duke 390 Miniature", "Display Stand", "Collector's Card"]
  }
},
{
  id: 32, name: "Yamaha YZF-R1 Miniature", price: 990, originalPrice: 1320, rating: 4.6, reviews: 114,
  desc: "High-detail Yamaha YZF-R1 MotoGP replica scale model.", image: "/images/Yamaha YZF-R1.jpg",
  badge: null, category: "Diecast",
  specs: {
    brand: "MotoScale", model: "MS-YAM-R1M", ageRating: "12+ years", material: "Die-cast Metal + Rubber Tyres",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:12", topSpeed: "N/A", warranty: "6 months",
    inTheBox: ["Yamaha YZF-R1 Miniature", "Display Stand", "Collector's Card"]
  }
},

// ── Muscle Cars ──
{
  id: 33, name: "Ford Mustang GT Diecast", price: 1650, originalPrice: 2150, rating: 4.6, reviews: 138,
  desc: "Classic Ford Mustang GT500 premium diecast collectible.", image: "/images/Ford Mustang GT.jpeg",
  badge: null, category: "Diecast",
  specs: {
    brand: "LuxCast", model: "LC-MUST-GT", ageRating: "14+ years", material: "High-grade Die-cast Metal",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:18", topSpeed: "N/A", warranty: "12 months",
    inTheBox: ["Ford Mustang GT Model", "Display Stand", "Acrylic Case", "Certificate of Authenticity"]
  }
},
{
  id: 34, name: "Chevrolet Camaro SS Diecast", price: 1700, originalPrice: 2200, rating: 4.5, reviews: 126,
  desc: "Iconic Chevrolet Camaro SS muscle car diecast model.", image: "/images/Chevrolet Camaro SS.jpg",
  badge: null, category: "Diecast",
  specs: {
    brand: "LuxCast", model: "LC-CAM-SS", ageRating: "14+ years", material: "High-grade Die-cast Metal",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:18", topSpeed: "N/A", warranty: "12 months",
    inTheBox: ["Chevrolet Camaro SS Model", "Display Stand", "Acrylic Case", "Certificate of Authenticity"]
  }
},
{
  id: 35, name: "Honda CBR1000RR-R Fireblade", price: 1080, originalPrice: 1450, rating: 4.9, reviews: 167,
  desc: "Precision Honda CBR1000RR-R SP superbike collector's miniature.", image: "/images/Honda CBR1000RR-R Fireblade.jpg",
  badge: "TOP RATED", category: "Diecast",
  specs: {
    brand: "MotoScale", model: "MS-HON-CBRRRR", ageRating: "12+ years", material: "Die-cast Metal + Rubber Tyres",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:12", topSpeed: "N/A", warranty: "6 months",
    inTheBox: ["Honda CBR1000RR-R Fireblade Miniature", "Display Stand", "Certificate of Authenticity", "Collector's Card"]
  }
},
{
  id: 36, name: "Yamaha RX 100 Miniature", price: 750, originalPrice: 980, rating: 4.8, reviews: 189,
  desc: "Iconic vintage Yamaha RX 100 classic bike miniature model.", image: "/images/RX 100.jpg",
  badge: "POPULAR", category: "Diecast",
  specs: {
    brand: "MotoScale", model: "MS-YAM-RX100", ageRating: "12+ years", material: "Die-cast Metal + Rubber Tyres",
    batteryType: "No battery required", chargingTime: "N/A", playTime: "N/A",
    range: "N/A", scale: "1:12", topSpeed: "N/A", warranty: "6 months",
    inTheBox: ["Yamaha RX 100 Miniature", "Kickstand", "Display Base", "Collector's Card"]
  }
},

]

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState("")
  const [addedToCart, setAddedToCart] = useState(false)
  const [specsOpen, setSpecsOpen] = useState(true)

  const user = JSON.parse(localStorage.getItem("user") || "null")
  const userEmail = user?.email || ""
  const userName = user?.username || user?.name || "Anonymous"

  useEffect(() => {
    const staticMatch = staticProducts.find(p => String(p.id) === String(id))
    if (staticMatch) {
      setProduct(staticMatch)
    } else {
      axios.get(`${API_URL}/products/${id}`)
        .then(res => setProduct(res.data))
        .catch(() => setProduct(null))
    }
  }, [id])

  const fetchReviews = () => {
    axios.get(`${API_URL}/reviews/${id}`)
      .then(res => setReviews(res.data))
      .catch(() => setReviews([]))
  }

  useEffect(() => {
    fetchReviews()
  }, [id])

  const handleSubmitReview = async () => {
    if (!userEmail) return setSubmitMsg("Please login to review")
    if (userRating === 0) return setSubmitMsg("Please select a star rating")
    if (comment.trim().length < 5) return setSubmitMsg("Comment too short")

    setSubmitting(true)
    try {
      const res = await axios.post(`${API_URL}/reviews`, {
        productId: id, username: userName, email: userEmail,
        rating: userRating, comment: comment.trim()
      })
      if (res.data.success) {
        setComment(""); setUserRating(0)
        setSubmitMsg("✅ Review posted!")
        fetchReviews()
      } else {
        setSubmitMsg(res.data.message || "Error posting review")
      }
    } catch {
      setSubmitMsg("Server error")
    }
    setSubmitting(false)
    setTimeout(() => setSubmitMsg(""), 3000)
  }

  const handleLike = async (reviewId) => {
    if (!userEmail) return
    await axios.put(`${API_URL}/reviews/${reviewId}/like`, { email: userEmail })
    fetchReviews()
  }

  const handleDislike = async (reviewId) => {
    if (!userEmail) return
    await axios.put(`${API_URL}/reviews/${reviewId}/dislike`, { email: userEmail })
    fetchReviews()
  }

  const handleDelete = async (reviewId) => {
    await axios.delete(`${API_URL}/reviews/${reviewId}`)
    fetchReviews()
  }

  const handleAddToCart = () => {
    addToCart(product)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
  }

  const avgRating =
  Array.isArray(reviews) && reviews.length
    ? (
        reviews.reduce((s, r) => s + r.rating, 0) /
        reviews.length
      ).toFixed(1)
    : 0;

  const ratingCount = (star) => reviews.filter(r => r.rating === star).length
  const ratingPercent = (star) => reviews.length ? Math.round((ratingCount(star) / reviews.length) * 100) : 0

  const discount = product?.originalPrice > product?.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  if (!product) return (
    <div className="pd-loading">
      <div className="pd-spinner" />
      <p>Loading product...</p>
    </div>
  )

  const specs = product.specs || {}

  return (
    <div className="pd-page">

      <div className="pd-blob pd-blob1" />
      <div className="pd-blob pd-blob2" />

      <button className="pd-back" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      {/* ── Product Section ── */}
      <div className="pd-product-section">

        <div className="pd-img-box">
          {product.badge && <div className="pd-badge">{product.badge}</div>}
          {discount && <div className="pd-disc-badge">{discount}% OFF</div>}
          <img src={product.image} alt={product.name} />
        </div>

        <div className="pd-info">
          <h1 className="pd-name">{product.name}</h1>

          {reviews.length > 0 && (
            <div className="pd-avg-row">
              <span className="pd-avg-pill">
                {avgRating} <FaStar style={{ fontSize: "12px" }} />
              </span>
              <span className="pd-rev-count">{reviews.length} ratings</span>
              {avgRating >= 4.5 && <span className="pd-verified"><MdVerified /> Verified</span>}
            </div>
          )}

          <div className="pd-price-row">
            <span className="pd-price">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="pd-original">₹{product.originalPrice?.toLocaleString()}</span>
                <span className="pd-discount">{discount}% off</span>
              </>
            )}
          </div>

          <p className="pd-desc">{product.desc}</p>

          <div className="pd-offer">
            <MdLocalOffer /> Free delivery on this item
          </div>

          <div className="pd-policy-strip">
            <div className="pd-policy-badge">
              <FaTruck className="pd-policy-icon pd-policy-icon--green" />
              <div className="pd-policy-text">
                <span className="pd-policy-title">Cash on Delivery</span>
                <span className="pd-policy-sub">Pay when you receive</span>
              </div>
            </div>
            <div className="pd-policy-badge">
              <FaBan className="pd-policy-icon pd-policy-icon--red" />
              <div className="pd-policy-text">
                <span className="pd-policy-title">No Returns</span>
                <span className="pd-policy-sub">All sales are final</span>
              </div>
            </div>
            <div className="pd-policy-badge">
              <FaCreditCard className="pd-policy-icon pd-policy-icon--gray" />
              <div className="pd-policy-text">
                <span className="pd-policy-title">No EMI</span>
                <span className="pd-policy-sub">Full payment only</span>
              </div>
            </div>
          </div>

          <div className="pd-btns">
            <button className={`pd-cart-btn ${addedToCart ? "pd-added" : ""}`} onClick={handleAddToCart}>
              <FaShoppingCart />
              {addedToCart ? "Added!" : "Add to Cart"}
            </button>
            <button className="pd-buy-btn" onClick={() => navigate("/checkout", { state: { product } })}>
              <FaBolt /> Buy Now
            </button>
          </div>

          <div className="pd-support-bar">
            <FaHeadset className="pd-support-icon" />
            <span>Need Help?</span>
            <button
              className="pd-support-link"
              onClick={() => navigate("/customer-support", { state: { productName: product.name, productId: id } })}
            >
              Customer Support
            </button>
          </div>
        </div>
      </div>

      {/* ── Specifications Section ── */}
      {specs && Object.keys(specs).length > 0 && (
        <div className="pd-specs-section">

          <div className="pd-specs-header" onClick={() => setSpecsOpen(!specsOpen)}>
            <div className="pd-specs-title-row">
              <FaCog className="pd-specs-icon" />
              <h2 className="pd-specs-title">Product Specifications</h2>
            </div>
            <button className="pd-specs-toggle">
              {specsOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          {specsOpen && (
            <div className="pd-specs-body">

              {/* Quick Spec Pills */}
              <div className="pd-spec-pills">
                {specs.brand && (
                  <div className="pd-spec-pill">
                    <FaTag className="pd-pill-icon" />
                    <span className="pd-pill-label">Brand</span>
                    <span className="pd-pill-value">{specs.brand}</span>
                  </div>
                )}
                {specs.ageRating && (
                  <div className="pd-spec-pill">
                    <span className="pd-pill-emoji">🎯</span>
                    <span className="pd-pill-label">Age</span>
                    <span className="pd-pill-value">{specs.ageRating}</span>
                  </div>
                )}
                {specs.scale && (
                  <div className="pd-spec-pill">
                    <span className="pd-pill-emoji">📐</span>
                    <span className="pd-pill-label">Scale</span>
                    <span className="pd-pill-value">{specs.scale}</span>
                  </div>
                )}
                {specs.warranty && (
                  <div className="pd-spec-pill">
                    <FaShieldAlt className="pd-pill-icon pd-pill-icon--green" />
                    <span className="pd-pill-label">Warranty</span>
                    <span className="pd-pill-value">{specs.warranty}</span>
                  </div>
                )}
              </div>

              {/* Spec Table Grid */}
              <div className="pd-specs-grid">

                {/* General Info */}
                <div className="pd-spec-card">
                  <div className="pd-spec-card-header">
                    <span className="pd-spec-card-icon">📋</span>
                    <h3>General Information</h3>
                  </div>
                  <div className="pd-spec-rows">
                    {specs.brand && <div className="pd-spec-row"><span>Brand</span><span>{specs.brand}</span></div>}
                    {specs.model && <div className="pd-spec-row"><span>Model</span><span>{specs.model}</span></div>}
                    {specs.ageRating && <div className="pd-spec-row"><span>Age Rating</span><span>{specs.ageRating}</span></div>}
                    {specs.scale && <div className="pd-spec-row"><span>Scale</span><span>{specs.scale}</span></div>}
                    {specs.material && <div className="pd-spec-row"><span>Material</span><span>{specs.material}</span></div>}
                  </div>
                </div>

                {/* Battery & Performance */}
                <div className="pd-spec-card">
                  <div className="pd-spec-card-header">
                    <FaBatteryFull className="pd-spec-card-icon-svg" />
                    <h3>Battery & Performance</h3>
                  </div>
                  <div className="pd-spec-rows">
                    {specs.batteryType && <div className="pd-spec-row"><span>Battery</span><span>{specs.batteryType}</span></div>}
                    {specs.chargingTime && specs.chargingTime !== "N/A" && (
                      <div className="pd-spec-row"><span>Charging Time</span><span>{specs.chargingTime}</span></div>
                    )}
                    {specs.playTime && specs.playTime !== "N/A" && (
                      <div className="pd-spec-row"><span>Play Time</span><span>{specs.playTime}</span></div>
                    )}
                    {specs.range && specs.range !== "N/A" && (
                      <div className="pd-spec-row"><span>Control Range</span><span>{specs.range}</span></div>
                    )}
                    {specs.topSpeed && specs.topSpeed !== "N/A" && (
                      <div className="pd-spec-row"><span>Top Speed</span><span>{specs.topSpeed}</span></div>
                    )}
                    {(!specs.chargingTime || specs.chargingTime === "N/A") && (
                      <div className="pd-spec-row pd-spec-row--muted"><span>Battery</span><span>Not required</span></div>
                    )}
                  </div>
                </div>

                {/* Warranty */}
                <div className="pd-spec-card pd-spec-card--warranty">
                  <div className="pd-spec-card-header">
                    <FaShieldAlt className="pd-spec-card-icon-svg pd-icon--green" />
                    <h3>Warranty & Support</h3>
                  </div>
                  <div className="pd-spec-rows">
                    {specs.warranty && <div className="pd-spec-row"><span>Warranty Period</span><span className="pd-warranty-val">{specs.warranty}</span></div>}
                    <div className="pd-spec-row"><span>Warranty Type</span><span>Manufacturer Warranty</span></div>
                    <div className="pd-spec-row"><span>Service Type</span><span>Carry-in</span></div>
                  </div>
                  <div className="pd-warranty-note">
                    <FaCheckCircle style={{ color: "#22c55e", marginRight: "6px" }} />
                    Warranty covers manufacturing defects only
                  </div>
                </div>

              </div>

              {/* What's in the Box */}
              {specs.inTheBox && specs.inTheBox.length > 0 && (
                <div className="pd-inbox-section">
                  <div className="pd-inbox-header">
                    <FaBox className="pd-inbox-icon" />
                    <h3>What's in the Box</h3>
                  </div>
                  <div className="pd-inbox-grid">
                    {specs.inTheBox.map((item, i) => (
                      <div className="pd-inbox-item" key={i}>
                        <FaCheckCircle className="pd-inbox-check" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* ── Reviews Section ── */}
      <div className="pd-reviews-section">

        <h2 className="pd-reviews-title">
          Customer Reviews
          <span className="pd-rev-chip">{reviews.length}</span>
        </h2>

        {reviews.length > 0 && (
          <div className="pd-rating-summary">
            <div className="pd-big-rating">
              <span className="pd-big-num">{avgRating}</span>
              <div className="pd-big-stars">
                {[1,2,3,4,5].map(s => (
                  <FaStar key={s} style={{ color: s <= Math.round(avgRating) ? "#e50914" : "#333" }} />
                ))}
              </div>
              <span className="pd-total-rev">{reviews.length} reviews</span>
            </div>
            <div className="pd-bars">
              {[5,4,3,2,1].map(star => (
                <div className="pd-bar-row" key={star}>
                  <span className="pd-bar-label">{star} <FaStar style={{ fontSize: "10px", color: "#e50914" }} /></span>
                  <div className="pd-bar-track">
                    <div className="pd-bar-fill" style={{ width: `${ratingPercent(star)}%` }} />
                  </div>
                  <span className="pd-bar-count">{ratingCount(star)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pd-write-review">
          <h3>Write a Review</h3>
          {!userEmail ? (
            <p className="pd-login-msg"><a href="/login">Login</a> to write a review</p>
          ) : (
            <>
              <div className="pd-star-picker">
                <span>Your Rating:</span>
                <div className="pd-stars">
                  {[1,2,3,4,5].map(s => (
                    <FaStar key={s} className="pd-star-pick"
                      style={{ color: s <= (hoverRating || userRating) ? "#e50914" : "#333" }}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(s)}
                    />
                  ))}
                </div>
                {userRating > 0 && (
                  <span className="pd-rating-label-text">
                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][userRating]}
                  </span>
                )}
              </div>
              <textarea className="pd-textarea"
                placeholder="Share your experience with this product..."
                value={comment} onChange={e => setComment(e.target.value)} rows={4}
              />
              {submitMsg && (
                <p className={`pd-submit-msg ${submitMsg.includes("✅") ? "pd-msg-ok" : "pd-msg-err"}`}>
                  {submitMsg}
                </p>
              )}
              <button className="pd-submit-btn" onClick={handleSubmitReview} disabled={submitting}>
                {submitting ? "Posting..." : "Post Review"}
              </button>
            </>
          )}
        </div>

        <div className="pd-reviews-list">
          {reviews.length === 0 ? (
            <p className="pd-no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map(review => {
              const liked = review.likes?.includes(userEmail)
              const disliked = review.dislikes?.includes(userEmail)
              const isOwner = review.email === userEmail
              return (
                <div className="pd-review-card" key={review._id}>
                  <div className="pd-review-header">
                    <div className="pd-reviewer-avatar">{review.username?.charAt(0).toUpperCase()}</div>
                    <div className="pd-reviewer-info">
                      <span className="pd-reviewer-name">{review.username}</span>
                      <span className="pd-review-date">
                        {new Date(review.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    {isOwner && (
                      <button className="pd-delete-btn" onClick={() => handleDelete(review._id)} title="Delete review">
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  <div className="pd-review-stars">
                    {[1,2,3,4,5].map(s => (
                      <FaStar key={s} style={{ color: s <= review.rating ? "#e50914" : "#333", fontSize: "13px" }} />
                    ))}
                    <span className="pd-review-rating-label">
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][review.rating]}
                    </span>
                  </div>
                  <p className="pd-review-comment">{review.comment}</p>
                  <div className="pd-review-actions">
                    <span className="pd-helpful-text">Helpful?</span>
                    <button className={`pd-like-btn ${liked ? "pd-liked" : ""}`} onClick={() => handleLike(review._id)}>
                      <FaThumbsUp /> {review.likes?.length || 0}
                    </button>
                    <button className={`pd-dislike-btn ${disliked ? "pd-disliked" : ""}`} onClick={() => handleDislike(review._id)}>
                      <FaThumbsDown /> {review.dislikes?.length || 0}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail