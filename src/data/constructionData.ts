import { ConstructionProject, VideoShowcaseItem } from "../types";

export const CONSTRUCTION_SERVICES = [
  {
    id: "serv-residential",
    title: "Residential Site Building & Luxury Villas",
    subtitle: "Turnkey homes from ground breaking to handover",
    icon: "Home",
    description: "Complete architectural construction for private residences, modern multi-storey villas, and suburban bungalows across Kampala, Entebbe, and Wakiso. Handled with structural precision and premium finishing.",
    features: [
      "Soil testing & engineered reinforced strip/pad foundations",
      "Termite barrier treatments & DPC waterproofing",
      "High-tensile steel bar reinforcement (BS 4449 compliant)",
      "Engineered concrete mixes (C25/C30 structural grade)",
      "High-pitch clay tile or modern stone-coated metal roofing"
    ],
    startingPriceUGX: "From 950,000 UGX / m² (Shell)",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "serv-commercial",
    title: "Commercial Plazas & Office Complexes",
    subtitle: "Multi-level developments built to international standards",
    icon: "Building2",
    description: "Fast-track construction of commercial retail plazas, office towers, mixed-use developments, and corporate headquarters with certified structural safety and strict timeline control.",
    features: [
      "Heavy load-bearing columns & post-tensioned slabs",
      "Curtain wall glass installation & aluminum cladding",
      "Integrated MEP (Mechanical, Electrical & Plumbing) ducts",
      "Fire suppression systems and emergency egress compliance",
      "Lift shaft engineering & basement parking drainage"
    ],
    startingPriceUGX: "From 1,450,000 UGX / m²",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f6?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "serv-civil",
    title: "Civil Works, Earthmoving & Retaining Walls",
    subtitle: "Heavy foundation preparation and site grading",
    icon: "Tractor",
    description: "Excavation, slope stabilization, stepped gabion retaining walls, drainage culverts, boundary masonry walls, and industrial compound concrete paving.",
    features: [
      "Compaction testing and cut-and-fill optimization",
      "Reinforced stone masonry retaining barriers",
      "Subsoil drainage weeping pipes and French drains",
      "High security razor-wire perimeter walling",
      "Paving block laying and heavy vehicle driveways"
    ],
    startingPriceUGX: "Custom Bill of Quantities (BOQ)",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "serv-roofing",
    title: "Structural Steel Trusses & Architectural Roofing",
    subtitle: "Leak-proof engineering engineered for tropical downpours",
    icon: "ShieldAlert",
    description: "Fabrication and erection of heavy structural steel trusses, timber rafters, concealed box gutters, and premium roofing sheets with thermal insulation underlayment.",
    features: [
      "Custom welded angle-iron & tubular steel rafters",
      "Anti-corrosive epoxy primer & galvanized finishes",
      "Aluminum foil double-bubble heat reflective insulation",
      "High-gauge charcoal matte standing seam roofing",
      "Rainwater harvesting downspouts and storage cisterns"
    ],
    startingPriceUGX: "From 120,000 UGX / m²",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80"
  }
];

export const CONSTRUCTION_PROJECTS: ConstructionProject[] = [
  {
    id: "proj-01",
    title: "The Kyanja Panorama Villa",
    category: "Residential Villa",
    location: "Kyanja Hill, Kampala",
    duration: "9 Months",
    year: "2025",
    scope: "Full turnkey construction of 5-bedroom modern villa with infinity pool, cantilevers, and bespoke Mvule woodwork throughout.",
    areaSqMeters: 520,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    keyHighlights: [
      "Deep stepped pad foundation in hillside terrain",
      "Double-height living room with acoustic ceiling",
      "Custom kitchen island & wardrobes by Yingo Furniture Studio",
      "Solar inverter and rainwater harvesting integration"
    ],
    client: "Dr. & Mrs. K. Tumusiime"
  },
  {
    id: "proj-02",
    title: "Apex Commercial Plaza & Corporate Suites",
    category: "Commercial Complex",
    location: "Ntinda-Nakawa Corridor, Kampala",
    duration: "14 Months",
    year: "2024",
    scope: "4-storey commercial office and banking hall with reinforced concrete frame, underground stormwater attenuation, and modern glass facade.",
    areaSqMeters: 1850,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    keyHighlights: [
      "Continuous raft foundation with waterproofing membrane",
      "High-tensile rebar reinforcement C35 concrete test certificates",
      "Complete acoustic boardroom fit-outs by Yingo Furniture",
      "Delivered 3 weeks ahead of scheduled contract deadline"
    ],
    client: "Apex Properties Uganda Ltd"
  },
  {
    id: "proj-03",
    title: "Lubowa Heights Luxury Duplex Residences",
    category: "Residential Villa",
    location: "Lubowa Estate, Entebbe Road",
    duration: "11 Months",
    year: "2025",
    scope: "Twin architectural residences featuring exposed stone masonry, cantilevered sunshades, and open-plan Scandinavian interior woodwork.",
    areaSqMeters: 740,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    keyHighlights: [
      "Custom timber louvers and pergolas in seasoned Teak",
      "Perimeter security wall with electric fence and automated gate",
      "Imported porcelain tile work with German waterproof grouting"
    ],
    client: "Oakmont Developments"
  },
  {
    id: "proj-04",
    title: "Namanve Industrial Logistics Facility",
    category: "Structural Steel",
    location: "Namanve Industrial Park, Mukono",
    duration: "6 Months",
    year: "2024",
    scope: "Clear-span industrial steel warehouse with 24-meter truss spans, polished heavy-duty laser-screed concrete floor, and loading bays.",
    areaSqMeters: 2400,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    keyHighlights: [
      "Heavy I-beam portal frames engineered for 10-ton overhead crane",
      "Industrial power-floated floor with quartz hardener",
      "External heavy truck turning radius concrete aprons"
    ],
    client: "Trans-Equator Logistics"
  }
];

export const VIDEO_SHOWCASE: VideoShowcaseItem[] = [
  {
    id: "vid-01",
    title: "Structural Concrete Pouring & Column Rebar Casting",
    category: "Site Construction",
    // Clean public direct HTML5 construction video
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f6?auto=format&fit=crop&w=1200&q=80",
    duration: "0:15",
    description: "Watch our site engineering crew vibrate and cure C30 structural concrete on a multi-storey project in Kampala.",
    locationOrCraft: "Site Building Unit • Kampala"
  },
  {
    id: "vid-02",
    title: "Master Joinery: Hand-Carving Solid Mvule Hardwood",
    category: "Woodworking & Joinery",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80",
    duration: "0:15",
    description: "Precision planar machining, mortise-and-tenon interlocking joints, and organic wood grain finishing at the Yingo Carpentry Workshop.",
    locationOrCraft: "Furniture Studio • Workshop"
  },
  {
    id: "vid-03",
    title: "Architectural Villa Framing & Roof Truss Erection",
    category: "Site Construction",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
    duration: "0:15",
    description: "Precision installation of heavy-gauge welded steel trusses and high-performance charcoal standing-seam roofing.",
    locationOrCraft: "Civil Engineering • Kyanja Site"
  }
];

export const COMPANY_STATS = [
  { label: "Completed Site Projects", value: "185+", note: "Across Kampala, Wakiso & Entebbe" },
  { label: "Handcrafted Furniture Pieces", value: "1,240+", note: "Homes, Executive Offices & Hotels" },
  { label: "Years of Master Experience", value: "15+", note: "Licensed Engineering & Guild Carpentry" },
  { label: "On-Time Handover Rate", value: "99.2%", note: "Strict Schedule & BOQ Discipline" }
];
