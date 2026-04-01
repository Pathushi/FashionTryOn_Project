import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Camera, ChevronLeft, ShoppingBag, Loader2 } from "lucide-react";

const CategoryPage = ({ garments }) => {
  const { categoryName } = useParams();

  // 1. New State for sub-filtering (SHIRT, TROUSER, or ALL)
  const [activeSubCategory, setActiveSubCategory] = useState("ALL");

  // 2. Updated Filter Logic: Checks Gender AND the selected Sub-Category
  const filteredGarments = garments.filter((item) => {
    const matchesGender =
      item.gender &&
      item.gender.trim().toUpperCase() === categoryName.trim().toUpperCase();

    const matchesSubCat =
      activeSubCategory === "ALL" ||
      (item.category && item.category.toUpperCase() === activeSubCategory);

    return matchesGender && matchesSubCat;
  });

  if (garments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2
          className="animate-spin text-gray-200"
          size={32}
          strokeWidth={1}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Category Header */}
      <header className="px-12 py-12 border-b border-gray-50 flex justify-between items-center sticky top-0 bg-white z-50">
        <Link
          to="/"
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] hover:text-gray-400 transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={1} /> Back
        </Link>

        <h2 className="text-xl tracking-[0.5em] uppercase font-light">
          {categoryName} Collection
        </h2>

        <div className="flex gap-6">
          <ShoppingBag size={18} strokeWidth={1} className="cursor-pointer" />
        </div>
      </header>

      {/* SUB-CATEGORY FILTER BAR */}
      <div className="flex justify-center gap-8 py-8 border-b border-gray-50">
        {["ALL", "SHIRT", "TROUSER", "SUIT", "TSHIRT"].map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveSubCategory(sub)}
            className={`text-[10px] uppercase tracking-[0.3em] pb-1 transition-all ${
              activeSubCategory === sub
                ? "border-b border-black text-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            {sub === "TSHIRT" ? "T-Shirts" : sub}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto px-8 py-16">
        {filteredGarments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredGarments.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] bg-[#f9f9f9] overflow-hidden flex items-center justify-center p-8">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
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
                  <h3 className="text-[11px] tracking-[0.2em] uppercase font-medium">
                    {item.name}
                  </h3>
                  <p className="text-[11px] mt-2 font-light text-gray-500 font-mono">
                    LKR {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
              No{" "}
              {activeSubCategory !== "ALL"
                ? activeSubCategory.toLowerCase() + "s"
                : "items"}{" "}
              found in this selection.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
