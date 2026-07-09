import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { MockUser } from "../types";

export interface UserProfile extends Omit<MockUser, "id"> {
  uid: string;
  premium?: boolean;
}

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop"
];

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function getGlobalIntroVideo(): Promise<string | null> {
  try {
    const configRef = doc(db, "config", "intro_video");
    const configSnap = await getDoc(configRef);
    if (configSnap.exists()) {
      return configSnap.data().url || null;
    }
  } catch (error) {
    console.warn("Could not load global intro video from Firestore (using local fallback):", error);
  }
  return null;
}

export async function setGlobalIntroVideo(url: string): Promise<void> {
  try {
    const configRef = doc(db, "config", "intro_video");
    await setDoc(configRef, { url }, { merge: true });
  } catch (error) {
    console.warn("Could not save global intro video to Firestore (saved locally):", error);
  }
}

export async function createUserProfile(
  uid: string,
  email: string,
  profile: {
    name: string;
    age: number;
    pronouns: string;
    genderIdentity: string;
    locationName: string;
  }
) {
  const randomAvatar = DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
  
  const userProfile: UserProfile = {
    uid,
    name: profile.name,
    age: Number(profile.age) || 18,
    pronouns: profile.pronouns || "they/them",
    online: true,
    boosted: false,
    photo: randomAvatar,
    additionalPhotos: [randomAvatar],
    distance: 1.2,
    matchPct: 95,
    lookingFor: ["Chatting", "Friends"],
    bio: "¡Hola! Acabo de unirme a la comunidad de TS Connect para conectar de manera auténtica.",
    interests: ["Café", "Música", "Arte", "Conversaciones"],
    tagline: "Buscando conexiones genuinas",
    genderIdentity: profile.genderIdentity || "Non-Binary",
    locationName: profile.locationName || "España",
    badges: [{ id: "b-new", label: "Nuevo Miembro", type: "vibe" }]
  };

  const path = `users/${uid}`;
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, userProfile);
    return userProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
  } catch (error) {
    console.warn(`Could not retrieve user profile for ${uid} from Firestore (using offline/local fallback):`, error);
  }
  return null;
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>) {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function setUserPremiumStatus(uid: string, premium: boolean) {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { premium });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export interface ModelAd {
  id: string;
  name: string;
  photoUrl: string;
  description: string;
  contactUrl: string;
  vibeTag: string;
}

export const DEFAULT_MODEL_ADS: ModelAd[] = [
  {
    id: "model-1",
    name: "Sofía Rivera",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
    description: "Modelo trans internacional de alta costura, buscando patrocinios para la Fashion Week de Madrid. ¡Únete a su campaña de patrocinio!",
    contactUrl: "https://instagram.com",
    vibeTag: "Alta Costura"
  },
  {
    id: "model-2",
    name: "Elena Rostova",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600",
    description: "Creadora de contenido digital y modelo de pasarela alternativa. Disponible para colaboraciones artísticas y fotografía urbana.",
    contactUrl: "https://instagram.com",
    vibeTag: "Alternativo"
  },
  {
    id: "model-3",
    name: "Valentina Silva",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
    description: "Estrella de redes sociales y defensora de la cosmética vegana libre de crueldad animal. Patrocinada por marcas de primer nivel.",
    contactUrl: "https://instagram.com",
    vibeTag: "Glamour"
  }
];

export async function getModelAds(): Promise<ModelAd[]> {
  try {
    const configRef = doc(db, "config", "model_ads");
    const docSnap = await getDoc(configRef);
    if (docSnap.exists() && docSnap.data().ads) {
      return docSnap.data().ads as ModelAd[];
    }
  } catch (error) {
    console.warn("Could not retrieve model ads from Firestore (using default model fallback):", error);
  }
  return DEFAULT_MODEL_ADS;
}

export async function saveModelAds(ads: ModelAd[]): Promise<void> {
  try {
    const configRef = doc(db, "config", "model_ads");
    await setDoc(configRef, { ads }, { merge: true });
  } catch (error) {
    console.error("Could not save model ads to Firestore:", error);
  }
}

