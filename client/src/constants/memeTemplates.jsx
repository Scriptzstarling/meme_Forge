// client/src/constants/memeTemplates.jsx
const memeModules = import.meta.glob('/public/*.{png,jpg,jpeg,gif}', { eager: true });

export const MEME_TEMPLATES = Object.keys(memeModules).map((path) => ({
  name: path.split('/').pop().split('.')[0],
  url: path, // No .replace needed — vite serves /public as root
}));
