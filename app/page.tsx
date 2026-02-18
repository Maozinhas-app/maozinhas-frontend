"use client";

import { useState } from "react";
import { NewOnboarding } from "@/components/new-onboarding";
import { NewHomePage } from "@/components/new-home-page";
import { ProviderSuccess } from "@/components/provider-success";

type UserType = "seeker" | "provider" | null;
type AppState = "onboarding" | "home" | "provider-success" | "provider-dashboard";
type Category = "casa" | "cuidados" | "aulas" | "beleza" | "outros" | "esportes" | "pets";

interface SeekerData {
  cep: string;
  category: Category;
}

interface ProviderData {
  companyName: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  services: string;
}

export default function Page() {
  const [appState, setAppState] = useState<AppState>("onboarding");
  const [, setUserType] = useState<UserType>(null);
  const [seekerData, setSeekerData] = useState<SeekerData | null>(null);
  const [providerData, setProviderData] = useState<ProviderData | null>(null);

  const handleSearch = (category: Category, cep: string) => {
    setSeekerData({ category, cep });
    setUserType("seeker");
      setAppState("home");
  };

  const handleProviderContinue = () => {
    setAppState("provider-dashboard");
  };

  // Render based on app state
  if (appState === "onboarding") {
    return <NewOnboarding onSearch={handleSearch} />;
  }

  if (appState === "home") {
    return <NewHomePage initialCategory={seekerData?.category} />;
  }

  if (appState === "provider-success" && providerData) {
    return (
      <ProviderSuccess
        data={{ companyName: providerData.companyName, services: providerData.services }}
        onContinue={handleProviderContinue}
      />
    );
  }

  if (appState === "provider-dashboard") {
    // Simplified dashboard view
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Painel do Prestador</h1>
              <p className="text-muted-foreground">Bem-vindo, {providerData?.companyName}!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <p className="text-5xl font-bold text-primary mb-2">0</p>
                <p className="text-muted-foreground">Visualizações</p>
              </div>
            </div>
            <div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <p className="text-5xl font-bold text-accent mb-2">0</p>
                <p className="text-muted-foreground">Contatos</p>
              </div>
            </div>
            <div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <p className="text-5xl font-bold text-foreground mb-2">0</p>
                <p className="text-muted-foreground">Avaliações</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mt-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Seus Serviços</h3>
            <p className="text-muted-foreground">{providerData?.services}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mt-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Seu Endereço</h3>
            <p className="text-muted-foreground">
              {providerData?.street && `${providerData.street}, ${providerData.number}`}
              {providerData?.neighborhood && ` - ${providerData.neighborhood}`}
              <br />
              {providerData?.city && `${providerData.city}`}
              {providerData?.state && ` - ${providerData.state}`}
              {providerData?.cep && ` | CEP: ${providerData.cep}`}
            </p>
          </div>

          <div className="mt-8 bg-primary/10 border border-primary/20 rounded-lg p-6">
            <p className="text-foreground">
              <strong>Seu perfil está em análise.</strong> Em breve você começará a receber contatos de clientes interessados!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
