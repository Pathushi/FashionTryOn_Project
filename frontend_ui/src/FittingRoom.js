import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import {
  ChevronLeft,
  Camera,
  Loader2,
  Upload,
  Search,
  Check,
  History,
  Download,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000";

const FittingRoom = () => {
  const location = useLocation();
  const webcamRef = useRef(null);

  const [userImage, setUserImage] = useState(null);
  const [selectedGarment, setSelectedGarment] = useState(
    location.state?.garment || null,
  );

  // Day 03: Variant States (Now using objects from DB)
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");

  const [garments, setGarments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [useCamera, setUseCamera] = useState(false);

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("tryon_history");
    return saved ? JSON.parse(saved) : [];
  });

  // Fetching data and setting initial variant
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/tryon/garments/`)
      .then((res) => res.json())
      .then((data) => {
        setGarments(data);
        // If coming from Gallery, auto-select first variant
        if (location.state?.garment) {
          const garment = location.state.garment;
          if (garment.variants && garment.variants.length > 0) {
            setSelectedVariant(garment.variants[0]);
          }
        }
      })
      .catch((err) => console.error("Database error:", err));
  }, [location.state?.garment]);

  const filteredGarments = garments.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setUserImage(imageSrc);
    setUseCamera(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setUserImage(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = result.startsWith("http")
      ? result
      : `data:image/jpeg;base64,${result}`;
    link.download = `virtual-tryon-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerate = async () => {
    if (!userImage || !selectedGarment) return alert("Please provide both!");
    setLoading(true);
    setResult(null);

    try {
      const base64Response = await fetch(userImage);
      const blob = await base64Response.blob();
      const formData = new FormData();
      formData.append("image", blob, "user_selfie.jpg");

      // Day 03 Logic: Use the variant image URL for the AI try-on
      const finalGarmentUrl = selectedVariant
        ? selectedVariant.variant_image
        : selectedGarment.image;
      formData.append("garment_url", finalGarmentUrl);

      const response = await fetch(`${API_BASE_URL}/api/tryon/generate/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const finalResult = data.url || data.image || data.output;

      if (finalResult) {
        setResult(finalResult);
        const newEntry = {
          url: finalResult,
          date: new Date().toLocaleTimeString(),
        };
        const updatedHistory = [newEntry, ...history].slice(0, 5);
        setHistory(updatedHistory);
        localStorage.setItem("tryon_history", JSON.stringify(updatedHistory));
      } else {
        alert("AI Error: " + (data.error || "Generation failed."));
      }
    } catch (err) {
      alert("Connection failed. Check Django.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col overflow-hidden">
      <nav className="flex justify-between items-center px-12 py-6 border-b border-gray-100 uppercase tracking-[0.3em] text-[10px] bg-white sticky top-0 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 hover:text-gray-400 transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={1} /> Back to Gallery
        </Link>
        <h1 className="text-lg tracking-[0.5em] font-light text-center flex-1">
          Virtual Fitting Room
        </h1>
        <div className="w-24"></div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT COLUMN: User Photo */}
        <div className="w-1/2 p-12 border-r border-gray-50 flex flex-col bg-[#fafafa] overflow-y-auto">
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-[10px] uppercase tracking-[0.4em] mb-8 text-gray-400">
              Step 1: Your Photo
            </h2>
            <div className="relative w-full aspect-[3/4] max-w-sm bg-white border border-gray-100 shadow-sm overflow-hidden mb-12">
              {!userImage ? (
                useCamera ? (
                  <div className="h-full">
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={handleCapture}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black text-white p-4 rounded-full shadow-xl"
                    >
                      <Camera size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-4">
                    <button
                      onClick={() => setUseCamera(true)}
                      className="flex items-center gap-3 text-[10px] uppercase tracking-widest hover:text-gray-500"
                    >
                      <Camera size={18} /> Open Camera
                    </button>
                    <label className="flex items-center gap-3 text-[10px] uppercase tracking-widest cursor-pointer hover:text-gray-500">
                      <Upload size={18} /> Browse File
                      <input type="file" hidden onChange={handleFileUpload} />
                    </label>
                  </div>
                )
              ) : (
                <img
                  src={userImage}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
          {/* History */}
          {history.length > 0 && (
            <div className="w-full max-w-sm mx-auto border-t border-gray-200 pt-8">
              <h3 className="text-[9px] uppercase tracking-[0.3em] mb-4 text-gray-400 flex items-center gap-2">
                <History size={12} /> Recent Generations
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-4">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setResult(item.url)}
                    className="flex-shrink-0 w-16 aspect-[3/4] bg-white border border-gray-100 cursor-pointer hover:border-black transition-colors overflow-hidden"
                  >
                    <img
                      src={
                        item.url.startsWith("http")
                          ? item.url
                          : `data:image/jpeg;base64,${item.url}`
                      }
                      className="w-full h-full object-cover"
                      alt="History"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Garment Selection & Manual Variants */}
        <div className="w-1/2 p-12 flex flex-col overflow-y-auto">
          <h2 className="text-[10px] uppercase tracking-[0.4em] mb-8 text-gray-400">
            Step 2: Selection & Customization
          </h2>

          {selectedGarment ? (
            <div className="mb-12 p-8 border border-gray-100 bg-white shadow-sm animate-in fade-in slide-in-from-right-4">
              <div className="flex gap-8 mb-8">
                <div className="w-1/3 aspect-[3/4] bg-gray-50 overflow-hidden flex items-center justify-center">
                  <img
                    src={
                      selectedVariant
                        ? selectedVariant.variant_image
                        : selectedGarment.image
                    }
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm tracking-widest uppercase mb-2">
                    {selectedGarment.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">
                    {selectedGarment.fabric_type}
                  </p>

                  {/* Color Palette (Dynamic from Variants) */}
                  <div className="mb-6">
                    <p className="text-[9px] uppercase tracking-widest mb-3 text-gray-400">
                      Select Color
                    </p>
                    <div className="flex gap-3">
                      {selectedGarment.variants?.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${selectedVariant?.id === variant.id ? "border-black scale-110" : "border-transparent"}`}
                          style={{ backgroundColor: variant.color_hex }}
                          title={variant.color_name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <p className="text-[9px] uppercase tracking-widest mb-3 text-gray-400">
                      Select Size
                    </p>
                    <div className="flex gap-2">
                      {selectedGarment.available_sizes
                        ?.split(",")
                        .map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size.trim())}
                            className={`w-10 h-10 text-[10px] border transition-all ${selectedSize === size.trim() ? "bg-black text-white border-black" : "border-gray-200 text-gray-400"}`}
                          >
                            {size.trim()}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedGarment(null);
                  setSelectedVariant(null);
                }}
                className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-black"
              >
                Change Garment
              </button>
            </div>
          ) : (
            <>
              <div className="relative mb-8">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="SEARCH BY NAME..."
                  className="w-full pl-12 pr-4 py-4 text-[10px] uppercase tracking-widest border border-gray-100 outline-none focus:border-black"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 flex-1">
                {filteredGarments.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedGarment(item);
                      if (item.variants && item.variants.length > 0) {
                        setSelectedVariant(item.variants[0]);
                      }
                    }}
                    className={`relative aspect-[3/4] bg-gray-50 cursor-pointer border p-4 transition-all ${selectedGarment?.id === item.id ? "border-black" : "border-transparent"}`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                    {selectedGarment?.id === item.id && (
                      <div className="absolute top-2 right-2 bg-black text-white p-1 rounded-full">
                        <Check size={10} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !userImage || !selectedGarment}
            className="mt-12 bg-black text-white py-6 text-[10px] tracking-[0.4em] uppercase disabled:bg-gray-200 transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Processing...
              </>
            ) : (
              "Generate Try-On"
            )}
          </button>
        </div>
      </div>

      {/* Result Modal */}
      {result && (
        <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-12">
          <div className="flex gap-8 absolute top-12 right-12">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 uppercase tracking-widest text-[10px] border-b border-black hover:text-gray-400"
            >
              <Download size={14} /> Download Result
            </button>
            <button
              onClick={() => setResult(null)}
              className="uppercase tracking-widest text-[10px] border-b border-black hover:text-gray-400"
            >
              Close Result
            </button>
          </div>
          <div className="max-w-md w-full aspect-[3/4] bg-white shadow-2xl overflow-hidden">
            <img
              src={
                result.startsWith("http")
                  ? result
                  : `data:image/jpeg;base64,${result}`
              }
              alt="AI Result"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="mt-8 text-[10px] uppercase tracking-[0.5em] text-gray-400 italic font-light">
            AI Enhanced Virtual Fitting
          </p>
        </div>
      )}
    </div>
  );
};

export default FittingRoom;
