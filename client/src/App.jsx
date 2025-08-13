import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TrendingUp } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import MemeGenerator from "./components/MemeGenerator";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import TemplatePage from "./pages/TemplatePage";
import logo from "./assets/logo.webp";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    const handleViewMoreTemplates = () => {
      setCurrentPage("templates");
    };
    window.addEventListener("viewMoreTemplates", handleViewMoreTemplates);
    return () =>
      window.removeEventListener("viewMoreTemplates", handleViewMoreTemplates);
  }, []);

  const handleTemplateSelect = (templateUrl) => {
    setSelectedTemplate(templateUrl);
    setCurrentPage("home");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "about":
        return <AboutPage onBackToHome={() => setCurrentPage("home")} />;
      case "templates":
        return (
          <TemplatePage
            onBackToHome={() => setCurrentPage("home")}
            onTemplateSelect={handleTemplateSelect}
          />
        );
      default:
        return (
          <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
              <div className="container mx-auto px-6 pt-16 pb-12 text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                  Create Viral Memes{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Instantly
                  </span>
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                  Upload images, choose from trending templates, or let AI craft
                  the perfect meme. Share your creativity in just a few clicks.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <Badge color="green" text="AI-Powered Generation" />
                  <Badge color="blue" text="Instant Download" />
                  <Badge color="purple" text="Professional Quality" />
                </div>
              </div>
            </section>

            {/* Main Meme Generator */}
            <main className="px-4 pb-16">
              <div className="container mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50">
                <MemeGenerator
                  layout="horizontal"
                  preselectedTemplate={selectedTemplate}
                />
              </div>
            </main>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo & Title */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentPage("home")}
          >
            <img
              src={logo}
              alt="MemeForge Logo"
              className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MemeForge
              </h1>
              <p className="text-xs text-gray-500 tracking-wide">
                AI-Powered Meme Generator
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <TrendingBadge />
            {["home", "templates", "about"].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative font-medium transition-colors duration-300 ${
                  currentPage === page
                    ? "text-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
                {currentPage === page && (
                  <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-purple-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu (placeholder) */}
          <button className="md:hidden p-2 text-gray-600 hover:text-purple-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {renderPage()}
      <Footer />
    </div>
  );
}

function Badge({ color, text }) {
  const colorClasses = {
    green: "bg-green-100 text-green-700 border border-green-200",
    blue: "bg-blue-100 text-blue-700 border border-blue-200",
    purple: "bg-purple-100 text-purple-700 border border-purple-200",
  };

  const dotClasses = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
  };

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${colorClasses[color]}`}
    >
      <div
        className={`w-2 h-2 rounded-full ${dotClasses[color]} animate-pulse`}
      ></div>
      <span>{text}</span>
    </div>
  );
}

Badge.propTypes = {
  color: PropTypes.oneOf(["green", "blue", "purple"]).isRequired,
  text: PropTypes.string.isRequired,
};

function TrendingBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-200 shadow-sm">
      <TrendingUp className="h-4 w-4 text-green-600" />
      <span>Trending Now</span>
    </div>
  );
}

export default App;
