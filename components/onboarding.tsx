"use client";

import React from "react"

import { useState } from "react";
import { Logo } from "./logo";
import { SearchIcon, BriefcaseIcon, MapPinIcon, ArrowRightIcon, ArrowLeftIcon, CheckIcon, BuildingIcon, WrenchIcon } from "lucide-react";

type UserType = "seeker" | "provider" | null;
type Step = "choice" | "seeker-form" | "provider-form";

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

export function Onboarding({ onComplete }: { onComplete: (type: UserType, data?: SeekerData | ProviderData) => void }) {
  const [step, setStep] = useState<Step>("choice");
  const [userType, setUserType] = useState<UserType>(null);
  const [seekerData, setSeekerData] = useState<SeekerData>({ cep: "", service: "" });
  const [providerData, setProviderData] = useState<ProviderData>({
    companyName: "",
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    services: "",
  });

  const handleChoiceSelect = (type: UserType) => {
    setUserType(type);
    setTimeout(() => {
      setStep(type === "seeker" ? "seeker-form" : "provider-form");
    }, 300);
  };

  const handleBack = () => {
    setStep("choice");
    setUserType(null);
  };

  const handleSeekerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seekerData.cep && seekerData.service) {
      onComplete("seeker", seekerData);
    }
  };

  const handleProviderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (providerData.companyName && providerData.cep && providerData.services) {
      onComplete("provider", providerData);
    }
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <div className="flex justify-center mb-12 animate-fade-in-up">
          <Logo size="lg" />
        </div>

        {/* Choice Step */}
        {step === "choice" && (
          <div className="animate-fade-in-up delay-200" style={{ opacity: 0, animationFillMode: "forwards" }}>
            <p className="text-center text-muted-foreground text-lg mb-10">
              Como podemos ajudar você hoje?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Seeker Card */}
              <div>
                <div
                  onClick={() => handleChoiceSelect("seeker")}
                  className={`bg-card border-2 rounded-lg choice-card p-8 text-center cursor-pointer ${userType === "seeker" ? "border-primary" : "border-border"}`}
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <SearchIcon className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Buscar Serviço</h3>
                  <p className="text-muted-foreground">
                    Encontre profissionais qualificados perto de você para realizar o serviço que precisa.
                  </p>
                  {userType === "seeker" && (
                    <div className="mt-4 flex justify-center">
                      <CheckIcon className="w-6 h-6 text-primary animate-pulse-soft" />
                    </div>
                  )}
                </div>
              </div>

              {/* Provider Card */}
              <div>
                <div
                  onClick={() => handleChoiceSelect("provider")}
                  className={`bg-card border-2 rounded-lg choice-card p-8 text-center cursor-pointer ${userType === "provider" ? "border-primary" : "border-border"}`}
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                      <BriefcaseIcon className="w-10 h-10 text-accent" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Sou Prestador</h3>
                  <p className="text-muted-foreground">
                    Cadastre seus serviços e alcance novos clientes na sua região.
                  </p>
                  {userType === "provider" && (
                    <div className="mt-4 flex justify-center">
                      <CheckIcon className="w-6 h-6 text-accent animate-pulse-soft" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Seeker Form */}
        {step === "seeker-form" && (
          <div className="animate-slide-in-right" style={{ animationFillMode: "forwards" }}>
            <button
              onClick={handleBack}
              className="flex items-center mb-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Voltar
            </button>

            <div className="bg-card border border-border rounded-lg p-8 max-w-lg mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <SearchIcon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">Buscar Serviço</h2>
                  <p className="text-muted-foreground text-sm">Encontre o profissional ideal</p>
                </div>
              </div>

              <form onSubmit={handleSeekerSubmit}>
                <div className="mb-6">
                  <label className="flex items-center text-foreground font-semibold mb-2">
                    <MapPinIcon className="w-4 h-4 mr-2 text-primary" />
                    Seu CEP
                  </label>
                    <input
                      type="text"
                    className="w-full px-6 py-4 text-lg rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      placeholder="00000-000"
                      value={seekerData.cep}
                      onChange={(e) =>
                        setSeekerData({ ...seekerData, cep: formatCEP(e.target.value) })
                      }
                      maxLength={9}
                      required
                    />
                  <p className="text-sm text-muted-foreground mt-2">
                    Usaremos para encontrar serviços próximos de você
                  </p>
                </div>

                <div className="mb-6">
                  <label className="flex items-center text-foreground font-semibold mb-2">
                    <WrenchIcon className="w-4 h-4 mr-2 text-primary" />
                    Qual serviço você precisa?
                  </label>
                    <input
                      type="text"
                    className="w-full px-6 py-4 text-lg rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      placeholder="Ex: Pintor, Eletricista, Encanador..."
                      value={seekerData.service}
                      onChange={(e) =>
                        setSeekerData({ ...seekerData, service: e.target.value })
                      }
                      required
                    />
                  <p className="text-sm text-muted-foreground mt-2">
                    Digite o tipo de profissional que você está buscando
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 text-lg font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!seekerData.cep || !seekerData.service}
                >
                  <span>Buscar Serviços</span>
                  <ArrowRightIcon className="w-5 h-5 ml-2" style={{ flexShrink: 0 }} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Provider Form */}
        {step === "provider-form" && (
          <div className="animate-slide-in-right" style={{ animationFillMode: "forwards" }}>
            <button
              onClick={handleBack}
              className="flex items-center mb-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Voltar
            </button>

            <div className="bg-card border border-border rounded-lg p-8 max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                  <BriefcaseIcon className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">Cadastro de Prestador</h2>
                  <p className="text-muted-foreground text-sm">Preencha seus dados para começar</p>
                </div>
              </div>

              <form onSubmit={handleProviderSubmit}>
                {/* Company Name */}
                <div className="mb-6">
                  <label className="flex items-center text-foreground font-semibold mb-2">
                    <BuildingIcon className="w-4 h-4 mr-2 text-accent" />
                    Nome da Empresa
                  </label>
                    <input
                      type="text"
                    className="w-full px-6 py-4 text-lg rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      placeholder="Nome da sua empresa ou seu nome"
                      value={providerData.companyName}
                      onChange={(e) =>
                        setProviderData({ ...providerData, companyName: e.target.value })
                      }
                      required
                    />
                </div>

                {/* Address Section */}
                <div className="mt-10 mb-6">
                  <p className="text-foreground font-semibold text-lg flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-2 text-accent" />
                    Endereço Completo
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                  <div className="md:col-span-4">
                    <label className="block text-foreground font-medium mb-2">CEP</label>
                        <input
                          type="text"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                          placeholder="00000-000"
                          value={providerData.cep}
                          onChange={(e) =>
                            setProviderData({ ...providerData, cep: formatCEP(e.target.value) })
                          }
                          maxLength={9}
                          required
                        />
                      </div>
                  <div className="md:col-span-8">
                    <label className="block text-foreground font-medium mb-2">Rua</label>
                        <input
                          type="text"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                          placeholder="Nome da rua"
                          value={providerData.street}
                          onChange={(e) =>
                            setProviderData({ ...providerData, street: e.target.value })
                          }
                          required
                        />
                      </div>
                  <div className="md:col-span-3">
                    <label className="block text-foreground font-medium mb-2">Número</label>
                        <input
                          type="text"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                          placeholder="123"
                          value={providerData.number}
                          onChange={(e) =>
                            setProviderData({ ...providerData, number: e.target.value })
                          }
                          required
                        />
                      </div>
                  <div className="md:col-span-5">
                    <label className="block text-foreground font-medium mb-2">Bairro</label>
                        <input
                          type="text"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                          placeholder="Nome do bairro"
                          value={providerData.neighborhood}
                          onChange={(e) =>
                            setProviderData({ ...providerData, neighborhood: e.target.value })
                          }
                          required
                        />
                      </div>
                  <div className="md:col-span-8">
                    <label className="block text-foreground font-medium mb-2">Cidade</label>
                        <input
                          type="text"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                          placeholder="Cidade"
                          value={providerData.city}
                          onChange={(e) =>
                            setProviderData({ ...providerData, city: e.target.value })
                          }
                          required
                        />
                      </div>
                  <div className="md:col-span-4">
                    <label className="block text-foreground font-medium mb-2">Estado (UF)</label>
                        <input
                          type="text"
                      className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                          placeholder="SP"
                          value={providerData.state}
                          onChange={(e) =>
                            setProviderData({ ...providerData, state: e.target.value.toUpperCase() })
                          }
                          maxLength={2}
                          required
                        />
                  </div>
                </div>

                {/* Services */}
                <div className="mb-6">
                  <label className="flex items-center text-foreground font-semibold mb-2">
                    <WrenchIcon className="w-4 h-4 mr-2 text-accent" />
                    Serviços Prestados
                  </label>
                    <textarea
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-vertical"
                      placeholder="Descreva os serviços que você oferece (ex: Pintura residencial, Pintura comercial, Texturização...)"
                      rows={4}
                      value={providerData.services}
                      onChange={(e) =>
                        setProviderData({ ...providerData, services: e.target.value })
                      }
                      required
                    />
                  <p className="text-sm text-muted-foreground mt-2">
                    Seja específico para que os clientes encontrem você facilmente
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 text-lg font-medium bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!providerData.companyName || !providerData.cep || !providerData.services}
                >
                  <span>Cadastrar Empresa</span>
                  <ArrowRightIcon className="w-5 h-5 ml-2" style={{ flexShrink: 0 }} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm mt-12 animate-fade-in delay-500" style={{ opacity: 0, animationFillMode: "forwards" }}>
          Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </div>
  );
}
