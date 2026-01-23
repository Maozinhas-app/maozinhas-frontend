"use client";

import { useState } from "react";
import { Onboarding } from "@/components/onboarding";
import { HomePage } from "@/components/home-page";
import { ProviderSuccess } from "@/components/provider-success";

type UserType = "seeker" | "provider" | null;
type AppState = "onboarding" | "home" | "provider-success" | "provider-dashboard";

interface SeekerData {
  cep: string;
  service: string;
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

  const handleOnboardingComplete = (type: UserType, data?: SeekerData | ProviderData) => {
    setUserType(type);
    
    if (type === "seeker" && data) {
      setSeekerData(data as SeekerData);
      setAppState("home");
    } else if (type === "provider" && data) {
      setProviderData(data as ProviderData);
      setAppState("provider-success");
    }
  };

  const handleProviderContinue = () => {
    setAppState("provider-dashboard");
  };

  // Render based on app state
  if (appState === "onboarding") {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (appState === "home") {
    return <HomePage searchTerm={seekerData?.service} />;
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
              <h1 className="title is-3 text-foreground mb-2">Painel do Prestador</h1>
              <p className="text-muted-foreground">Bem-vindo, {providerData?.companyName}!</p>
            </div>
          </div>

          <div className="columns is-multiline">
            <div className="column is-4">
              <div className="box text-center">
                <p className="title is-1 text-primary mb-2">0</p>
                <p className="text-muted-foreground">Visualizações</p>
              </div>
            </div>
            <div className="column is-4">
              <div className="box text-center">
                <p className="title is-1 text-accent mb-2">0</p>
                <p className="text-muted-foreground">Contatos</p>
              </div>
            </div>
            <div className="column is-4">
              <div className="box text-center">
                <p className="title is-1 text-foreground mb-2">0</p>
                <p className="text-muted-foreground">Avaliações</p>
              </div>
            </div>
          </div>

          <div className="box mt-6">
            <h3 className="title is-5 text-foreground mb-4">Seus Serviços</h3>
            <p className="text-muted-foreground">{providerData?.services}</p>
          </div>

          <div className="box mt-6">
            <h3 className="title is-5 text-foreground mb-4">Seu Endereço</h3>
            <p className="text-muted-foreground">
              {providerData?.street && `${providerData.street}, ${providerData.number}`}
              {providerData?.neighborhood && ` - ${providerData.neighborhood}`}
              <br />
              {providerData?.city && `${providerData.city}`}
              {providerData?.state && ` - ${providerData.state}`}
              {providerData?.cep && ` | CEP: ${providerData.cep}`}
            </p>
          </div>

          <div className="notification mt-8 bg-primary/10 border border-primary/20">
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
