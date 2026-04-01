import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  ChevronLeft,
  Camera,
  Loader2,
  Upload,
  RotateCcw,
  X,
  CheckCircle2,
  Info,
  Download,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000";

const BespokeFittingRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [sliderPos, setSliderPos] = useState(100);
  const [selectedGarment] = useState(location.state?.garment || null);

  const handleCapture = () => {
    setUserImage(webcamRef.current.getScreenshot());
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
      return alert("Please upload your photo first.");

    setLoading(true);
    setResult(null);

    try {
      const base64Response = await fetch(userImage);
      const blob = await base64Response.blob();
      const formData = new FormData();
      formData.append("image", blob, "user_bespoke.jpg");
      formData.append("garment_url", selectedGarment.image);

      const response = await fetch(`${API_BASE_URL}/api/tryon/generate/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // The backend returns the image in 'data.url', 'data.image', or 'data.output'
      let finalResult = data.url || data.image || data.output;

      if (finalResult) {
        // ERROR FIX: Check if the string is a URL.
        // If it's a Base64 string (starts with /9j/), add the prefix.
        if (
          typeof finalResult === "string" &&
          !finalResult.startsWith("http")
        ) {
          finalResult = `data:image/jpeg;base64,${finalResult}`;
        }

        setResult(finalResult);
        setSliderPos(100);
      } else {
        alert("AI Error: " + (data.error || "Generation failed."));
      }
    } catch (err) {
      alert("Connection failed. Please ensure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-gray-100 uppercase tracking-[0.2em] text-[10px] bg-white sticky top-0 z-50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 hover:text-gray-400"
        >
          <ChevronLeft size={14} /> <span>Back to Design</span>
        </button>
        <h1 className="text-sm md:text-lg tracking-[0.3em] font-light text-center flex-1">
          Bespoke Fitting Room
        </h1>
        <div className="w-12 md:w-24 text-right">
          <span className="text-[8px] px-2 py-1 tracking-widest bg-black text-white">
            BESPOKE
          </span>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden">
        <div className="w-full md:w-1/2 p-6 md:p-12 border-b md:border-b-0 md:border-r border-gray-50 flex flex-col bg-[#fafafa] items-center justify-center">
          <h2 className="text-[10px] uppercase tracking-[0.4em] mb-6 md:mb-8 text-gray-400">
            Step 1: Your Photo
          </h2>
          <div className="relative w-full aspect-[3/4] max-w-[280px] md:max-w-sm bg-white border border-gray-100 shadow-sm overflow-hidden mb-8">
            {!userImage ? (
              useCamera ? (
                <div className="h-full relative">
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
                  <button
                    onClick={() => setUseCamera(false)}
                    className="absolute top-4 left-4 bg-white/80 p-2 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-6">
                  <button
                    onClick={() => setUseCamera(true)}
                    className="flex items-center gap-3 text-[10px] tracking-widest uppercase hover:text-gray-500"
                  >
                    <Camera size={20} /> Open Camera
                  </button>
                  <label className="flex items-center gap-3 text-[10px] tracking-widest uppercase cursor-pointer hover:text-gray-500">
                    <Upload size={20} /> Browse File{" "}
                    <input type="file" hidden onChange={handleFileUpload} />
                  </label>
                </div>
              )
            ) : (
              <div className="h-full relative">
                <img
                  src={userImage}
                  className="w-full h-full object-cover"
                  alt="User"
                />
                <button
                  onClick={() => setUserImage(null)}
                  className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow-sm"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !userImage}
            className="w-full max-w-[280px] md:max-w-sm bg-black text-white py-4 md:py-5 text-[10px] tracking-[0.4em] uppercase flex items-center justify-center gap-3 disabled:bg-gray-200 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Generating...
              </>
            ) : (
              "Generate AI Try-On"
            )}
          </button>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-[340px] mx-auto w-full">
            <div className="flex items-center gap-2 mb-6">
              <Info size={14} className="text-gray-300" />
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-medium">
                Digital Tailoring
              </h2>
            </div>
            <h3 className="text-sm md:text-base font-light tracking-widest uppercase mb-8 border-b border-gray-50 pb-4">
              Photo Guidelines
            </h3>
            <div className="space-y-6">
              {[
                [
                  "Lighting",
                  "Natural, front-facing light ensures the most realistic fabric rendering.",
                ],
                [
                  "Background",
                  "A plain, neutral background allows our engine to map edges precisely.",
                ],
                [
                  "Pose",
                  "Stand straight with arms slightly away from sides for a natural drape.",
                ],
              ].map(([label, text]) => (
                <div key={label} className="flex gap-4">
                  <CheckCircle2
                    size={16}
                    className="text-black shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest mb-1 font-semibold">
                      {label}
                    </p>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-light">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <div className="flex gap-8 absolute top-8 right-8">
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = result;
                link.download = `tryon-${Date.now()}.jpg`;
                link.click();
              }}
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
          <div className="max-w-[320px] md:max-w-md w-full aspect-[3/4] relative shadow-2xl overflow-hidden mt-8 bg-white">
            <img
              src={userImage}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Original"
            />
            <div
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img
                src={result}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Result"
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
            <div
              className="absolute top-0 bottom-0 w-[1px] bg-white z-10"
              style={{ left: `${sliderPos}%` }}
            />
          </div>
          <p className="mt-8 text-[9px] uppercase tracking-[0.5em] text-gray-400 italic">
            Swipe to compare
          </p>
        </div>
      )}
    </div>
  );
};

export default BespokeFittingRoom;
