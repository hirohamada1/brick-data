import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { Landing } from "@/pages/Landing";
import { Start } from "@/pages/Start";
import { Impressum } from "@/pages/Impressum";
import { Datenschutz } from "@/pages/Datenschutz";
import { Kontakt } from "@/pages/Kontakt";
import ListingsPage from "@/app/listings/page";
import WatchlistCreatePage from "@/app/watchlists/new/page";
import WatchlistListingsPage from "@/app/watchlists/[id]/listings/page";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/start" element={<Start />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/watchlists/new" element={<WatchlistCreatePage />} />
          <Route path="/watchlists/:id/listings" element={<WatchlistListingsPage />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/kontakt" element={<Kontakt />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
