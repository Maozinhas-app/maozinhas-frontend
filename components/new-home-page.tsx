"use client";

import { useState } from "react";
import {
  HomeIcon,
  HeartIcon,
  BookOpenIcon,
  ScissorsIcon,
  BriefcaseIcon,
  DumbbellIcon,
  PawPrintIcon,
  SearchIcon,
  UserIcon,
  GlobeIcon,
  SprayCanIcon,
  WrenchIcon,
  ZapIcon,
  DropletIcon,
  HomeIcon as HouseIcon,
  PackageIcon,
  HammerIcon,
  FlowerIcon,
  KeyIcon,
  ThermometerIcon,
} from "lucide-react";

type MainCategory = "casa" | "aulas" | "esportes" | "outros" | "cuidados" | "beleza" | "pets";

interface SubCategory {
  id: string;
  label: string;
  icon: any;
}

const subCategories: Record<MainCategory, SubCategory[]> = {
  casa: [
    { id: "limpeza", label: "Limpeza", icon: SprayCanIcon },
    { id: "passar-roupa", label: "Passar Roupa", icon: HouseIcon },
    { id: "faz-tudo", label: "Faz-Tudo", icon: WrenchIcon },
    { id: "mudanca", label: "Mudança e Transporte", icon: PackageIcon },
    { id: "encanador", label: "Encanador", icon: DropletIcon },
    { id: "pintor", label: "Pintor", icon: SprayCanIcon },
    { id: "eletricista", label: "Eletricista", icon: ZapIcon },
    { id: "eletrodomesticos", label: "Eletrodomésticos", icon: PackageIcon },
    { id: "reformas", label: "Pequenas Reformas", icon: HammerIcon },
    { id: "jardinagem", label: "Jardinagem", icon: FlowerIcon },
    { id: "chaveiro", label: "Chaveiro", icon: KeyIcon },
    { id: "climatizacao", label: "Climatização", icon: ThermometerIcon },
  ],
  aulas: [],
  esportes: [],
  outros: [],
  cuidados: [],
  beleza: [],
  pets: [],
};

interface NewHomePageProps {
  searchTerm?: string;
  initialCategory?: MainCategory;
}

export function NewHomePage({ searchTerm, initialCategory = "casa" }: NewHomePageProps) {
  const [activeCategory, setActiveCategory] = useState<MainCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(searchTerm || "");
  const [addressQuery, setAddressQuery] = useState("");

  const mainCategories = [
    { id: "casa" as MainCategory, icon: HomeIcon, label: "Casa" },
    { id: "aulas" as MainCategory, icon: BookOpenIcon, label: "Aulas" },
    { id: "esportes" as MainCategory, icon: DumbbellIcon, label: "Esportes" },
    { id: "outros" as MainCategory, icon: BriefcaseIcon, label: "Outros" },
    { id: "cuidados" as MainCategory, icon: HeartIcon, label: "Cuidados" },
    { id: "beleza" as MainCategory, icon: ScissorsIcon, label: "Beleza" },
    { id: "pets" as MainCategory, icon: PawPrintIcon, label: "Pets" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5eb3b3] to-[#4a9d9d]">
      {/* Header */}
      <header className="bg-[#4a9d9d] border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <svg
                width="40"
                height="40"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 14C28 14 25 17 25 21C25 24 27 26 29 27L24 38C23 40 24 42 26 43H38C40 42 41 40 40 38L35 27C37 26 39 24 39 21C39 17 36 14 32 14Z"
                  fill="white"
                />
                <circle cx="22" cy="28" r="4" fill="white" fillOpacity="0.9" />
                <circle cx="42" cy="28" r="4" fill="white" fillOpacity="0.9" />
              </svg>
              <h1 className="text-2xl font-bold text-white">mãozinhas</h1>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2 flex-1 max-w-2xl mx-8">
              <div className="flex-1 bg-white rounded-full px-6 py-3 flex items-center">
                <input
                  type="text"
                  placeholder="Serviço"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-700"
                />
              </div>
              <div className="flex-1 bg-white rounded-full px-6 py-3 flex items-center">
                <input
                  type="text"
                  placeholder="Endereço"
                  value={addressQuery}
                  onChange={(e) => setAddressQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-700"
                />
              </div>
              <button className="bg-[#3d8585] hover:bg-[#357373] text-white font-semibold px-8 py-3 rounded-full transition-colors">
                Buscar
              </button>
            </div>

            {/* Right Menu */}
            <div className="flex items-center gap-6">
              <button className="text-white hover:text-white/80 transition-colors font-medium">
                Oferecer serviços
              </button>
              <button className="text-white hover:text-white/80 transition-colors">
                <GlobeIcon className="w-6 h-6" />
              </button>
              <button className="bg-white text-[#4a9d9d] px-6 py-2 rounded-full flex items-center gap-2 hover:bg-white/90 transition-colors">
                <UserIcon className="w-5 h-5" />
                <span className="font-medium">Acessar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              {mainCategories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                      isActive
                        ? "bg-white text-[#4a9d9d]"
                        : "bg-[#3d8585] text-white hover:bg-[#357373]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#5eb3b3]/60 via-[#5eb3b3]/40 to-[#5eb3b3]/90"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-6xl font-bold mb-6 animate-fade-in-up drop-shadow-lg">
            Torne sua vida mais fácil
          </h2>
          <p className="text-2xl animate-fade-in-up drop-shadow-md" style={{ animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}>
            Aproveite qualquer serviço, no conforto da sua casa
          </p>
        </div>
      </section>

      {/* Subcategories Section */}
      {subCategories[activeCategory]?.length > 0 && (
        <section className="bg-white/95 backdrop-blur-sm py-12">
          <div className="container mx-auto px-6">
            <h3 className="text-3xl font-bold text-[#4a9d9d] mb-8">
              Serviços de {mainCategories.find(c => c.id === activeCategory)?.label}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {subCategories[activeCategory].map((sub, index) => {
                const SubIcon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all animate-fade-in-up"
                    style={{ 
                      animationDelay: `${index * 0.05}s`, 
                      opacity: 0, 
                      animationFillMode: "forwards" 
                    }}
                  >
                    <div className="w-16 h-16 bg-[#5eb3b3]/10 rounded-full flex items-center justify-center">
                      <SubIcon className="w-8 h-8 text-[#5eb3b3]" />
                    </div>
                    <span className="text-gray-700 font-medium text-center text-sm">
                      {sub.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#4a9d9d] border-t border-white/10 py-8 mt-12">
        <div className="container mx-auto px-6 text-center text-white">
          <p className="text-sm opacity-80">
            © 2026 Mãozinhas. Conectando você aos melhores profissionais da sua região.
          </p>
        </div>
      </footer>
    </div>
  );
}

