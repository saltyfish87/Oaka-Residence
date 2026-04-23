export interface LandingContent {
  projectName: string;
  developer: string;
  logoUrl?: string;
  whatsappNumber: string;
  whatsappMessage: string;
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  overview: {
    description: string;
    imageUrl: string;
    stats: { label: string; value: string }[];
  };
  keyFeatures: {
    title: string;
    items: string[];
  };
  location: {
    description: string;
    imageUrl: string;
    nearby: { category: string; points: string[] }[];
    accessibility: string[];
  };
  facilities: {
    title: string;
    items: { name: string; icon: string }[];
  };
  layouts: {
    title: string;
    types: {
      type: string;
      size: string;
      config: string;
      imageUrl: string;
    }[];
  };
  gallery: {
    title: string;
    images: { url: string; title: string }[];
  };
  footer: {
    address: string;
    phone: string;
    agentName: string;
    renNumber: string;
    agencyName: string;
    agencyReg: string;
  };
  ctaEmbedCode: string;
  seo?: {
    title: string;
    description: string;
    keywords: string;
    googleVerification?: string;
    faviconUrl?: string;
    ogImageUrl?: string;
  };
}

export const DEFAULT_CONTENT: LandingContent = {
  projectName: "OAKA Residences @ Bukit Jalil",
  developer: "Berjaya Land Berhad",
  logoUrl: "",
  whatsappNumber: "+60195598932",
  whatsappMessage: "[oaka] Hi Admin. i interested in oaka residence. please contact me.",
  hero: {
    title: "Luxury Living with a Golf Course View",
    subtitle: "Experience the perfect blend of modern wellness and natural beauty in the heart of Bukit Jalil.",
    imageUrl: "https://picsum.photos/seed/oaka-hero/1920/1080",
  },
  overview: {
    description: "Located in the prime area of Bukit Jalil, OAKA Residences offers a well-established lifestyle surrounded by top-tier amenities. This freehold development is designed for those who value low-density living and sustainable luxury.",
    imageUrl: "https://picsum.photos/seed/oaka-overview/1200/800",
    stats: [
      { label: "Tenure", value: "Freehold" },
      { label: "Total Units", value: "350 (Low Density)" },
      { label: "Completion", value: "2028 (Est.)" },
      { label: "Land Size", value: "~2.2 Acres" },
    ],
  },
  keyFeatures: {
    title: "Why OAKA Residences?",
    items: [
      "Freehold development in a mature township",
      "Low-density living (only 350 units)",
      "Selected units with golf course views",
      "GreenRE Gold certified (sustainable living)",
      "Pet-friendly community",
      "EV charging infrastructure",
    ],
  },
  location: {
    description: "Situated in the vibrant Bukit Jalil, OAKA Residences provides unparalleled accessibility and proximity to lifestyle hubs.",
    imageUrl: "https://picsum.photos/seed/oaka-location/1200/800",
    nearby: [
      { category: "Landmarks", points: ["Pavilion Bukit Jalil", "Bukit Jalil Golf & Country Resort", "Bukit Jalil Recreational Park"] },
      { category: "Education", points: ["IMU", "APU", "International Schools"] },
    ],
    accessibility: ["Direct access to KESAS, MEX & KL-Seremban Highway", "Within ~3km to LRT stations"],
  },
  facilities: {
    title: "Facilities & Lifestyle",
    items: [
      { name: "Infinity swimming pool", icon: "Waves" },
      { name: "Sky garden & rooftop lounge", icon: "Trees" },
      { name: "Fully equipped gym & yoga studio", icon: "Dumbbell" },
      { name: "Half basketball court", icon: "Trophy" },
      { name: "Children’s playground", icon: "Gamepad2" },
      { name: "Private theatre room", icon: "Tv" },
    ],
  },
  layouts: {
    title: "Unit Layouts",
    types: [
      { type: "Type A", size: "~882 sq ft", config: "2 Bedrooms, 2 Bathrooms", imageUrl: "https://picsum.photos/seed/oaka-layout-a/800/600" },
      { type: "Type B", size: "~1,175 – 1,182 sq ft", config: "2+1 Bedrooms", imageUrl: "https://picsum.photos/seed/oaka-layout-b/800/600" },
      { type: "Type C", size: "~1,423 sq ft", config: "3 Bedrooms, 3 Bathrooms", imageUrl: "https://picsum.photos/seed/oaka-layout-c/800/600" },
    ],
  },
  gallery: {
    title: "Visual Gallery",
    images: [
      { url: "https://picsum.photos/seed/oaka-g1/1200/800", title: "Main Entrance" },
      { url: "https://picsum.photos/seed/oaka-g2/1200/800", title: "Infinity Pool" },
      { url: "https://picsum.photos/seed/oaka-g3/1200/800", title: "Sky Garden" },
      { url: "https://picsum.photos/seed/oaka-g4/1200/800", title: "Golf Course View" },
    ],
  },
  footer: {
    address: "OAKA Residences Sales Gallery, Bukit Jalil, Kuala Lumpur",
    phone: "+60195598932",
    agentName: "Yee Woei Shyan",
    renNumber: "REN 46305",
    agencyName: "IQI Holdings SDN BHD",
    agencyReg: "E(1)1584",
  },
  ctaEmbedCode: "",
  seo: {
    title: "OAKA Residences @ Bukit Jalil | Luxury Living & Golf Views",
    description: "Discover OAKA Residences in Bukit Jalil. Low-density, freehold apartments with golf course views. Register for early bird privileges and private viewings.",
    keywords: "OAKA Residences, Bukit Jalil Property, Luxury Condo KL, Berjaya Land, Freehold Condo Bukit Jalil, Real Estate Malaysia",
    googleVerification: "",
    faviconUrl: "https://picsum.photos/seed/oaka-favicon/128/128",
    ogImageUrl: "https://picsum.photos/seed/oaka-hero/1200/630",
  },
};
