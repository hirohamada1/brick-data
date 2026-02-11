import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function OnboardingInfo() {
  const [dismissed, setDismissed] = useState(true); // Default to true to avoid flash on server

  useEffect(() => {
    const isDismissed = localStorage.getItem("brickdata-onboarding-dismissed") === "true";
    setDismissed(isDismissed);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("brickdata-onboarding-dismissed", "true");
  };

  if (dismissed) return null;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex items-start justify-between gap-4 pt-6">
        <div>
          <h3 className="font-semibold text-foreground">Willkommen bei BrickData</h3>
          <p className="text-sm text-muted-foreground mt-1">
            BrickData zeigt Preisverläufe, Relistings und sendet Pings für neue Angebote.
            Erstelle Alerts mit Max-Bietpreis und bleib auf dem Laufenden bei passenden
            Immobilien in deiner Zielregion.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          aria-label="Infobox schließen"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
