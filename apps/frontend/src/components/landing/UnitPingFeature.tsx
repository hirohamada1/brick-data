import { useEffect, useState, useRef } from "react";
import { MessageCircle } from "lucide-react";

const DEMO_UNIT = {
  image: "/backbone_119511_118_WEB-3.jpg",
  address: "Berlin-Prenzlauer Berg",
  kaufpreis: "485.000 €",
  rendite: "4,2 %",
  cashflow: "+ 1.420 €/Monat",
};

export function UnitPingFeature() {
  const [pingTriggered, setPingTriggered] = useState(false);
  const hasTriggeredRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let prevVisible: boolean | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isVisible = entry.isIntersecting;
        if (prevVisible === null) {
          prevVisible = isVisible;
          return;
        }
        if (isVisible && !prevVisible && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          timeoutId = setTimeout(() => setPingTriggered(true), 400);
        }
        prevVisible = isVisible;
      },
      // Erst triggern, wenn Section weit hochgescrollt – Chat "gerade so oben" sichtbar
      { threshold: 0.5, rootMargin: "0px 0px -45% 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section ref={sectionRef} id="unit-ping" className="border-t border-border bg-muted/30 py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Neue Einheiten – sofort gepingt
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Neue passende Einheiten? Du bekommst sofort den Ping – mit allen relevanten Kennzahlen.
        </p>

        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
          {/* Chat / App Mock */}
          <div className="relative w-full max-w-md">
            <div className="rounded-3xl border-2 border-border bg-background shadow-xl overflow-hidden">
              {/* App Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/50">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  {pingTriggered && (
                    <span
                      className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1.5 animate-ping-badge"
                      aria-hidden
                    >
                      1
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">BrickData Chat</p>
                  <p className="text-xs text-muted-foreground">Neue Einheiten</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-5 space-y-4 min-h-[260px]">
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm bg-muted px-5 py-3 max-w-[85%]">
                    <div className="flex items-center gap-2">
                      <p className="text-sm md:text-base">Suche neue Angebote</p>
                      <span className="loading-spinner" aria-hidden />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Vor 2 Min.</p>
                  </div>
                </div>
                {pingTriggered && (
                  <div className="flex justify-start animate-ping-message">
                    <div className="rounded-2xl rounded-tl-sm border-2 border-primary/30 bg-primary/5 overflow-hidden max-w-[95%] shadow-lg">
                      <div className="flex gap-4 p-4">
                        <img
                          src={DEMO_UNIT.image}
                          alt="Altbauwohnung Berlin-Prenzlauer Berg"
                          className="w-28 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-primary">Neue Einheit</p>
                          <p className="text-sm font-medium truncate">{DEMO_UNIT.address}</p>
                          <div className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                            <p>Kaufpreis: <span className="text-foreground font-medium">{DEMO_UNIT.kaufpreis}</span></p>
                            <p>Rendite: <span className="text-foreground font-medium">{DEMO_UNIT.rendite}</span></p>
                            <p>Cashflow: <span className="text-primary font-medium">{DEMO_UNIT.cashflow}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side: Feature bullets */}
          <div className="space-y-6 text-center lg:text-left">
            <ul className="space-y-4 text-base text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                Alle relevanten Kennzahlen auf einen Blick
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                Unfairer Zeitvorteil gegenüber dem Markt
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                Sofortige Ersteinschätzung jeder Einheit
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
