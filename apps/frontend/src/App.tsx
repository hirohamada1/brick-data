import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { Landing } from "@/pages/Landing";
import { Start } from "@/pages/Start";
import { Impressum } from "@/pages/Impressum";
import { Datenschutz } from "@/pages/Datenschutz";
import { Kontakt } from "@/pages/Kontakt";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/start" element={<Start />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/kontakt" element={<Kontakt />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
