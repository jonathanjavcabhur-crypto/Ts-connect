export interface UserTheme {
  id: string;
  name: string;
  headerBg: string;
  primary: string;
  primaryHover: string;
  brandText: string;
  background: string;
  cardBg: string;
  filterActive: string;
  filterInactive: string;
  filterActiveBorder: string;
  filterInactiveBorder: string;
  onlineDotColor: string;
  textMuted: string;
  textPrimary: string;
  accent: string;
  accentBg: string;
}

export interface Badge {
  id: string;
  label: string;
  type: "verified" | "contributor" | "personality" | "vibe";
}

export interface MockUser {
  id: string;
  name: string;
  age: number;
  pronouns: string;
  online: boolean;
  boosted: boolean;
  photo: string;
  additionalPhotos?: string[];
  distance: number; // in km
  matchPct: number;
  lookingFor: string[];
  bio: string;
  interests: string[];
  tagline: string;
  genderIdentity: string;
  locationName: string;
  badges?: Badge[];
  vibeClips?: string[];
  recentVisitors?: { name: string; photo: string; time: string; isNew?: boolean }[];
}

export interface Message {
  id: string;
  sender: "user" | "profile";
  text: string;
  timestamp: string;
}

export interface FilterState {
  ageMin: number;
  ageMax: number;
  distanceMax: number; // in km
  gender: string; // "All" | "Trans Woman" | "Trans Man" | "Non-Binary" | "Queer"
  lookingFor: string[]; // e.g., ["Chatting", "Relationship", "Right Now", "Hookup"]
}
