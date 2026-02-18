"use client";

import { useState } from "react";
import { Logo } from "./logo";
import {
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  MessageCircleIcon,
  SearchIcon,
  FilterIcon,
  UserIcon,
  HeartIcon,
  ClockIcon,
  CheckCircleIcon,
} from "lucide-react";

interface Service {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  price: string;
  description: string;
  verified: boolean;
  available: boolean;
  image: string;
}

const mockServices: Service[] = [
  {
    id: 1,
    name: "João Silva Pinturas",
    category: "Pintor",
    rating: 4.9,
    reviews: 127,
    distance: "1.2 km",
    price: "A partir de R$ 150/dia",
    description: "Pintura residencial e comercial, texturização, grafiato e acabamentos especiais.",
    verified: true,
    available: true,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Maria Eletricista",
    category: "Eletricista",
    rating: 4.8,
    reviews: 89,
    distance: "2.5 km",
    price: "A partir de R$ 120/serviço",
    description: "Instalações elétricas, reparos, troca de fiação e montagem de quadros.",
    verified: true,
    available: true,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Carlos Encanador",
    category: "Encanador",
    rating: 4.7,
    reviews: 156,
    distance: "0.8 km",
    price: "A partir de R$ 100/serviço",
    description: "Desentupimento, vazamentos, instalação de torneiras e chuveiros.",
    verified: true,
    available: false,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Ana Marcenaria",
    category: "Marceneiro",
    rating: 5.0,
    reviews: 64,
    distance: "3.1 km",
    price: "Sob orçamento",
    description: "Móveis planejados, reparos em móveis e instalação de portas.",
    verified: false,
    available: true,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    name: "Pedro Reformas",
    category: "Pedreiro",
    rating: 4.6,
    reviews: 203,
    distance: "1.8 km",
    price: "A partir de R$ 200/dia",
    description: "Reformas completas, construção civil, acabamentos e alvenaria.",
    verified: true,
    available: true,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 6,
    name: "Limpeza Express",
    category: "Limpeza",
    rating: 4.9,
    reviews: 312,
    distance: "0.5 km",
    price: "A partir de R$ 180/faxina",
    description: "Limpeza residencial, pós-obra, comercial e higienização de estofados.",
    verified: true,
    available: true,
    image: "/placeholder.svg?height=80&width=80",
  },
];

export function HomePage({ searchTerm }: { searchTerm?: string }) {
  const [search, setSearch] = useState(searchTerm || "");
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="Perfil">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-card border-b border-border py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
                <input
                  type="text"
                className="flex-1 px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Buscar serviços..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center">
                  <SearchIcon className="w-5 h-5" />
                </button>
            </div>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button className="px-4 py-2 rounded-full bg-secondary text-foreground text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors flex items-center">
                <FilterIcon className="w-4 h-4 mr-1" />
                Filtros
              </button>
              <button className="px-4 py-2 rounded-full bg-secondary text-foreground text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors">
                Mais próximos
              </button>
              <button className="px-4 py-2 rounded-full bg-secondary text-foreground text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors">
                Melhor avaliados
              </button>
              <button className="px-4 py-2 rounded-full bg-secondary text-foreground text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors">
                Disponíveis agora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {mockServices.length} serviços encontrados perto de você
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockServices.map((service, index) => (
            <div
              key={service.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s`, opacity: 0, animationFillMode: "forwards" }}
            >
              <div className="bg-card border border-border rounded-lg p-6 service-card h-full">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      className="w-16 h-16 rounded-full object-cover bg-secondary"
                    />
                    {service.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground truncate">{service.name}</h3>
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mt-1">
                          {service.category}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleFavorite(service.id)}
                        className="p-1 hover:scale-110 transition-transform"
                        aria-label={favorites.includes(service.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        <HeartIcon
                          className={`w-5 h-5 ${
                            favorites.includes(service.id)
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 fill-accent text-accent" />
                        <span className="ml-1 text-sm font-medium text-foreground">{service.rating}</span>
                      </div>
                      <span className="text-muted-foreground text-sm">({service.reviews} avaliações)</span>
                    </div>

                    {/* Distance & Availability */}
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {service.distance}
                      </span>
                      <span className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {service.available ? (
                          <span className="text-primary">Disponível</span>
                        ) : (
                          <span className="text-destructive">Indisponível</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                  {service.description}
                </p>

                {/* Price */}
                <p className="text-sm font-semibold text-primary mt-3">{service.price}</p>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center text-sm font-medium">
                    <MessageCircleIcon className="w-4 h-4 mr-1" />
                    Contato
                  </button>
                  <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center">
                    <PhoneIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <Logo size="sm" />
          <p className="text-muted-foreground text-sm mt-4">
            Conectando você aos melhores profissionais da sua região.
          </p>
          <p className="text-muted-foreground text-xs mt-4">
            © 2026 Mãozinhas. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
