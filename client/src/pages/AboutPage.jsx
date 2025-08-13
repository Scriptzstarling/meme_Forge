import React from "react";
import PropTypes from "prop-types";
import {
  ArrowLeft,
  Zap,
  Palette,
  Users,
  Download,
  Image as ImageIcon,
  Sparkles,
  TrendingUp,
  Share2,
} from "lucide-react";

const AboutPage = ({ onBackToHome }) => {
  const features = [
    {
      icon: <Zap className="w-10 h-10 text-yellow-500" />,
      title: "AI-Powered Captions",
      desc: "Generate witty, savage, or wholesome captions in seconds using advanced AI models.",
    },
    {
      icon: <Palette className="w-10 h-10 text-pink-500" />,
      title: "Customizable Designs",
      desc: "Drag, resize, style, and position text freely to match your creative vision.",
    },
    {
      icon: <ImageIcon className="w-10 h-10 text-purple-500" />,
      title: "Vast Template Library",
      desc: "Access hundreds of trending meme templates or upload your own images instantly.",
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-green-500" />,
      title: "Trending Memes",
      desc: "Stay up-to-date with the latest viral meme formats and cultural trends.",
    },
    {
      icon: <Share2 className="w-10 h-10 text-blue-500" />,
      title: "One-Click Sharing",
      desc: "Share memes directly to Instagram, Twitter, Reddit, and more without leaving the app.",
    },
    {
      icon: <Sparkles className="w-10 h-10 text-indigo-500" />,
      title: "AI Image Enhancements",
      desc: "Upscale, enhance, or remove watermarks from images for a polished final meme.",
    },
    {
      icon: <Users className="w-10 h-10 text-teal-500" />,
      title: "Collaborative Editing",
      desc: "Work on memes together in real time with friends or your creative team.",
    },
    {
      icon: <Download className="w-10 h-10 text-orange-500" />,
      title: "Multiple Export Formats",
      desc: "Download in JPG, PNG, or MP4 format for maximum compatibility.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 px-6 py-10">
      {/* Back Button */}
      <button
        onClick={onBackToHome}
        className="mb-8 flex items-center gap-2 text-purple-700 hover:text-purple-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-5xl font-extrabold text-purple-800 mb-4">
          Welcome to Meme Forge
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Where creativity meets technology. Meme Forge is the ultimate platform
          to create, customize, and share memes like never before — powered by AI,
          loaded with templates, and designed for both casual fun and professional
          content creators.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="flex justify-center mb-4">{f.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          Ready to Forge Your First Meme?
        </h2>
        <p className="text-gray-700 mb-6">
          Sign in now and start creating with the most powerful meme generator on the web.
        </p>
        <button
          onClick={() => window.location.href = "/sign-in"}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

AboutPage.propTypes = {
  onBackToHome: PropTypes.func.isRequired,
};

export default AboutPage;
