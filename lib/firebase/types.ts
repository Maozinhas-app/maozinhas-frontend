import { Timestamp } from "firebase/firestore";

// Tipos de usuário
export type UserType = "seeker" | "worker";

// Status do trabalhador
export type WorkerStatus = "pending" | "approved" | "rejected" | "suspended";

// Categorias de serviço
export type ServiceCategory = 
  | "casa" 
  | "cuidados" 
  | "aulas" 
  | "beleza" 
  | "outros" 
  | "esportes" 
  | "pets";

export type SubCategory = 
  | "limpeza"
  | "passar-roupa"
  | "faz-tudo"
  | "mudanca"
  | "encanador"
  | "pintor"
  | "eletricista"
  | "eletrodomesticos"
  | "reformas"
  | "jardinagem"
  | "chaveiro"
  | "climatizacao";

// Interface de localização
export interface Location {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Interface de avaliação
export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

// Interface de disponibilidade
export interface Availability {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  startTime?: string; // "08:00"
  endTime?: string;   // "18:00"
}

// Interface base de usuário
export interface User {
  id: string;
  uid: string; // Firebase Auth UID
  email: string;
  name: string;
  phone?: string;
  photoURL?: string;
  userType: UserType;
  location?: Location;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Interface de trabalhador (prestador de serviço)
export interface Worker extends User {
  userType: "worker";
  companyName?: string;
  cpfCnpj?: string;
  description: string;
  services: SubCategory[];
  category: ServiceCategory;
  status: WorkerStatus;
  verified: boolean;
  available: boolean;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  priceRange?: {
    min: number;
    max: number;
    unit: "hora" | "servico" | "dia";
  };
  availability?: Availability;
  portfolio?: string[]; // URLs de imagens
  documents?: {
    id?: string;
    selfie?: string;
    certificate?: string;
  };
  stats?: {
    views: number;
    contacts: number;
    hires: number;
  };
}

// Interface de buscador (usuário comum)
export interface Seeker extends User {
  userType: "seeker";
  favorites?: string[]; // IDs de workers favoritos
  searchHistory?: {
    category: ServiceCategory;
    cep: string;
    timestamp: Timestamp;
  }[];
}

// DTOs para criação
export interface CreateUserDTO {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  photoURL?: string;
  userType: UserType;
  location?: Location;
}

export interface CreateWorkerDTO extends CreateUserDTO {
  userType: "worker";
  companyName?: string;
  cpfCnpj?: string;
  description: string;
  services: SubCategory[];
  category: ServiceCategory;
  priceRange?: Worker["priceRange"];
  availability?: Availability;
}

export interface CreateSeekerDTO extends CreateUserDTO {
  userType: "seeker";
}

// DTOs para atualização
export interface UpdateUserDTO {
  name?: string;
  phone?: string;
  photoURL?: string;
  location?: Location;
}

export interface UpdateWorkerDTO extends UpdateUserDTO {
  companyName?: string;
  description?: string;
  services?: SubCategory[];
  category?: ServiceCategory;
  available?: boolean;
  priceRange?: Worker["priceRange"];
  availability?: Availability;
  portfolio?: string[];
}

// Filtros de busca
export interface WorkerSearchFilters {
  category?: ServiceCategory;
  services?: SubCategory[];
  city?: string;
  state?: string;
  minRating?: number;
  availableOnly?: boolean;
  verifiedOnly?: boolean;
  maxDistance?: number; // em km
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Resposta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

