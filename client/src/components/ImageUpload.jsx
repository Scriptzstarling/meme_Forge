import React, { useState, useRef, useEffect } from 'react';
import { Upload, Grid3X3, Sparkles } from 'lucide-react';
import { useUser, SignInButton } from '@clerk/clerk-react'; // ✅ import Clerk hook & sign-in button
import AIMemeGenerator from './AIMemeGenerator';

const ImageUpload = ({ onImageSelect, onAIMemeGenerated, onViewMoreTemplates }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [templates, setTemplates] = useState([]);
  const fileInputRef = useRef(null);

  const { isSignedIn } = useUser(); // ✅ check user sign-in status

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch("/images.json");
        if (response.ok) {
          const data = await response.json();
          const formattedTemplates = data.map((filename, index) => ({
            id: index + 1,
            name: filename.replace(/\.(png|jpe?g|gif|webp)$/i, '').replace(/[-_]/g, ' '),
            url: `/${filename}`
          }));
          setTemplates(formattedTemplates);
          return;
        }
      } catch (jsonError) {
        console.log('images.json not found, using fallback templates');
      }

      setTemplates([
        { id: 1, name: 'Drake Pointing', url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { id: 2, name: 'Success Kid', url: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400' },
        // ...rest of fallback templates
      ]);
    };
    loadTemplates();
  }, []);

  const requireSignIn = (action) => {
    if (!isSignedIn) {
      alert("You must sign in to use this feature.");
      return false;
    }
    return true;
  };

  const handleFileUpload = (event) => {
    if (!requireSignIn()) return;
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelect(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateSelect = (templateUrl) => {
    if (!requireSignIn()) return;
    onImageSelect(templateUrl);
  };

  const handleAIMemeGenerated = (imageUrl, topText, bottomText) => {
    if (!requireSignIn()) return;
    onImageSelect(imageUrl);
    if (onAIMemeGenerated) {
      onAIMemeGenerated(imageUrl, topText, bottomText);
    }
  };

  return (
    <div className="space-y-3">
      {/* If not signed in, show message */}
      {!isSignedIn && (
        <div className="p-3 bg-yellow-100 text-yellow-800 rounded-md text-sm text-center">
          You must sign in to use the meme generator.
          <div className="mt-2">
            <SignInButton mode="modal">
              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      )}

      {/* Tab Buttons */}
      <div className="grid grid-cols-3 bg-gray-100 rounded-md p-0.5">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Upload className="h-3 w-3" />
          Upload
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
            activeTab === 'templates'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Grid3X3 className="h-3 w-3" />
          Templates
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
            activeTab === 'ai'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Sparkles className="h-3 w-3" />
          AI Generate
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,.gif"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => {
              if (requireSignIn()) fileInputRef.current?.click();
            }}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-colors group"
          >
            <Upload className="h-6 w-6 text-gray-400 group-hover:text-blue-500 mx-auto mb-1" />
            <p className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
              Click to upload media
            </p>
            <p className="text-xs text-gray-400">Images, Videos, GIFs up to 50MB</p>
          </button>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {templates.slice(0, 15).map((template, index) => (
              <button
                key={index}
                onClick={() => handleTemplateSelect(template.url || template)}
                className="relative group overflow-hidden rounded-md border border-gray-200 hover:border-blue-400 transition-colors"
              >
                <img
                  src={template.url || template}
                  alt={template.name || `Template ${index + 1}`}
                  className="w-full h-16 object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 px-1.5 py-0.5 rounded">
                    {template.name || `Template ${index + 1}`}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              if (requireSignIn()) {
                onViewMoreTemplates?.();
              }
            }}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <Grid3X3 className="h-4 w-4" />
            View More Templates ({Math.max(0, templates.length - 15)}+ more)
          </button>
        </div>
      )}

      {/* AI Tab */}
      {activeTab === 'ai' && (
        <AIMemeGenerator onMemeGenerated={handleAIMemeGenerated} />
      )}
    </div>
  );
};

export default ImageUpload;
