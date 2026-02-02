import { useState, useEffect } from "react";

const TERMS = ["Investoren", "Makler", "Eigentümer"];
const INTERVAL_MS = 2250;

export function RotatingHeroTitle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TERMS.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
      Das Immobilien-Tool für{" "}
      <span className="inline-block min-w-[10ch] text-primary">
        <span
          key={index}
          className="animate-fade-in inline-block"
        >
          {TERMS[index]}
        </span>
      </span>
    </h1>
  );
}
