import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Camera,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import FittingRoom from "./FittingRoom";
import CategoryPage from "./CategoryPage"; // Import the new component

const LandingPage = ({ garments, setIsMenuOpen }) => (
  <>
    <section className="relative w-full aspect-[21/9] md:aspect-[3/1] bg-gray-50 overflow-hidden">
      <img
        src="/Landing page.jpg"
        alt="Blossom Exclusive Launching"
        className="w-full h-full object-cover object-top"
      />
      <button className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 p-4 text-white hover:bg-white hover:text-black transition-all rounded-full backdrop-blur-sm">
        <ChevronLeft size={20} strokeWidth={1} />
      </button>
      <button className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 p-4 text-white hover:bg-white hover:text-black transition-all rounded-full backdrop-blur-sm">
        <ChevronRight size={20} strokeWidth={1} />
      </button>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {[1, 2, 3, 4, 5].map((_, i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full border border-white ${i === 0 ? "bg-white" : "bg-transparent"}`}
          ></span>
        ))}
      </div>
    </section>

    <main className="max-w-7xl mx-auto px-8 py-24">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-2">
            Collection
          </h2>
          <h3 className="text-xl tracking-[0.2em] font-light uppercase">
            New Arrivals
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-widest border-b border-black pb-1 cursor-pointer">
          View All
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
        {garments.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="relative aspect-[3/4] bg-[#f9f9f9] overflow-hidden flex items-center justify-center p-8">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out"
              />
              <Link
                to="/try-on"
                state={{ garment: item }}
                className="absolute bottom-0 w-full bg-black text-white py-5 text-center text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
              >
                <Camera className="inline-block mr-2 mb-0.5" size={14} />{" "}
                Virtual Try-On
              </Link>
            </div>
            <div className="mt-6 text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-1">
                {item.category}
              </p>
              <h3 className="text-[11px] tracking-[0.2em] uppercase font-medium">
                {item.name}
              </h3>
              <p className="text-[11px] mt-2 font-light">LKR {item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  </>
);

const App = () => {
  const [garments, setGarments] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tryon/garments/")
      .then((res) => res.json())
      .then((data) => setGarments(data))
      .catch((err) =>
        console.error("Make sure your Django server is running!", err),
      );
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white text-black font-sans relative overflow-x-hidden">
        <div
          className={`fixed inset-y-0 left-0 w-80 bg-white z-[100] transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-500 ease-in-out border-r border-gray-100 shadow-2xl`}
        >
          <div className="p-8">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="mb-12 hover:rotate-90 transition-transform duration-300"
            >
              <X size={24} strokeWidth={1} />
            </button>
            <h2 className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-8 font-light">
              Categories
            </h2>
            <ul className="space-y-6 text-sm uppercase tracking-[0.2em] font-light">
              {/* Linked categories to trigger filtered views */}
              <li onClick={() => setIsMenuOpen(false)}>
                <Link
                  to="/collection/men"
                  className="hover:pl-4 transition-all duration-300 cursor-pointer block"
                >
                  Men
                </Link>
              </li>
              <li onClick={() => setIsMenuOpen(false)}>
                <Link
                  to="/collection/women"
                  className="hover:pl-4 transition-all duration-300 cursor-pointer block"
                >
                  Women
                </Link>
              </li>
              <li onClick={() => setIsMenuOpen(false)}>
                <Link
                  to="/collection/kids"
                  className="hover:pl-4 transition-all duration-300 cursor-pointer block"
                >
                  Kids
                </Link>
              </li>
              <li className="hover:pl-4 transition-all duration-300 cursor-pointer border-t pt-6 border-gray-50 uppercase tracking-[0.2em]">
                Exclusive
              </li>
            </ul>
          </div>
        </div>

        <nav className="flex justify-between items-center px-12 py-8 border-b border-gray-100 uppercase tracking-[0.3em] text-[10px] bg-white sticky top-0 z-40">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={20} strokeWidth={1} />
            <span className="hidden md:inline group-hover:underline decoration-1 underline-offset-4">
              Menu
            </span>
          </div>
          <Link
            to="/"
            className="text-2xl tracking-[0.6em] font-bold absolute left-1/2 -translate-x-1/2"
          >
            LUXURY FIT
          </Link>
          <div className="flex gap-8 items-center">
            <Link
              to="/try-on"
              className="tracking-[0.3em] hover:text-gray-400 transition-colors font-light"
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

        <Routes>
          <Route
            path="/"
            element={
              <LandingPage garments={garments} setIsMenuOpen={setIsMenuOpen} />
            }
          />
          <Route path="/try-on" element={<FittingRoom />} />
          {/* Dynamic route to handle different category collections */}
          <Route
            path="/collection/:categoryName"
            element={<CategoryPage garments={garments} />}
          />
        </Routes>

        <footer className="py-20 border-t border-gray-100 text-center">
          <p className="text-[9px] uppercase tracking-[0.5em] text-gray-400">
            © 2026 Luxury Fit International
          </p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
