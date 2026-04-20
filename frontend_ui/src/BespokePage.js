import React, { useState, useEffect } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000";

const BespokePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [attributes, setAttributes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [matchingLoading, setMatchingLoading] = useState(false);

  const [build, setBuild] = useState({
    category: "SHIRT",
    fabric: null,
    collar: null,
    cuff: null,
    button: null,
  });

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/api/tryon/bespoke-options/?category=${build.category}`,
    )
      .then((res) => res.json())
      .then((data) => setAttributes(data));
  }, [build.category]);

  const fabricPalette = attributes.filter((attr) => attr.type === "FABRIC");
  const availableColors = [
    ...new Set(fabricPalette.map((f) => f.color).filter(Boolean)),
  ];
  const filteredFabrics = selectedColor
    ? fabricPalette.filter((f) => f.color === selectedColor)
    : fabricPalette;

  const handleFindMatch = async () => {
    if (!build.fabric || !build.collar || !build.cuff || !build.button) {
      return alert(
        "Please select all features: Fabric, Collar, Cuff, and Button style.",
      );
    }

    setMatchingLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tryon/find-match/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fabric_id: build.fabric.id,
          collar_id: build.collar,
          cuff_id: build.cuff,
          button_id: build.button,
          category: build.category,
        }),
      });

      const match = await response.json();
      if (response.ok) {
        navigate("/bespoke-try-on", { state: { garment: match } });
      } else {
        alert(
          match.error ||
            "This exact combination is not available in our collection yet.",
        );
      }
    } catch (err) {
      alert("Connection error. Please try again.");
    } finally {
      setMatchingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-8 md:p-20 font-sans text-center">
      <nav className="mb-20 text-left">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}
          className="text-[10px] uppercase tracking-[0.3em] flex items-center gap-2"
        >
          <ChevronLeft size={14} strokeWidth={1} /> {step > 1 ? "Back" : "Home"}
        </button>
      </nav>

      <div className="max-w-6xl mx-auto">
        {/* STEP 1: CATEGORY SELECTION */}
        {step === 1 && (
          <div className="animate-in fade-in duration-700">
            <h2 className="text-[11px] uppercase tracking-[0.5em] mb-16 text-center text-gray-400 italic">
              Select Type of Clothing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["SHIRT", "TROUSER", "SUIT"].map((cat) => {
                const isComingSoon = cat === "TROUSER" || cat === "SUIT";
                return (
                  <button
                    key={cat}
                    disabled={isComingSoon}
                    onClick={() => {
                      setBuild({ ...build, category: cat });
                      setStep(2);
                    }}
                    className={`relative border py-12 text-[10px] tracking-[0.4em] uppercase transition-all flex flex-col items-center justify-center gap-2 overflow-hidden ${
                      isComingSoon
                        ? "border-gray-100 bg-gray-50/50 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 text-black hover:border-black bg-white shadow-sm hover:shadow-md"
                    }`}
                  >
                    <span className={isComingSoon ? "opacity-50" : "font-bold"}>
                      {cat}
                    </span>
                    {isComingSoon && (
                      <div className="absolute top-0 right-0">
                        <span className="bg-gray-200 text-gray-600 text-[7px] px-2 py-1 tracking-[0.2em] font-bold uppercase">
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: FULL UNIFIED DESIGN PAGE */}
        {step === 2 && (
          <div className="animate-in fade-in duration-700 space-y-24">
            {/* 01. FABRIC SECTION */}
            <section>
              <h2 className="text-[11px] uppercase tracking-[0.5em] mb-12 text-center text-gray-400">
                01. Choose Fabric
              </h2>
              <div className="flex justify-center gap-4 mb-16">
                <button
                  onClick={() => setSelectedColor(null)}
                  className={`text-[9px] uppercase tracking-widest px-4 border ${!selectedColor ? "border-black" : "border-gray-100"}`}
                >
                  All
                </button>
                {availableColors.map((hex) => (
                  <button
                    key={hex}
                    onClick={() => setSelectedColor(hex)}
                    className={`w-6 h-6 rounded-full border ${selectedColor === hex ? "ring-2 ring-black ring-offset-2" : ""}`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                {filteredFabrics.map((f, index) => {
                  const isLocked = index >= 2;
                  return (
                    <div
                      key={f.id}
                      onClick={() =>
                        !isLocked && setBuild({ ...build, fabric: f })
                      }
                      className={`relative cursor-pointer p-4 border transition-all ${
                        isLocked
                          ? "opacity-40 grayscale cursor-not-allowed border-gray-100"
                          : build.fabric?.id === f.id
                            ? "border-black shadow-md"
                            : "border-gray-50 hover:border-gray-300"
                      }`}
                    >
                      {isLocked && (
                        <span className="absolute top-2 right-2 text-[7px] bg-gray-100 px-1 uppercase tracking-tighter">
                          soon
                        </span>
                      )}
                      <img
                        src={f.image}
                        className="w-full aspect-square object-cover mb-4"
                        alt={f.name}
                      />
                      <p className="text-[9px] uppercase text-center tracking-widest">
                        {f.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 02. DYNAMIC ATTRIBUTE SECTIONS (Collar, Cuff, Button) */}
            {["COLLAR", "CUFF", "BUTTON"].map((type, index) => (
              <section key={type} className="pt-12 border-t border-gray-50">
                <h2 className="text-[11px] uppercase tracking-[0.5em] mb-12 text-center text-gray-400">
                  0{index + 2}. Select {type}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                  {attributes
                    .filter((a) => a.type === type)
                    .map((a, idx) => {
                      const isLocked = idx >= 1;
                      return (
                        <div
                          key={a.id}
                          onClick={() =>
                            !isLocked &&
                            setBuild({ ...build, [type.toLowerCase()]: a.id })
                          }
                          className={`relative cursor-pointer p-4 border transition-all ${
                            isLocked
                              ? "opacity-40 grayscale cursor-not-allowed border-gray-100"
                              : build[type.toLowerCase()] === a.id
                                ? "border-black shadow-md bg-gray-50/30"
                                : "border-gray-50 hover:border-gray-300"
                          }`}
                        >
                          {isLocked && (
                            <span className="absolute top-2 right-2 text-[7px] bg-gray-100 px-1 uppercase tracking-tighter">
                              soon
                            </span>
                          )}
                          <img
                            src={a.image}
                            className="w-full aspect-square object-contain mb-4"
                            alt={a.name}
                          />
                          <p className="text-[9px] uppercase text-center tracking-widest">
                            {a.name}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </section>
            ))}

            {/* FINAL ACTION SECTION */}
            <div className="pt-20 border-t border-gray-100 flex flex-col items-center gap-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest italic">
                Ready to visualize your custom design?
              </p>
              <button
                onClick={handleFindMatch}
                disabled={matchingLoading}
                className="w-full max-w-md bg-black text-white py-6 text-[10px] uppercase tracking-[0.5em] flex justify-center items-center gap-4 hover:bg-gray-900 transition-colors shadow-lg disabled:bg-gray-200"
              >
                {matchingLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Try On"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BespokePage;
