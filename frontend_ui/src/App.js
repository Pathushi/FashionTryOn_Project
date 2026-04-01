import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Scissors,
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
        Click to Proceed{" "}
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
  <div className="min-h-[80vh] flex flex-col items-center justify-center px-8 py-20 text-center bg-[#fafafa]">
    <div className="max-w-3xl animate-in slide-in-from-bottom-8 duration-1000 bg-white p-12 shadow-sm border border-gray-100">
      <h1 className="text-3xl md:text-4xl tracking-[0.2em] font-bold uppercase mb-12">
        Effective Usage Guidelines
      </h1>

      <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-10">
        To achieve accurate and realistic results with AI diffusion:
      </p>

      <div className="grid gap-8 mb-16 text-left">
        {[
          {
            title: "Provide clear and relevant images",
            desc: "Input images should be well-lit, high-resolution, and relevant to the intended garment or fit-on scenario.",
          },
          {
            title: "Maintain consistency",
            desc: "Ensure that clothing images and body images are aligned in perspective and scale for optimal mapping.",
          },
          {
            title: "Avoid ambiguous inputs",
            desc: "Blurry, incomplete, or unrelated images can reduce the accuracy and quality of the generated results.",
          },
          {
            title: "Use precise annotations",
            desc: "If the system supports labeling (e.g., garment type, pose), provide this information to enhance output fidelity.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex gap-6 items-start border-b border-gray-50 pb-6 last:border-0"
          >
            <CheckCircle size={20} className="text-black shrink-0 mt-1" />
            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-bold mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/try-on"
        className="inline-flex items-center gap-4 bg-black text-white px-12 py-5 rounded-full text-[11px] uppercase tracking-[0.4em] hover:bg-gray-800 transition-all group"
      >
        Click to Proceed{" "}
        <ArrowRight
          size={16}
          className="group-hover:translate-x-2 transition-transform"
        />
      </Link>
    </div>
  </div>
);

const App = () => {
  const [garments, setGarments] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tryon/garments/")
      .then((res) => res.json())
      .then((data) => setGarments(data))
      .catch((err) => console.error("Django Server Error:", err));
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white text-black font-sans relative overflow-x-hidden flex flex-col">
        {/* SIDEBAR MENU - RESTORED CATEGORIES */}
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
                  className="hover:pl-4 transition-all duration-300 block text-blue-600 flex items-center gap-2"
                >
                  <Scissors size={14} /> Bespoke Tailoring
                </Link>
              </li>
              <li onClick={() => setIsMenuOpen(false)}>
                <Link
                  to="/try-on"
                  className="hover:pl-4 transition-all duration-300 block"
                >
                  Virtual Fitting Room
                </Link>
              </li>
            </ul>

            <h2 className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-8 font-light">
              Categories
            </h2>
            <ul className="space-y-6 text-sm uppercase tracking-[0.2em] font-light">
              {["men", "women", "kids"].map((cat) => (
                <li key={cat} onClick={() => setIsMenuOpen(false)}>
                  <Link
                    to={`/collection/${cat}`}
                    className="hover:pl-4 transition-all duration-300 block capitalize"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
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
              className="tracking-[0.3em] hover:text-gray-400 font-light text-blue-600"
            >
              BESPOKE
            </Link>
            <Link
              to="/try-on"
              className="tracking-[0.3em] hover:text-gray-400 font-light"
            >
              TRY ON
            </Link>
            <div className="flex gap-6">
              <Search size={18} strokeWidth={1} className="cursor-pointer" />
              <ShoppingBag
                size={18}
                strokeWidth={1}
                className="cursor-pointer"
              />
            </div>
          </div>
        </nav>

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/guidelines" element={<GuidelinesPage />} />
            <Route path="/try-on" element={<FittingRoom />} />
            <Route path="/bespoke" element={<BespokePage />} />
            <Route
              path="/collection/:categoryName"
              element={<CategoryPage garments={garments} />}
            />
            <Route path="/bespoke-try-on" element={<BespokeFittingRoom />} />
          </Routes>
        </div>

        {/* UPDATED FOOTER WITH PRAGICTS DETAILS */}
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
    </Router>
  );
};

export default App;
