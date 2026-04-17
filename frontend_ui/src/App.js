import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  Menu,
  X,
  Scissors,
  Camera,
  Ruler,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import FittingRoom from "./FittingRoom";
import CategoryPage from "./CategoryPage";
import BespokePage from "./BespokePage";
import BespokeFittingRoom from "./BespokeFittingRoom";

// SCREEN 1: Prototype Information
const LandingPage = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center px-8 py-20 text-center bg-white">
    <div className="max-w-3xl animate-in fade-in zoom-in duration-1000">
      <h1 className="text-4xl md:text-5xl tracking-[0.3em] font-bold uppercase mb-12 border-y border-gray-100 py-8">
        Prototype in AI Diffusion
      </h1>

      <div className="space-y-6 mb-16 text-gray-600 leading-relaxed font-light tracking-wide text-sm md:text-base text-justify">
        <p>
          This prototype, engineered by{" "}
          <span className="font-semibold text-black">PragICTS</span>,
          demonstrates the transformative potential of AI diffusion technology
          in the fashion and apparel industry. By generating realistic digital
          visualizations of garments, it enables stakeholders designers,
          retailers, and customers to evaluate fit, style, and options before
          committing to production or purchase.
        </p>
        <p>
          Beyond fashion, AI diffusion opens opportunities across multiple
          industries where digital previews and simulations can drive smarter,
          faster, and lower-risk decisions.
        </p>
      </div>

      <Link
        to="/guidelines"
        className="inline-flex items-center gap-4 bg-black text-white px-12 py-5 rounded-full text-[11px] uppercase tracking-[0.4em] hover:bg-gray-800 transition-all group shadow-xl hover:shadow-2xl"
      >
        Proceed{" "}
        <ArrowRight
          size={16}
          className="group-hover:translate-x-2 transition-transform"
        />
      </Link>
    </div>
  </div>
);

// SCREEN 2: Effective Usage Guidelines
const GuidelinesPage = () => (
  <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-10 bg-[#fafafa]">
    <div className="max-w-2xl w-full animate-in slide-in-from-bottom-8 duration-1000 bg-white p-8 md:p-10 shadow-sm border border-gray-100">
      <h2 className="text-[9px] uppercase tracking-[0.5em] text-gray-400 mb-2 font-light text-center">
        Optimization
      </h2>
      <h1 className="text-2xl md:text-3xl tracking-[0.2em] font-bold uppercase mb-8 text-center">
        Usage Guidelines
      </h1>

      <div className="max-w-fit mx-auto mb-10">
        <div className="grid gap-6">
          {[
            {
              title: "Provide clear images",
              desc: "Input images should be well-lit and high-resolution.",
            },
            {
              title: "Maintain consistency",
              desc: "Ensure clothing and body images align in perspective.",
            },
            {
              title: "Avoid ambiguous inputs",
              desc: "Blurry or unrelated images reduce generation quality.",
            },
            {
              title: "Use precise annotations",
              desc: "Provide labeling where supported to enhance output fidelity.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex gap-4 items-start border-b border-gray-50 pb-4 last:border-0"
            >
              <CheckCircle size={18} className="text-black shrink-0 mt-1" />
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold mb-1 text-left">
                  {item.title}
                </h4>
                <p className="text-[12px] text-gray-500 font-light leading-snug text-left">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Link
          to="/selection"
          className="inline-flex items-center gap-4 bg-black text-white px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.4em] hover:bg-gray-800 transition-all group shadow-lg"
        >
          Proceed{" "}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </div>
  </div>
);

// SCREEN 3: Method Selection
const SelectionPage = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center px-8 py-20 bg-white">
    <div className="max-w-6xl w-full animate-in fade-in duration-1000 text-center">
      <h2 className="text-[10px] uppercase tracking-[0.6em] text-gray-400 mb-4 font-light">
        Choose Your Path
      </h2>
      <h1 className="text-3xl md:text-4xl tracking-[0.2em] font-bold uppercase mb-16">
        Select Your Preference
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link
          to="/bespoke"
          className="group flex flex-col items-center p-12 border border-gray-100 hover:border-black transition-all duration-500 hover:shadow-2xl"
        >
          <div className="w-16 h-16 bg-[#fafafa] group-hover:bg-black group-hover:text-white rounded-full flex items-center justify-center mb-6 transition-colors">
            <Scissors size={28} strokeWidth={1.5} />
          </div>
          <h3 className="text-sm tracking-[0.3em] font-bold uppercase mb-4">
            Bespoke
          </h3>
          <p className="text-[11px] text-gray-400 font-light leading-relaxed uppercase tracking-widest">
            Design your own garment by choosing fabrics, collars, and buttons.
          </p>
        </Link>

        <Link
          to="/collection/men"
          className="group flex flex-col items-center p-12 border border-gray-100 hover:border-black transition-all duration-500 hover:shadow-2xl"
        >
          <div className="w-16 h-16 bg-[#fafafa] group-hover:bg-black group-hover:text-white rounded-full flex items-center justify-center mb-6 transition-colors">
            <Camera size={28} strokeWidth={1.5} />
          </div>
          <h3 className="text-sm tracking-[0.3em] font-bold uppercase mb-4">
            Ready Made
          </h3>
          <p className="text-[11px] text-gray-400 font-light leading-relaxed uppercase tracking-widest">
            Browse our existing collection and try on finished designs
            instantly.
          </p>
        </Link>

        <div className="relative group flex flex-col items-center p-12 border border-gray-50 bg-gray-50/30 cursor-not-allowed overflow-hidden">
          <div className="absolute top-0 right-0">
            <span className="bg-gray-200 text-gray-500 text-[8px] px-3 py-1 tracking-[0.2em] font-bold uppercase">
              Coming Soon
            </span>
          </div>

          <div className="w-16 h-16 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center mb-6">
            <Ruler size={28} strokeWidth={1.5} />
          </div>
          <h3 className="text-sm tracking-[0.3em] font-bold uppercase mb-4 text-gray-300">
            Made to Measure
          </h3>
          <p className="text-[11px] text-gray-300 font-light leading-relaxed uppercase tracking-widest">
            Submit your precise physical measurements for a custom-tailored
            digital fit.
          </p>
          <span className="mt-4 text-[9px] italic text-gray-400 lowercase opacity-60">
            under development
          </span>
        </div>
      </div>
    </div>
  </div>
);

const AppContent = () => {
  const [garments, setGarments] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tryon/garments/")
      .then((res) => res.json())
      .then((data) => setGarments(data))
      .catch((err) => console.error("Django Server Error:", err));
  }, []);

  // Helper function to check if a path is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white text-black font-sans relative overflow-x-hidden flex flex-col">
      {/* SIDEBAR MENU */}
      <div
        className={`fixed inset-y-0 left-0 w-80 bg-white z-[100] transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 ease-in-out border-r border-gray-100 shadow-2xl`}
      >
        <div className="p-8">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="mb-12 hover:rotate-90 transition-transform duration-300"
          >
            <X size={24} strokeWidth={1} />
          </button>
          <h2 className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-8 font-light">
            Experience
          </h2>
          <ul className="space-y-6 text-sm uppercase tracking-[0.2em] font-medium mb-12">
            <li onClick={() => setIsMenuOpen(false)}>
              <Link
                to="/bespoke"
                className={`hover:pl-4 transition-all duration-300 flex items-center gap-2 ${
                  isActive("/bespoke") ? "text-blue-600" : "text-black"
                }`}
              >
                <Scissors size={14} /> Bespoke Tailoring
              </Link>
            </li>
            <li onClick={() => setIsMenuOpen(false)}>
              <Link
                to="/collection/men"
                className={`hover:pl-4 transition-all duration-300 flex items-center gap-2 ${
                  isActive("/collection/men") ? "text-blue-600" : "text-black"
                }`}
              >
                <Camera size={14} /> Ready Made
              </Link>
            </li>
          </ul>
          <h2 className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-8 font-light">
            Categories
          </h2>
          <ul className="space-y-6 text-sm uppercase tracking-[0.2em] font-light">
            <li onClick={() => setIsMenuOpen(false)}>
              <Link
                to="/collection/men"
                className={`hover:pl-4 transition-all duration-300 block capitalize ${
                  isActive("/collection/men") ? "text-blue-600" : "text-black"
                }`}
              >
                Men
              </Link>
            </li>
            <li className="opacity-30 cursor-not-allowed select-none">
              Women (Coming Soon)
            </li>
            <li className="opacity-30 cursor-not-allowed select-none">
              Kids (Coming Soon)
            </li>
          </ul>
        </div>
      </div>

      {/* TOP NAVIGATION */}
      <nav className="flex justify-between items-center px-12 py-8 border-b border-gray-100 uppercase tracking-[0.3em] text-[10px] bg-white sticky top-0 z-40">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={20} strokeWidth={1} />
          <span className="hidden md:inline group-hover:underline">Menu</span>
        </div>
        <Link
          to="/"
          className="text-2xl tracking-[0.5em] font-bold absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          DIGITAL FIT-ONS
        </Link>
        <div className="flex gap-8 items-center">
          <Link
            to="/bespoke"
            className={`tracking-[0.3em] font-light transition-colors ${
              isActive("/bespoke")
                ? "text-blue-600"
                : "text-black hover:text-gray-400"
            }`}
          >
            BESPOKE
          </Link>
          <Link
            to="/collection/men"
            className={`tracking-[0.3em] font-light transition-colors ${
              isActive("/collection/men")
                ? "text-blue-600"
                : "text-black hover:text-gray-400"
            }`}
          >
            READY MADE
          </Link>
        </div>
      </nav>

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/selection" element={<SelectionPage />} />
          <Route path="/try-on" element={<FittingRoom />} />
          <Route path="/bespoke" element={<BespokePage />} />
          <Route
            path="/collection/:categoryName"
            element={<CategoryPage garments={garments} />}
          />
          <Route path="/bespoke-try-on" element={<BespokeFittingRoom />} />
        </Routes>
      </div>

      <footer className="py-12 border-t border-gray-100 text-center bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4">
            ENGINEERED BY PRAGICTS
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[10px] text-gray-500 tracking-widest uppercase">
            <a
              href="https://www.ai.pragicts.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
            >
              www.ai.pragicts.com
            </a>
            <span className="hidden md:inline text-gray-200">|</span>
            <a
              href="mailto:ai@pragicts.com"
              className="hover:text-black transition-colors"
            >
              ai@pragicts.com
            </a>
            <span className="hidden md:inline text-gray-200">|</span>
            <span className="whitespace-nowrap">+94 70 459 8983</span>
          </div>
          <p className="mt-8 text-[8px] uppercase tracking-[0.5em] text-gray-300">
            © 2026 DIGITAL FIT-ONS INTERNATIONAL
          </p>
        </div>
      </footer>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
