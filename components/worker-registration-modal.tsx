"use client";

import { useState, useCallback } from "react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  MapPin,
  NavigationArrow,
  CircleNotch,
  CheckCircle,
  House,
  Heart,
  Scissors,
  PawPrint,
  Barbell,
  GridFour,
  GraduationCap,
} from "@phosphor-icons/react";
import type { ServiceCategory } from "@/lib/firebase/types";

/* ─── Types ── */
interface FormData {
  name: string;
  companyName: string;
  phone: string;
  email: string;
  category: ServiceCategory | "";
  description: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  coordinates?: { latitude: number; longitude: number };
}

interface WorkerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── Category options ── */
const categoryOptions: { id: ServiceCategory; label: string; Icon: any; color: string; bg: string }[] = [
  { id: "casa",     label: "Casa",     Icon: House,       color: "#c0394e", bg: "#FFB6C1" },
  { id: "cuidados", label: "Cuidados", Icon: Heart,       color: "#b83254", bg: "#FFE4E1" },
  { id: "beleza",   label: "Beleza",   Icon: Scissors,    color: "#6b48b5", bg: "#E6E6FA" },
  { id: "pets",     label: "Pets",     Icon: PawPrint,    color: "#b85e1f", bg: "#FFE5CC" },
  { id: "esportes", label: "Esportes", Icon: Barbell,     color: "#1a7d8e", bg: "#B0E0E6" },
  { id: "aulas",    label: "Aulas",    Icon: GraduationCap, color: "#7a6000", bg: "#F0E68C" },
  { id: "outros",   label: "Outros",   Icon: GridFour,    color: "#8a5c00", bg: "#FFE5B4" },
];

/* ─── Helpers ── */
function formatPhone(value: string) {
  const n = value.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 2) return n;
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

function formatCEP(value: string) {
  const n = value.replace(/\D/g, "").slice(0, 8);
  if (n.length <= 5) return n;
  return `${n.slice(0, 5)}-${n.slice(5)}`;
}

/* ─── Step indicator ── */
function StepDot({ active, done }: { active: boolean; done: boolean }) {
  return (
    <span
      className={`w-2 h-2 rounded-full transition-all duration-300 ${
        done   ? "bg-[#5eb3b3] w-5" :
        active ? "bg-[#5eb3b3]" :
                 "bg-gray-200"
      }`}
    />
  );
}

/* ─── Component ── */
export function WorkerRegistrationModal({ isOpen, onClose }: WorkerRegistrationModalProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const [form, setForm] = useState<FormData>({
    name: "", companyName: "", phone: "", email: "",
    category: "", description: "",
    cep: "", street: "", number: "", neighborhood: "", city: "", state: "",
  });

  const set = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  };

  /* ── Validation ── */
  const validateStep = useCallback((s: number) => {
    const e: typeof errors = {};
    if (s === 1) {
      if (!form.name.trim())  e.name  = "Nome obrigatório";
      if (!form.phone.trim()) e.phone = "Telefone obrigatório";
      if (!form.email.trim() || !form.email.includes("@")) e.email = "E-mail inválido";
    }
    if (s === 2) {
      if (!form.category)          e.category    = "Selecione uma categoria";
      if (!form.description.trim()) e.description = "Descreva seus serviços";
    }
    if (s === 3) {
      if (form.cep.replace(/\D/g, "").length < 8) e.cep  = "CEP inválido";
      if (!form.city.trim())                       e.city = "Cidade obrigatória";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  /* ── CEP lookup ── */
  const lookupCEP = async () => {
    const raw = form.cep.replace(/\D/g, "");
    if (raw.length < 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm(prev => ({
          ...prev,
          street:       data.logradouro || prev.street,
          neighborhood: data.bairro     || prev.neighborhood,
          city:         data.localidade || prev.city,
          state:        data.uf         || prev.state,
        }));
      }
    } catch {}
    setCepLoading(false);
  };

  /* ── Geolocation ── */
  const useGeolocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        setForm(prev => ({ ...prev, coordinates: { latitude, longitude } }));
        // Reverse geocode via nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=pt-BR`
          );
          const data = await res.json();
          const addr = data.address || {};
          const cepRaw = (addr.postcode || "").replace(/\D/g, "");
          setForm(prev => ({
            ...prev,
            cep:          formatCEP(cepRaw),
            street:       addr.road            || prev.street,
            neighborhood: addr.suburb || addr.neighbourhood || prev.neighborhood,
            city:         addr.city  || addr.town || addr.village || prev.city,
            state:        addr.state_code       || prev.state,
          }));
        } catch {}
        setGeoLoading(false);
      },
      () => setGeoLoading(false)
    );
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setLoading(true);
    try {
      await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:        form.name,
          companyName: form.companyName || undefined,
          phone:       form.phone,
          email:       form.email,
          category:    form.category,
          description: form.description,
          location: {
            cep:          form.cep,
            street:       form.street,
            number:       form.number,
            neighborhood: form.neighborhood,
            city:         form.city,
            state:        form.state,
            coordinates:  form.coordinates,
          },
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  /* ── Reset on close ── */
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1); setSubmitted(false); setErrors({});
      setForm({ name: "", companyName: "", phone: "", email: "", category: "", description: "", cep: "", street: "", number: "", neighborhood: "", city: "", state: "" });
    }, 300);
  };

  if (!isOpen) return null;

  return (
    /* Bottom-sheet on mobile, centered modal on sm+ */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 animate-fade-in"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{ animation: "slideInUp 0.4s ease-out forwards" }}
      >
        {/* Drag handle — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* ── Success state ── */}
        {submitted ? (
          <div className="p-8 sm:p-10 text-center">
            <div className="w-20 h-20 bg-[#5eb3b3]/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle weight="fill" className="w-12 h-12 text-[#5eb3b3]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cadastro enviado!</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Recebemos seus dados. Nossa equipe analisará seu perfil e em breve você estará disponível para clientes na sua região.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3.5 bg-gradient-to-r from-[#5eb3b3] to-[#4a9d9d] text-white font-semibold rounded-2xl hover:shadow-lg transition-all"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="px-5 sm:px-8 pt-4 sm:pt-7 pb-4 sm:pb-5 flex-shrink-0">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  {step > 1 && (
                    <button onClick={() => setStep(s => s - 1)} className="mr-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <div>
                    <p className="text-xs text-[#5eb3b3] font-semibold tracking-wider uppercase">
                      Passo {step} de 3
                    </p>
                    <h2 className="text-xl font-bold text-gray-800 leading-tight">
                      {step === 1 && "Quem é você?"}
                      {step === 2 && "O que você oferece?"}
                      {step === 3 && "Onde você atua?"}
                    </h2>
                  </div>
                </div>
                <button onClick={handleClose} className="text-gray-300 hover:text-gray-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step dots */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map(s => (
                  <StepDot key={s} active={s === step} done={s < step} />
                ))}
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="h-px bg-gray-100" />

            {/* ── Body ── */}
            <div className="px-5 sm:px-8 py-4 sm:py-6 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1">

              {/* Step 1 — Personal */}
              {step === 1 && (
                <>
                  <Field label="Nome completo *" error={errors.name}>
                    <input
                      value={form.name}
                      onChange={e => set("name", e.target.value)}
                      placeholder="Seu nome ou nome profissional"
                      className={inputCls(!!errors.name)}
                      autoFocus
                    />
                  </Field>
                  <Field label="Nome da empresa" error={errors.companyName}>
                    <input
                      value={form.companyName}
                      onChange={e => set("companyName", e.target.value)}
                      placeholder="Opcional"
                      className={inputCls(false)}
                    />
                  </Field>
                  <Field label="WhatsApp / Telefone *" error={errors.phone}>
                    <input
                      value={form.phone}
                      onChange={e => set("phone", formatPhone(e.target.value))}
                      placeholder="(11) 99999-9999"
                      className={inputCls(!!errors.phone)}
                    />
                  </Field>
                  <Field label="E-mail *" error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      placeholder="seu@email.com"
                      className={inputCls(!!errors.email)}
                    />
                  </Field>
                </>
              )}

              {/* Step 2 — Services */}
              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Categoria principal *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {categoryOptions.map(({ id, label, Icon, color, bg }) => {
                        const active = form.category === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => set("category", id)}
                            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all duration-200 ${
                              active
                                ? "border-[#5eb3b3] shadow-md scale-105"
                                : "border-gray-100 hover:border-gray-200"
                            }`}
                          >
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: active ? bg : "#f5f5f5" }}
                            >
                              <Icon weight="duotone" className="w-5 h-5" style={{ color: active ? color : "#9ca3af" }} />
                            </div>
                            <span className={`text-[10px] font-medium ${active ? "text-gray-800" : "text-gray-400"}`}>
                              {label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.category && <p className="text-red-500 text-xs mt-1.5">{errors.category}</p>}
                  </div>

                  <Field label="Descreva seus serviços *" error={errors.description}>
                    <textarea
                      value={form.description}
                      onChange={e => set("description", e.target.value)}
                      placeholder="Ex: Pintura residencial e comercial, texturização, grafiato. Atendo toda a região metropolitana com materiais próprios..."
                      rows={4}
                      className={`${inputCls(!!errors.description)} resize-none`}
                    />
                  </Field>
                </>
              )}

              {/* Step 3 — Location */}
              {step === 3 && (
                <>
                  {/* Geo button */}
                  <button
                    type="button"
                    onClick={useGeolocation}
                    disabled={geoLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#5eb3b3]/40 text-[#5eb3b3] rounded-2xl hover:bg-[#5eb3b3]/5 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {geoLoading
                      ? <CircleNotch className="w-4 h-4 animate-spin" />
                      : <NavigationArrow weight="fill" className="w-4 h-4" />
                    }
                    {geoLoading ? "Detectando localização..." : "Usar minha localização atual"}
                  </button>

                  <div className="flex items-center gap-3 text-xs text-gray-300">
                    <div className="flex-1 h-px bg-gray-100" />
                    ou informe o CEP
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  {/* CEP */}
                  <Field label="CEP *" error={errors.cep}>
                    <div className="flex gap-2">
                      <input
                        value={form.cep}
                        onChange={e => set("cep", formatCEP(e.target.value))}
                        onBlur={lookupCEP}
                        placeholder="00000-000"
                        maxLength={9}
                        className={`${inputCls(!!errors.cep)} flex-1`}
                      />
                      <button
                        type="button"
                        onClick={lookupCEP}
                        disabled={cepLoading}
                        className="px-4 bg-[#5eb3b3]/10 text-[#5eb3b3] rounded-xl hover:bg-[#5eb3b3]/20 transition-colors disabled:opacity-50 font-medium text-sm"
                      >
                        {cepLoading ? <CircleNotch className="w-4 h-4 animate-spin" /> : "Buscar"}
                      </button>
                    </div>
                  </Field>

                  <Field label="Rua / Logradouro">
                    <input
                      value={form.street}
                      onChange={e => set("street", e.target.value)}
                      placeholder="Nome da rua"
                      className={inputCls(false)}
                    />
                  </Field>

                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Número">
                      <input
                        value={form.number}
                        onChange={e => set("number", e.target.value)}
                        placeholder="123"
                        className={inputCls(false)}
                      />
                    </Field>
                    <Field label="Bairro" className="col-span-2">
                      <input
                        value={form.neighborhood}
                        onChange={e => set("neighborhood", e.target.value)}
                        placeholder="Bairro"
                        className={inputCls(false)}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Field label="UF">
                      <input
                        value={form.state}
                        onChange={e => set("state", e.target.value.toUpperCase())}
                        placeholder="SP"
                        maxLength={2}
                        className={inputCls(false)}
                      />
                    </Field>
                    <Field label="Cidade *" error={errors.city} className="col-span-2">
                      <input
                        value={form.city}
                        onChange={e => set("city", e.target.value)}
                        placeholder="Cidade"
                        className={inputCls(!!errors.city)}
                      />
                    </Field>
                  </div>
                </>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="px-5 sm:px-8 pb-6 sm:pb-7 pt-3 sm:pt-4 border-t border-gray-50 flex-shrink-0">
              <button
                onClick={() => {
                  if (!validateStep(step)) return;
                  if (step < 3) setStep(s => s + 1);
                  else handleSubmit();
                }}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-gradient-to-r from-[#5eb3b3] to-[#4a9d9d] text-white font-semibold rounded-2xl hover:shadow-lg transition-all disabled:opacity-70"
              >
                {loading ? (
                  <CircleNotch className="w-5 h-5 animate-spin" />
                ) : step < 3 ? (
                  <>Continuar <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Enviar cadastro <CheckCircle className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Small helpers ── */
function inputCls(hasError: boolean) {
  return `w-full px-4 py-3 text-sm rounded-xl border-2 outline-none transition-colors ${
    hasError
      ? "border-red-300 focus:border-red-400"
      : "border-gray-100 focus:border-[#5eb3b3]"
  } text-gray-700 placeholder:text-gray-300`;
}

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
