import React, { useState, useRef, useEffect } from "react";
import {
  RotateCcw,
  Palette,
  Type,
  Image as ImageIcon,
  Video,
  Play,
  Pause,
  Download,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import ImageUpload from "./ImageUpload";
import TextControls from "./TextControls";
import DraggableText from "./DraggableText";
import {
  drawImageOnlyOnCanvas,
  drawMemeOnCanvas,
  drawMemeOnVideo,
} from "../utils/canvas";
import AIMemeGenerator from "./AIMemeGenerator";

const MemeGenerator = ({ preselectedTemplate }) => {
  const [selectedImage, setSelectedImage] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [isPlaying, setIsPlaying] = useState(false);

  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const [texts, setTexts] = useState([
    {
      id: "top",
      content: "TOP TEXT",
      fontSize: 48,
      fontWeight: 700,
      color: "#FFFFFF",
      stroke: "#000000",
      strokeWidth: 3,
      x: 50,
      y: 10,
    },
    {
      id: "bottom",
      content: "BOTTOM TEXT",
      fontSize: 48,
      fontWeight: 700,
      color: "#FFFFFF",
      stroke: "#000000",
      strokeWidth: 3,
      x: 50,
      y: 90,
    },
  ]);

  const previewRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (preselectedTemplate) handleImageSelect(preselectedTemplate);
  }, [preselectedTemplate]);

  const handleImageSelect = (url) => {
    setSelectedImage(url);
    if (/\.(mp4|webm|ogg|mov)$/i.test(url)) {
      setMediaType("video");
    } else if (/\.gif$/i.test(url)) {
      setMediaType("gif");
      loadImage(url);
    } else {
      setMediaType("image");
      loadImage(url);
    }
  };

  const loadImage = (url) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      drawImageOnlyOnCanvas(previewRef.current, img);
    };
    img.onerror = () => {
      imageRef.current = null;
    };
    img.src = url;
  };

  useEffect(() => {
    if (mediaType === "video") {
      updateVideoFrame();
    } else if (imageRef.current && previewRef.current) {
      drawImageOnlyOnCanvas(previewRef.current, imageRef.current);
    } else if (selectedImage) {
      loadImage(selectedImage);
    }
  }, [texts, mediaType, selectedImage]);

  const updateVideoFrame = () => {
    if (!videoRef.current || !previewRef.current) return;
    const video = videoRef.current;
    const canvas = previewRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = Math.min(video.videoWidth, 600);
        canvas.height = Math.min(video.videoHeight, 600);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        drawMemeOnVideo(canvas, texts);
      }
      if (isPlaying) animRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) draw();
    else {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = Math.min(video.videoWidth, 600);
        canvas.height = Math.min(video.videoHeight, 600);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        drawMemeOnVideo(canvas, texts);
      }
    }
  };

  const requireSignIn = (action) => {
    if (!isSignedIn) {
      openSignIn({ redirectUrl: window.location.href });
      return;
    }
    action();
  };

  const togglePlayPause = () =>
    requireSignIn(() => {
      if (!videoRef.current) return;
      if (isPlaying) {
        videoRef.current.pause();
        cancelAnimationFrame(animRef.current);
      } else {
        videoRef.current.play();
      }
      setIsPlaying((p) => !p);
    });

  const resetMeme = () =>
    requireSignIn(() => {
      setTexts((prev) =>
        prev.map((t) =>
          t.id === "top"
            ? { ...t, content: "TOP TEXT", x: 50, y: 10 }
            : { ...t, content: "BOTTOM TEXT", x: 50, y: 90 }
        )
      );
      setIsPlaying(false);
      cancelAnimationFrame(animRef.current);
    });

  const downloadMeme = () =>
    requireSignIn(() => {
      if (!previewRef.current || !imageRef.current) return;
      drawMemeOnCanvas(previewRef.current, imageRef.current, texts);
      const link = document.createElement("a");
      link.download = `meme-${Date.now()}.png`;
      link.href = previewRef.current.toDataURL("image/png");
      link.click();
    });

  const handleCommit = ({ id, x, y }) => {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, x, y } : t)));
  };

  const handleVideoLoaded = () => updateVideoFrame();

  const handleAICaptionSelect = (caption, position = "top") =>
    requireSignIn(() => {
      setTexts((prev) =>
        prev.map((t) => (t.id === position ? { ...t, content: caption } : t))
      );
    });

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4 py-6">
      {/* Left */}
      <div className="w-full lg:w-1/4">
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            {mediaType === "video" ? (
              <Video className="h-6 w-6 text-blue-600" />
            ) : (
              <ImageIcon className="h-6 w-6 text-blue-600" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">
              Choose Media
            </h3>
          </div>
          <ImageUpload
            onImageSelect={(url) => requireSignIn(() => handleImageSelect(url))}
            onViewMoreTemplates={() =>
              window.dispatchEvent(new CustomEvent("viewMoreTemplates"))
            }
          />
        </div>

        {/* AI Prompt-to-Meme */}
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200 mt-5">
          <AIMemeGenerator
            onMemeGenerated={(imageUrl) =>
              requireSignIn(() => handleImageSelect(imageUrl))
            }
          />
        </div>
      </div>

      {/* Middle */}
      <div className="flex-1 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-4 w-full justify-between max-w-[600px]">
          <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
          {mediaType === "video" && selectedImage && (
            <button
              onClick={togglePlayPause}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Play
                </>
              )}
            </button>
          )}
        </div>

        {selectedImage ? (
          <>
            <div className="relative">
              {mediaType === "video" && (
                <video
                  ref={videoRef}
                  src={selectedImage}
                  className="hidden"
                  onLoadedMetadata={handleVideoLoaded}
                  onTimeUpdate={updateVideoFrame}
                  loop
                  muted
                />
              )}

              <canvas
                ref={previewRef}
                className="w-full max-w-[600px] max-h-[550px] rounded-xl shadow-lg border border-gray-300"
                width={600}
                height={600}
              />

              {/* HTML Overlay for Draggable Text */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  pointerEvents: "none",
                  width: 600,
                  height: 600,
                }}
              >
                {texts.map((t) => (
                  <DraggableText
                    key={t.id}
                    textObj={t}
                    onCommit={handleCommit}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={downloadMeme}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
              >
                <Download className="h-4 w-4" /> Download Meme
              </button>
              <button
                onClick={resetMeme}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>
          </>
        ) : (
          <div className="w-full max-w-lg h-96 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-base text-gray-600 font-medium">
                Select media to start
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Images, videos, GIFs supported
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/4 space-y-5">
        {/* Text Controls */}
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Type className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Text Settings
            </h3>
          </div>
          <div className="space-y-5">
            {texts.map((t) => (
              <TextControls
                key={t.id}
                text={t}
                onChange={(newVal) =>
                  requireSignIn(() =>
                    setTexts((prev) =>
                      prev.map((x) => (x.id === t.id ? newVal : x))
                    )
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={resetMeme}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGenerator;
