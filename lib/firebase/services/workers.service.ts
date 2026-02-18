import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "../config";
import type {
  Worker,
  CreateWorkerDTO,
  UpdateWorkerDTO,
  WorkerSearchFilters,
  PaginatedResponse,
} from "../types";

const WORKERS_COLLECTION = "workers";

/**
 * Cria um novo trabalhador
 */
export async function createWorker(data: CreateWorkerDTO): Promise<Worker> {
  const now = Timestamp.now();
  
  const workerData = {
    ...data,
    status: "pending" as const,
    verified: false,
    available: true,
    rating: 0,
    reviewCount: 0,
    stats: {
      views: 0,
      contacts: 0,
      hires: 0,
    },
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, WORKERS_COLLECTION), workerData);
  
  return {
    id: docRef.id,
    ...workerData,
  } as Worker;
}

/**
 * Busca um trabalhador por ID
 */
export async function getWorkerById(workerId: string): Promise<Worker | null> {
  const docRef = doc(db, WORKERS_COLLECTION, workerId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Worker;
}

/**
 * Busca um trabalhador por UID do Firebase Auth
 */
export async function getWorkerByUid(uid: string): Promise<Worker | null> {
  const q = query(
    collection(db, WORKERS_COLLECTION),
    where("uid", "==", uid),
    limit(1)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  } as Worker;
}

/**
 * Atualiza um trabalhador
 */
export async function updateWorker(
  workerId: string,
  data: UpdateWorkerDTO
): Promise<void> {
  const docRef = doc(db, WORKERS_COLLECTION, workerId);
  
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Busca trabalhadores com filtros
 */
export async function searchWorkers(
  filters: WorkerSearchFilters = {},
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Worker>> {
  const constraints: QueryConstraint[] = [];

  // Filtro de categoria
  if (filters.category) {
    constraints.push(where("category", "==", filters.category));
  }

  // Filtro de serviços
  if (filters.services && filters.services.length > 0) {
    constraints.push(where("services", "array-contains-any", filters.services));
  }

  // Filtro de cidade
  if (filters.city) {
    constraints.push(where("location.city", "==", filters.city));
  }

  // Filtro de estado
  if (filters.state) {
    constraints.push(where("location.state", "==", filters.state));
  }

  // Filtro de disponibilidade
  if (filters.availableOnly) {
    constraints.push(where("available", "==", true));
  }

  // Filtro de verificado
  if (filters.verifiedOnly) {
    constraints.push(where("verified", "==", true));
  }

  // Filtro de rating mínimo
  if (filters.minRating) {
    constraints.push(where("rating", ">=", filters.minRating));
  }

  // Apenas trabalhadores aprovados
  constraints.push(where("status", "==", "approved"));

  // Ordenação por rating
  constraints.push(orderBy("rating", "desc"));
  constraints.push(orderBy("reviewCount", "desc"));

  // Paginação
  constraints.push(limit(pageSize));

  const q = query(collection(db, WORKERS_COLLECTION), ...constraints);
  const querySnapshot = await getDocs(q);

  const workers: Worker[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Worker[];

  return {
    data: workers,
    total: workers.length,
    page,
    pageSize,
    hasMore: workers.length === pageSize,
  };
}

/**
 * Busca trabalhadores próximos (por CEP/cidade)
 * Nota: Query simplificada para não requerer índice composto
 */
export async function getNearbyWorkers(
  city: string,
  state: string,
  category?: string,
  limitCount: number = 10
): Promise<Worker[]> {
  const constraints: QueryConstraint[] = [
    where("location.city", "==", city),
    where("status", "==", "approved"),
  ];

  if (category) {
    constraints.push(where("category", "==", category));
  }

  const q = query(
    collection(db, WORKERS_COLLECTION),
    ...constraints,
    limit(limitCount * 2)
  );

  const querySnapshot = await getDocs(q);
  
  // Filtra e ordena no código
  const workers = querySnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Worker[];

  return workers
    .filter(w => w.location.state === state && w.available)
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.reviewCount - a.reviewCount;
    })
    .slice(0, limitCount);
}

/**
 * Incrementa visualizações
 */
export async function incrementViews(workerId: string): Promise<void> {
  const docRef = doc(db, WORKERS_COLLECTION, workerId);
  const workerDoc = await getDoc(docRef);
  
  if (workerDoc.exists()) {
    const currentStats = workerDoc.data().stats || { views: 0, contacts: 0, hires: 0 };
    await updateDoc(docRef, {
      "stats.views": currentStats.views + 1,
      updatedAt: Timestamp.now(),
    });
  }
}

/**
 * Incrementa contatos
 */
export async function incrementContacts(workerId: string): Promise<void> {
  const docRef = doc(db, WORKERS_COLLECTION, workerId);
  const workerDoc = await getDoc(docRef);
  
  if (workerDoc.exists()) {
    const currentStats = workerDoc.data().stats || { views: 0, contacts: 0, hires: 0 };
    await updateDoc(docRef, {
      "stats.contacts": currentStats.contacts + 1,
      updatedAt: Timestamp.now(),
    });
  }
}

/**
 * Atualiza status do trabalhador
 */
export async function updateWorkerStatus(
  workerId: string,
  status: "approved" | "rejected" | "suspended"
): Promise<void> {
  const docRef = doc(db, WORKERS_COLLECTION, workerId);
  
  await updateDoc(docRef, {
    status,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Busca trabalhadores em destaque (melhor avaliados)
 * Nota: Query simplificada para não requerer índice composto
 */
export async function getFeaturedWorkers(limitCount: number = 6): Promise<Worker[]> {
  const q = query(
    collection(db, WORKERS_COLLECTION),
    where("status", "==", "approved"),
    where("verified", "==", true),
    limit(limitCount * 2) // Pega mais para filtrar depois
  );

  const querySnapshot = await getDocs(q);
  
  // Filtra e ordena no código
  const workers = querySnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Worker[];
  
  return workers
    .filter(w => w.available)
    .sort((a, b) => {
      // Ordena por rating desc, depois reviewCount desc
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.reviewCount - a.reviewCount;
    })
    .slice(0, limitCount);
}

