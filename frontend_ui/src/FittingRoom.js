import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import {
  ChevronLeft,
  Camera,
  Loader2,
  Upload,
  Search,
  Check,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Replaced NGROK_URL with your local Django server address
const API_BASE_URL = "http://127.0.0.1:8000";

const FittingRoom = () => {
  const location = useLocation();
  const webcamRef = useRef(null);

  const [userImage, setUserImage] = useState(null);
  const [selectedGarment, setSelectedGarment] = useState(
    location.state?.garment || null,
  );
  const [garments, setGarments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [useCamera, setUseCamera] = useState(false);

  // Now fetching directly from your local machine
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/tryon/garments/`)
      .then((res) => res.json())
      .then((data) => setGarments(data))
      .catch((err) => console.error("Database error:", err));
  }, []);

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

  const handleGenerate = async () => {
    if (!userImage || !selectedGarment)
      return alert("Please provide both a photo and a garment!");
    setLoading(true);
    setResult(null);

    try {
      const base64Response = await fetch(userImage);
      const blob = await base64Response.blob();

      const formData = new FormData();
      formData.append("image", blob, "user_selfie.jpg");

      // This will now send a local URL (e.g., http://127.0.0.1:8000/media/...)
      formData.append("garment_url", selectedGarment.image);

      const response = await fetch(`${API_BASE_URL}/api/tryon/generate/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        setResult(data.url);
      } else {
        console.error("AI Full Response:", data);
        alert("AI Error: " + (data.error || "Could not find image URL."));
      }
    } catch (err) {
      alert("Connection failed. Ensure Django is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const filteredGarments = garments.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
        <div className="w-1/2 p-12 border-r border-gray-50 flex flex-col items-center justify-center bg-[#fafafa]">
          <h2 className="text-[10px] uppercase tracking-[0.4em] mb-8 text-gray-400">
            Step 1: Your Photo
          </h2>
          <div className="relative w-full aspect-[3/4] max-w-sm bg-white border border-gray-100 shadow-sm overflow-hidden group">
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
                    <Camera size={18} strokeWidth={1} /> Open Camera
                  </button>
                  <label className="flex items-center gap-3 text-[10px] uppercase tracking-widest cursor-pointer hover:text-gray-500">
                    <Upload size={18} strokeWidth={1} /> Browse File
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
            {userImage && (
              <button
                onClick={() => setUserImage(null)}
                className="absolute top-4 right-4 text-[9px] uppercase tracking-tighter bg-white/80 px-2 py-1 backdrop-blur-sm"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="w-1/2 p-12 flex flex-col">
          <h2 className="text-[10px] uppercase tracking-[0.4em] mb-8 text-gray-400">
            Step 2: Select Apparel
          </h2>
          <div className="relative mb-8">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
              size={16}
            />
            <input
              type="text"
              placeholder="SEARCH BY NAME..."
              className="w-full pl-12 pr-4 py-4 text-[10px] uppercase tracking-widest border border-gray-100 outline-none focus:border-black transition-colors"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 overflow-y-auto pr-4 flex-1">
            {filteredGarments.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedGarment(item)}
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

      {result && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-12">
          <button
            onClick={() => setResult(null)}
            className="absolute top-12 right-12 uppercase tracking-widest text-[10px] border-b border-black"
          >
            Close Result
          </button>
          <div className="max-w-md w-full aspect-[3/4] bg-gray-50 shadow-2xl overflow-hidden">
            <img
              src={result}
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
