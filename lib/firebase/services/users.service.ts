import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  limit,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../config";
import type {
  User,
  Seeker,
  CreateSeekerDTO,
  UpdateUserDTO,
  ServiceCategory,
} from "../types";

const USERS_COLLECTION = "users";

/**
 * Cria um novo usuário (buscador de serviços)
 */
export async function createUser(data: CreateSeekerDTO): Promise<Seeker> {
  const now = Timestamp.now();
  
  const userData = {
    ...data,
    favorites: [],
    searchHistory: [],
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, USERS_COLLECTION), userData);
  
  return {
    id: docRef.id,
    ...userData,
  } as Seeker;
}

/**
 * Busca um usuário por ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const docRef = doc(db, USERS_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as User;
}

/**
 * Busca um usuário por UID do Firebase Auth
 */
export async function getUserByUid(uid: string): Promise<User | null> {
  const q = query(
    collection(db, USERS_COLLECTION),
    where("uid", "==", uid),
    limit(1)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as User;
}

/**
 * Atualiza um usuário
 */
export async function updateUser(
  userId: string,
  data: UpdateUserDTO
): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, userId);
  
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Adiciona um trabalhador aos favoritos
 */
export async function addToFavorites(
  userId: string,
  workerId: string
): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, userId);
  
  await updateDoc(docRef, {
    favorites: arrayUnion(workerId),
    updatedAt: Timestamp.now(),
  });
}

/**
 * Remove um trabalhador dos favoritos
 */
export async function removeFromFavorites(
  userId: string,
  workerId: string
): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, userId);
  
  await updateDoc(docRef, {
    favorites: arrayRemove(workerId),
    updatedAt: Timestamp.now(),
  });
}

/**
 * Adiciona uma busca ao histórico
 */
export async function addSearchToHistory(
  userId: string,
  category: ServiceCategory,
  cep: string
): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, userId);
  
  const searchEntry = {
    category,
    cep,
    timestamp: Timestamp.now(),
  };
  
  await updateDoc(docRef, {
    searchHistory: arrayUnion(searchEntry),
    updatedAt: Timestamp.now(),
  });
}

/**
 * Busca os favoritos do usuário
 */
export async function getUserFavorites(userId: string): Promise<string[]> {
  const user = await getUserById(userId);
  
  if (!user || user.userType !== "seeker") {
    return [];
  }

  return (user as Seeker).favorites || [];
}

/**
 * Busca o histórico de pesquisas do usuário
 */
export async function getUserSearchHistory(userId: string) {
  const user = await getUserById(userId);
  
  if (!user || user.userType !== "seeker") {
    return [];
  }

  return (user as Seeker).searchHistory || [];
}

/**
 * Verifica se um usuário existe por email
 */
export async function checkUserExistsByEmail(email: string): Promise<boolean> {
  const q = query(
    collection(db, USERS_COLLECTION),
    where("email", "==", email),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

