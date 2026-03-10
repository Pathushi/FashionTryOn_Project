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
  RotateCcw,
  X,
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

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");

  const [garments, setGarments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [useCamera, setUseCamera] = useState(false);

  // Initialize slider at 100 so the generated image is fully visible
  const [sliderPos, setSliderPos] = useState(100);

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("tryon_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/tryon/garments/`)
      .then((res) => res.json())
      .then((data) => {
        setGarments(data);
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
        setSliderPos(100); // Start slider at the corner for the new image
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
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-gray-100 uppercase tracking-[0.2em] text-[9px] md:text-[10px] bg-white sticky top-0 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 hover:text-gray-400 transition-colors"
        >
          <ChevronLeft size={14} strokeWidth={1} /> <span>Gallery</span>
        </Link>
        <h1 className="text-sm md:text-lg tracking-[0.3em] font-light text-center flex-1">
          Virtual Fitting Room
        </h1>
        <div className="w-12 md:w-24"></div>
      </nav>

      <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden">
        {/* STEP 1: PHOTO SECTION */}
        <div className="w-full md:w-1/2 p-6 md:p-12 border-b md:border-b-0 md:border-r border-gray-50 flex flex-col bg-[#fafafa]">
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-[10px] uppercase tracking-[0.4em] mb-6 md:mb-8 text-gray-400">
              Step 1: Your Photo
            </h2>
            <div className="relative w-full aspect-[3/4] max-w-[280px] md:max-w-sm bg-white border border-gray-100 shadow-sm overflow-hidden mb-8 md:mb-12">
              {!userImage ? (
                useCamera ? (
                  <div className="h-full relative">
                    <button
                      onClick={() => setUseCamera(false)}
                      className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full shadow-sm"
                    >
                      <X size={16} />
                    </button>
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
                  <div className="h-full flex flex-col items-center justify-center gap-6">
                    <button
                      onClick={() => setUseCamera(true)}
                      className="flex items-center gap-3 text-[10px] uppercase tracking-widest hover:text-gray-500"
                    >
                      <Camera size={20} /> Open Camera
                    </button>
                    <label className="flex items-center gap-3 text-[10px] uppercase tracking-widest cursor-pointer hover:text-gray-500">
                      <Upload size={20} /> Browse File
                      <input type="file" hidden onChange={handleFileUpload} />
                    </label>
                  </div>
                )
              ) : (
                <div className="h-full relative">
                  <button
                    onClick={() => setUserImage(null)}
                    className="absolute top-4 right-4 z-10 bg-white/80 px-3 py-2 text-[9px] uppercase tracking-widest flex items-center gap-2"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                  <img
                    src={userImage}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {history.length > 0 && (
            <div className="w-full max-w-sm mx-auto border-t border-gray-200 pt-6">
              <h3 className="text-[9px] uppercase tracking-[0.3em] mb-4 text-gray-400 flex items-center gap-2">
                <History size={12} /> Recent Looks
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setResult(item.url);
                      setSliderPos(100);
                    }}
                    className="flex-shrink-0 w-14 md:w-16 aspect-[3/4] bg-white border border-gray-100 cursor-pointer overflow-hidden transition-all hover:border-black"
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

        {/* STEP 2: CUSTOMIZATION SECTION */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col md:overflow-y-auto">
          <h2 className="text-[10px] uppercase tracking-[0.4em] mb-8 text-gray-400 text-center md:text-left">
            Step 2: Customization
          </h2>
          {selectedGarment ? (
            <div className="mb-8 p-6 md:p-8 border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6 md:gap-8 mb-8">
                <div className="w-full sm:w-1/3 aspect-[3/4] bg-gray-50 overflow-hidden flex items-center justify-center">
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
                  <h3 className="text-xs md:text-sm tracking-widest uppercase mb-2">
                    {selectedGarment.name}
                  </h3>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-6">
                    {selectedGarment.fabric_type}
                  </p>
                  <div className="mb-6">
                    <p className="text-[9px] uppercase tracking-widest mb-3 text-gray-400">
                      Color
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {selectedGarment.variants?.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${selectedVariant?.id === variant.id ? "border-black scale-110" : "border-transparent"}`}
                          style={{ backgroundColor: variant.color_hex }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest mb-3 text-gray-400">
                      Size
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedGarment.available_sizes
                        ?.split(",")
                        .map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size.trim())}
                            className={`w-9 h-9 text-[10px] border transition-all ${selectedSize === size.trim() ? "bg-black text-white border-black" : "border-gray-200 text-gray-400"}`}
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
                className="text-[9px] uppercase tracking-widest text-gray-400 border-b border-transparent hover:border-black transition-all pb-1"
              >
                Change Garment
              </button>
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              <div className="relative mb-8">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="SEARCH..."
                  className="w-full pl-12 pr-4 py-4 text-[10px] uppercase border border-gray-100 outline-none focus:border-black"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 pb-20 md:pb-0">
                {filteredGarments.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedGarment(item);
                      if (item.variants && item.variants.length > 0)
                        setSelectedVariant(item.variants[0]);
                    }}
                    className={`relative aspect-[3/4] bg-gray-50 cursor-pointer border p-3 transition-all ${selectedGarment?.id === item.id ? "border-black" : "border-transparent"}`}
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
            </div>
          )}
          <div className="fixed bottom-0 left-0 w-full bg-white pt-4 pb-8 px-6 md:static md:p-0">
            <button
              onClick={handleGenerate}
              disabled={loading || !userImage || !selectedGarment}
              className="w-full bg-black text-white py-5 text-[10px] tracking-[0.4em] uppercase disabled:bg-gray-200 flex items-center justify-center gap-3"
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
      </div>

      {/* RESULT MODAL WITH COMPARISON SLIDER */}
      {result && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <div className="flex gap-8 absolute top-8 right-8">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 uppercase tracking-widest text-[9px] border-b border-black"
            >
              <Download size={14} /> Download
            </button>
            <button
              onClick={() => setResult(null)}
              className="uppercase tracking-widest text-[9px] border-b border-black"
            >
              Close
            </button>
          </div>

          <div className="max-w-[320px] md:max-w-md w-full aspect-[3/4] relative bg-white shadow-2xl overflow-hidden mt-8">
            {/* Before Layer */}
            <img
              src={userImage}
              alt="Before"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* After Layer with Clip-Path */}
            <div
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img
                src={
                  result.startsWith("http")
                    ? result
                    : `data:image/jpeg;base64,${result}`
                }
                alt="After"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Invisible Range Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />

            {/* Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-[1px] bg-white pointer-events-none z-10"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200">
                <div className="flex gap-1">
                  <div className="w-0.5 h-3 bg-gray-400"></div>
                  <div className="w-0.5 h-3 bg-gray-400"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Instruction text preserved below the image */}
          <p className="mt-8 text-[9px] uppercase tracking-[0.5em] text-gray-400 italic font-light">
            Swipe slider to compare before & after
          </p>
        </div>
      )}
    </div>
  );
};

export default FittingRoom;
