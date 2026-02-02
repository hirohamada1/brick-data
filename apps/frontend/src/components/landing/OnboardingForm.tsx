import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

const ZWECK_OPTIONS = [
  { value: "investieren", label: "Investieren" },
  { value: "eigentum", label: "Eigentum" },
  { value: "verwalten", label: "Verwalten" },
  { value: "makler", label: "Makler" },
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface LeadData {
  name: string;
  email: string;
  zweck: string;
  region?: string;
}

interface OnboardingFormProps {
  onSubmit: (data: LeadData) => Promise<void>;
}

export function OnboardingForm({ onSubmit }: OnboardingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [zweck, setZweck] = useState("");
  const [region, setRegion] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof LeadData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const next: Partial<Record<keyof LeadData, string>> = {};
    if (!name.trim()) next.name = "Bitte Namen angeben.";
    if (!email.trim()) next.email = "Bitte E-Mail angeben.";
    else if (!EMAIL_REGEX.test(email)) next.email = "Bitte gültige E-Mail-Adresse angeben.";
    if (!zweck) next.zweck = "Bitte Zweck auswählen.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    setErrors({});
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        zweck,
        region: region.trim() || undefined,
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Fehler beim Senden. Bitte später erneut versuchen.";
      setErrors({ email: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div>
        <Label htmlFor="onboarding-name" className="text-foreground">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="onboarding-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ihr Name"
          className="mt-2 rounded-2xl"
          disabled={submitting}
          autoComplete="name"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="mt-1.5 text-sm text-destructive" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="onboarding-email" className="text-foreground">
          E-Mail <span className="text-destructive">*</span>
        </Label>
        <Input
          id="onboarding-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="beispiel@email.de"
          className="mt-2 rounded-2xl"
          disabled={submitting}
          autoComplete="email"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="mt-1.5 text-sm text-destructive" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <Label className="text-foreground">
          Zweck <span className="text-destructive">*</span>
        </Label>
        <Select
          value={zweck}
          onValueChange={setZweck}
          disabled={submitting}
          required
        >
          <SelectTrigger className="mt-2 rounded-2xl" aria-invalid={!!errors.zweck}>
            <SelectValue placeholder="Bitte wählen …" />
          </SelectTrigger>
          <SelectContent>
            {ZWECK_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.zweck && (
          <p className="mt-1.5 text-sm text-destructive" role="alert">
            {errors.zweck}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="onboarding-region" className="text-foreground">
          Ort / Region <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Input
          id="onboarding-region"
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="z. B. Berlin, Hamburg"
          className="mt-2 rounded-2xl"
          disabled={submitting}
          autoComplete="off"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-2xl mt-8"
        disabled={submitting}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="loading-spinner" aria-hidden />
            Wird gesendet …
          </span>
        ) : (
          <>
            Kostenlos anfragen
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
