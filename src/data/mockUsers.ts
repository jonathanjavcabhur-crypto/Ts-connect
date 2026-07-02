import { MockUser } from "../types";

export const MOCK_USERS: MockUser[] = [
  {
    id: "user-julian",
    name: "Julian",
    age: 28,
    pronouns: "he/him",
    online: true,
    boosted: true,
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
    additionalPhotos: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop"
    ],
    distance: 0.2,
    matchPct: 98,
    lookingFor: ["Right Now", "Chatting", "Friends"],
    bio: "Visual designer and contemporary dancer based in the city. I love expressive movement, clean layout design, and exploring new coffee shops and underground beats. Let's connect!",
    interests: ["Design", "Dance", "Music", "Coffee", "Minimalism", "Art"],
    tagline: "Designer & Dancer",
    genderIdentity: "Gay Man",
    locationName: "Inside your glow",
    badges: [
      { id: "b1", label: "Verified", type: "verified" },
      { id: "b2", label: "Top Contributor", type: "contributor" },
      { id: "b3", label: "Night Owl", type: "personality" }
    ]
  },
  {
    id: "user-1",
    name: "Maya",
    age: 26,
    pronouns: "she/her",
    online: true,
    boosted: true,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    additionalPhotos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"
    ],
    distance: 0.8,
    matchPct: 96,
    lookingFor: ["Right Now", "Chatting", "Coffee Dates"],
    bio: "Hey there! I am a software engineer and painter based in SF. Looking for some good conversation, laughter, and maybe a cozy coffee date. I love visiting modern art museums, experimenting with watercolor, and checking out local indie rock shows. Let's find our vibe!",
    interests: ["Art", "Coding", "Music", "Coffee", "Museums", "Live Shows"],
    tagline: "Looking for some good conversation and coffee.",
    genderIdentity: "Trans Woman",
    locationName: "San Francisco, CA",
    badges: [
      { id: "b4", label: "Verified", type: "verified" },
      { id: "b5", label: "Creative Vibe", type: "vibe" }
    ]
  },
  {
    id: "user-2",
    name: "Kaelen",
    age: 28,
    pronouns: "they/them",
    online: true,
    boosted: false,
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
    additionalPhotos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop"
    ],
    distance: 2.3,
    matchPct: 91,
    lookingFor: ["Chatting", "Friends", "Relationship"],
    bio: "Hi! I am a botanist, writer, and tea lover. I spend most of my weekends in the greenhouse or hiking in the redwood forests. Let's explore some local record stores, swap book recommendations, or go for a sunset hike. Very down-to-earth and love deep conversations.",
    interests: ["Plants", "Hiking", "Books", "Vinyl", "Tea", "Writing"],
    tagline: "Let's explore some record stores or go hiking.",
    genderIdentity: "Non-Binary",
    locationName: "Berkeley, CA",
    badges: [
      { id: "b6", label: "Nature Lover", type: "personality" }
    ]
  },
  {
    id: "user-3",
    name: "Leo",
    age: 25,
    pronouns: "he/him",
    online: false,
    boosted: true,
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
    additionalPhotos: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop"
    ],
    distance: 1.5,
    matchPct: 88,
    lookingFor: ["Right Now", "Hookup", "Chatting"],
    bio: "Music producer, amateur chef, and full-time dog dad. I make ambient electronic music and love cooking complex recipes from scratch. Looking for someone spontaneous to share a meal, talk about music synthesis, or hit up a midnight diner with.",
    interests: ["Music Production", "Cooking", "Dogs", "Synthesizers", "Spontaneous", "Diners"],
    tagline: "Music producer, amateur chef, full-time dog dad.",
    genderIdentity: "Trans Man",
    locationName: "Oakland, CA"
  },
  {
    id: "user-4",
    name: "Zoe",
    age: 29,
    pronouns: "she/they",
    online: true,
    boosted: false,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
    additionalPhotos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=600&auto=format&fit=crop"
    ],
    distance: 4.2,
    matchPct: 94,
    lookingFor: ["Relationship", "Coffee Dates", "Chatting"],
    bio: "Graphic designer and avid reader. I love architectural history, pottery classes, and visiting art galleries. I am looking for a warm, creative partner to share weekend trips, cozy film nights, and beautiful desserts. Let's make something amazing.",
    interests: ["Design", "Architecture", "Pottery", "Indie Films", "Travel", "Desserts"],
    tagline: "Searching for someone to share dessert and art gallery trips.",
    genderIdentity: "Genderqueer",
    locationName: "San Jose, CA"
  },
  {
    id: "user-5",
    name: "Nico",
    age: 24,
    pronouns: "they/them",
    online: true,
    boosted: false,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    additionalPhotos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"
    ],
    distance: 0.5,
    matchPct: 85,
    lookingFor: ["Friends", "Chatting", "Coffee Dates"],
    bio: "Let's grab boba and talk about obscure sci-fi books! I am a graduate student studying sociology, an activist, and a big fan of board game cafes. Always searching for community, passionate discussions, and fresh perspectives.",
    interests: ["Boba", "Sci-Fi", "Sociology", "Board Games", "Activism", "Trivia"],
    tagline: "Let's grab boba and talk about obscure sci-fi books.",
    genderIdentity: "Non-Binary",
    locationName: "San Francisco, CA"
  },
  {
    id: "user-6",
    name: "Sasha",
    age: 27,
    pronouns: "she/her",
    online: false,
    boosted: false,
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
    additionalPhotos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
    ],
    distance: 12.4,
    matchPct: 89,
    lookingFor: ["Relationship", "Friends"],
    bio: "Living life with curiosity, empathy, and a lot of loose-leaf tea. I am a veterinary nurse who loves animals of all shapes and sizes. I enjoy vintage fashion, gardening in my backyard greenhouse, and listening to old jazz records. Let's see if we match!",
    interests: ["Animals", "Vintage", "Gardening", "Jazz", "Tea", "Baking"],
    tagline: "Living life with curiosity, empathy, and a lot of tea.",
    genderIdentity: "Trans Woman",
    locationName: "Portland, OR"
  },
  {
    id: "user-7",
    name: "Felix",
    age: 31,
    pronouns: "he/they",
    online: true,
    boosted: true,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
    additionalPhotos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop"
    ],
    distance: 3.1,
    matchPct: 92,
    lookingFor: ["Relationship", "Chatting"],
    bio: "Woodworker and audio enthusiast. I run a custom furniture shop and build my own analog synthesizers. I enjoy camping trips, farmers markets on Saturday mornings, and cooking rich dinners for close friends. Looking for someone grounded and kind.",
    interests: ["Woodworking", "Audio", "Synthesizers", "Camping", "Farmers Markets", "Cooking"],
    tagline: "Woodworking, synth music, and cold brew coffee.",
    genderIdentity: "Trans Man",
    locationName: "Oakland, CA"
  },
  {
    id: "user-8",
    name: "Jordan",
    age: 23,
    pronouns: "they/them",
    online: true,
    boosted: false,
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop",
    additionalPhotos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop"
    ],
    distance: 1.1,
    matchPct: 84,
    lookingFor: ["Friends", "Hookup", "Right Now"],
    bio: "Creative coder and visual artist. I design interactive light installations and generative art. Always out and about exploring underground galleries, warehouse parties, or retro arcades. Looking for a high-energy partner in crime!",
    interests: ["Coding", "Generative Art", "Galleries", "Nightlife", "Arcades", "Light Design"],
    tagline: "Creative coder looking for gallery dates.",
    genderIdentity: "Non-Binary",
    locationName: "San Francisco, CA"
  },
  {
    id: "user-9",
    name: "Chloe",
    age: 30,
    pronouns: "she/her",
    online: false,
    boosted: false,
    photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=600&auto=format&fit=crop",
    additionalPhotos: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=600&auto=format&fit=crop"
    ],
    distance: 8.5,
    matchPct: 90,
    lookingFor: ["Relationship", "Coffee Dates"],
    bio: "UX designer, plant enthusiast, and morning runner. I love clean lines, minimal aesthetics, and waking up early to run along the coastline. Let's grab coffee, wander around a plant nursery, or trade sketches. Looking for a genuine connection.",
    interests: ["UX Design", "Plants", "Running", "Sketching", "Coffee", "Minimalism"],
    tagline: "Designer, beach runner, plant enthusiast.",
    genderIdentity: "Trans Woman",
    locationName: "Los Angeles, CA"
  },
  {
    id: "user-10",
    name: "Avery",
    age: 25,
    pronouns: "they/them",
    online: true,
    boosted: false,
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
    additionalPhotos: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop"
    ],
    distance: 5.6,
    matchPct: 87,
    lookingFor: ["Friends", "Chatting", "Right Now"],
    bio: "Indie game developer and avid thrifter! I spend my free time browsing antique shops, playing retro pixel art RPGs, and sketching character concepts in cozy tea shops. Let's geek out together!",
    interests: ["Gaming", "Thrifting", "Pixel Art", "RPG", "Sketching", "Cozy Cafes"],
    tagline: "Indie games, thrift shopping, and cozy cafes.",
    genderIdentity: "Genderqueer",
    locationName: "Seattle, WA"
  },
  {
    id: "user-11",
    name: "Rylan",
    age: 27,
    pronouns: "he/him",
    online: true,
    boosted: true,
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
    additionalPhotos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop"
    ],
    distance: 1.9,
    matchPct: 93,
    lookingFor: ["Relationship", "Friends"],
    bio: "Personal trainer and history buff. Love weight training, hiking steep mountain trails, and reading thick biographies of historical figures. Looking for someone driven, conversational, and active who wants to explore both the gym and the wilderness.",
    interests: ["Fitness", "History", "Biographies", "Hiking", "Weightlifting", "Outdoors"],
    tagline: "Fitness, outdoors, and reading history.",
    genderIdentity: "Trans Man",
    locationName: "San Francisco, CA"
  },
  {
    id: "user-12",
    name: "Jade",
    age: 26,
    pronouns: "she/her",
    online: false,
    boosted: false,
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop",
    additionalPhotos: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop"
    ],
    distance: 3.8,
    matchPct: 95,
    lookingFor: ["Hookup", "Right Now", "Chatting"],
    bio: "Dancer, choreographer, and nightlife enthusiast! I love expressive movement, high fashion, and deep electronic beats. I live loud, authentic, and proud. Looking for a companion who is confident, playful, and loves the dancefloor.",
    interests: ["Dance", "Fashion", "Nightlife", "Clubbing", "Choreography", "Playful"],
    tagline: "Dance like no one is watching, but hope someone is!",
    genderIdentity: "Trans Woman",
    locationName: "Walnut Creek, CA"
  }
];
