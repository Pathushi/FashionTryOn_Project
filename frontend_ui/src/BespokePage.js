import React, { useState, useEffect } from "react";
import { ChevronLeft, Check, Loader2 } from "lucide-react";
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

  // 1. Fetch all from Django
  useEffect(() => {
    fetch(
      `${API_BASE_URL}/api/tryon/bespoke-options/?category=${build.category}`,
    )
      .then((res) => res.json())
      .then((data) => setAttributes(data));
  }, [build.category]);

  // 2. Logic for Fabric Palette
  const fabricPalette = attributes.filter((attr) => attr.type === "FABRIC");
  const availableColors = [
    ...new Set(fabricPalette.map((f) => f.color).filter(Boolean)),
  ];
  const filteredFabrics = selectedColor
    ? fabricPalette.filter((f) => f.color === selectedColor)
    : fabricPalette;

  // 3. Match Finder logic
  const handleFindMatch = async () => {
    // Basic validation to ensure picked everything
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
        navigate("/try-on", { state: { garment: match } });
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
    <div className="min-h-screen bg-white text-black p-8 md:p-20 font-sans">
      {/* Navigation */}
      <nav className="mb-20">
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
              Select Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["SHIRT", "TROUSER", "SUIT"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setBuild({ ...build, category: cat });
                    setStep(2);
                  }}
                  className="border border-gray-100 py-12 text-[10px] tracking-[0.4em] uppercase hover:border-black transition-all"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: FABRIC SELECTION */}
        {step === 2 && (
          <div className="animate-in fade-in duration-700">
            <h2 className="text-[11px] uppercase tracking-[0.5em] mb-12 text-center text-gray-400">
              01. Choose Fabric
            </h2>

            {/* Color Sorter */}
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
              {filteredFabrics.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setBuild({ ...build, fabric: f })}
                  className={`cursor-pointer p-4 border transition-all ${build.fabric?.id === f.id ? "border-black" : "border-gray-50"}`}
                >
                  <img
                    src={f.image}
                    className="w-full aspect-square object-cover mb-4"
                    alt={f.name}
                  />
                  <p className="text-[9px] uppercase text-center tracking-widest">
                    {f.name}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-20 flex justify-center">
              <button
                disabled={!build.fabric}
                onClick={() => setStep(3)}
                className="border border-black px-16 py-4 text-[10px] uppercase tracking-[0.4em] hover:bg-black hover:text-white disabled:opacity-10 transition-all"
              >
                Continue to Features
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: VISUAL FEATURE SELECTION */}
        {step === 3 && (
          <div className="animate-in fade-in duration-700">
            <h2 className="text-[11px] uppercase tracking-[0.5em] mb-12 text-center text-gray-400">
              02. Refine Your Features
            </h2>

            <div className="max-w-4xl mx-auto space-y-20">
              {/* COLLAR SELECTOR */}
              <div className="space-y-6">
                <h3 className="text-[9px] uppercase tracking-[0.3em] text-gray-400 border-b pb-2 italic">
                  Select Collar Style
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {attributes
                    .filter((a) => a.type === "COLLAR")
                    .map((a) => (
                      <div
                        key={a.id}
                        onClick={() => setBuild({ ...build, collar: a.id })}
                        className={`cursor-pointer p-2 border transition-all ${build.collar === a.id ? "border-black bg-gray-50 shadow-sm" : "border-gray-100 hover:border-gray-300"}`}
                      >
                        <img
                          src={a.image}
                          className="w-full aspect-square object-contain"
                          alt={a.name}
                        />
                        <p className="text-[8px] uppercase mt-2 text-center tracking-tighter">
                          {a.name}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* CUFF SELECTOR */}
              <div className="space-y-6">
                <h3 className="text-[9px] uppercase tracking-[0.3em] text-gray-400 border-b pb-2 italic">
                  Select Cuff Style
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {attributes
                    .filter((a) => a.type === "CUFF")
                    .map((a) => (
                      <div
                        key={a.id}
                        onClick={() => setBuild({ ...build, cuff: a.id })}
                        className={`cursor-pointer p-2 border transition-all ${build.cuff === a.id ? "border-black bg-gray-50 shadow-sm" : "border-gray-100 hover:border-gray-300"}`}
                      >
                        <img
                          src={a.image}
                          className="w-full aspect-square object-contain"
                          alt={a.name}
                        />
                        <p className="text-[8px] uppercase mt-2 text-center tracking-tighter">
                          {a.name}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* BUTTON SELECTOR */}
              <div className="space-y-6">
                <h3 className="text-[9px] uppercase tracking-[0.3em] text-gray-400 border-b pb-2 italic">
                  Select Button Type
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {attributes
                    .filter((a) => a.type === "BUTTON")
                    .map((a) => (
                      <div
                        key={a.id}
                        onClick={() => setBuild({ ...build, button: a.id })}
                        className={`cursor-pointer p-2 border transition-all ${build.button === a.id ? "border-black bg-gray-50 shadow-sm" : "border-gray-100 hover:border-gray-300"}`}
                      >
                        <img
                          src={a.image}
                          className="w-full aspect-square object-contain"
                          alt={a.name}
                        />
                        <p className="text-[8px] uppercase mt-2 text-center tracking-tighter">
                          {a.name}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* MEASUREMENTS & FINAL ACTION */}
              <div className="pt-10 border-t border-gray-100">
                <div className="grid md:grid-cols-2 gap-12 items-end">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[9px] uppercase text-gray-400 mb-2 block font-mono">
                        Neck (cm)
                      </label>
                      <input
                        type="number"
                        className="w-full border-b py-2 text-xs outline-none focus:border-black"
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase text-gray-400 mb-2 block font-mono">
                        Chest (cm)
                      </label>
                      <input
                        type="number"
                        className="w-full border-b py-2 text-xs outline-none focus:border-black"
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleFindMatch}
                    disabled={matchingLoading}
                    className="w-full bg-black text-white py-6 text-[10px] uppercase tracking-[0.5em] flex justify-center items-center gap-4 hover:bg-gray-900 transition-colors"
                  >
                    {matchingLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      "Find & Try On"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BespokePage;
