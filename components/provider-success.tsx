"use client";

import { Logo } from "./logo";
import { CheckCircleIcon, ArrowRightIcon, BellIcon, SettingsIcon, BarChart3Icon } from "lucide-react";

interface ProviderData {
  companyName: string;
  services: string;
}

export function ProviderSuccess({ data, onContinue }: { data: ProviderData; onContinue: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        {/* Success Icon */}
        <div className="animate-fade-in-up flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-soft">
            <CheckCircleIcon className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* Message */}
        <div className="animate-fade-in-up delay-200" style={{ opacity: 0, animationFillMode: "forwards" }}>
          <h1 className="title is-2 text-foreground mb-4">Cadastro Realizado!</h1>
          <p className="text-muted-foreground text-lg mb-2">
            Bem-vindo ao Mãozinhas, <span className="text-primary font-semibold">{data.companyName}</span>!
          </p>
          <p className="text-muted-foreground">
            Seu perfil está sendo revisado e em breve estará visível para clientes na sua região.
          </p>
        </div>

        {/* Next Steps */}
        <div className="box mt-10 text-left animate-fade-in-up delay-300" style={{ opacity: 0, animationFillMode: "forwards" }}>
          <h3 className="font-semibold text-foreground mb-6">Próximos passos</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <SettingsIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Complete seu perfil</p>
                <p className="text-sm text-muted-foreground">Adicione fotos de trabalhos anteriores e mais detalhes.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BellIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Ative as notificações</p>
                <p className="text-sm text-muted-foreground">Receba alertas quando novos clientes entrarem em contato.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BarChart3Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Acompanhe suas métricas</p>
                <p className="text-sm text-muted-foreground">Veja quantas pessoas visualizaram seu perfil.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onContinue}
          className="button is-primary is-medium mt-8 animate-fade-in-up delay-400"
          style={{ opacity: 0, animationFillMode: "forwards" }}
        >
          Ir para o Painel
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </button>

        {/* Footer */}
        <div className="mt-12 animate-fade-in delay-500" style={{ opacity: 0, animationFillMode: "forwards" }}>
          <Logo size="sm" />
        </div>
      </div>
    </div>
  );
}
