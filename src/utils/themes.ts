
import { ThemeType } from '@/types/calendar';

export interface ThemeConfig {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    border: string;
  };
  gradients: {
    main: string;
    accent: string;
  };
  effects: {
    glow: boolean;
    particles: boolean;
    scanlines: boolean;
  };
}

export const themes: Record<ThemeType, ThemeConfig> = {
  'sci-fi': {
    name: 'Sci-Fi',
    description: 'Futuristic space-age design',
    colors: {
      primary: '#00ff88',
      secondary: '#0099ff',
      accent: '#ff0099',
      background: 'from-slate-900 via-blue-900 to-slate-900',
      surface: 'rgba(15, 23, 42, 0.8)',
      text: '#e2e8f0',
      border: '#334155'
    },
    gradients: {
      main: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
      accent: 'bg-gradient-to-r from-blue-400/20 via-transparent to-transparent'
    },
    effects: {
      glow: true,
      particles: false,
      scanlines: true
    }
  },
  cyberpunk: {
    name: 'Cyberpunk',
    description: 'Neon-lit dystopian aesthetic',
    colors: {
      primary: '#ff0080',
      secondary: '#00ffff',
      accent: '#ffff00',
      background: 'from-black via-purple-900 to-black',
      surface: 'rgba(0, 0, 0, 0.9)',
      text: '#ff0080',
      border: '#ff0080'
    },
    gradients: {
      main: 'bg-gradient-to-br from-black via-purple-900 to-black',
      accent: 'bg-gradient-to-r from-pink-500/30 via-cyan-500/30 to-yellow-500/30'
    },
    effects: {
      glow: true,
      particles: true,
      scanlines: true
    }
  },
  retro: {
    name: 'Retro',
    description: 'Vintage 80s nostalgia',
    colors: {
      primary: '#ff6b9d',
      secondary: '#45b7d1',
      accent: '#f9ca24',
      background: 'from-purple-900 via-pink-800 to-orange-700',
      surface: 'rgba(139, 69, 19, 0.8)',
      text: '#fff3e0',
      border: '#ff6b9d'
    },
    gradients: {
      main: 'bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700',
      accent: 'bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-orange-400/20'
    },
    effects: {
      glow: false,
      particles: false,
      scanlines: false
    }
  },
  starwars: {
    name: 'Star Wars',
    description: 'A galaxy far, far away',
    colors: {
      primary: '#ffe81f',
      secondary: '#4169e1',
      accent: '#dc143c',
      background: 'from-black via-gray-900 to-black',
      surface: 'rgba(0, 0, 0, 0.9)',
      text: '#ffe81f',
      border: '#4169e1'
    },
    gradients: {
      main: 'bg-gradient-to-br from-black via-gray-900 to-black',
      accent: 'bg-gradient-to-r from-yellow-400/20 via-blue-600/20 to-red-600/20'
    },
    effects: {
      glow: true,
      particles: true,
      scanlines: false
    }
  },
  startrek: {
    name: 'Star Trek',
    description: 'Federation elegance',
    colors: {
      primary: '#0099cc',
      secondary: '#ff6600',
      accent: '#cc0000',
      background: 'from-blue-900 via-slate-800 to-blue-900',
      surface: 'rgba(30, 58, 138, 0.8)',
      text: '#e0f2fe',
      border: '#0099cc'
    },
    gradients: {
      main: 'bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900',
      accent: 'bg-gradient-to-r from-blue-400/20 via-orange-400/20 to-red-400/20'
    },
    effects: {
      glow: false,
      particles: false,
      scanlines: true
    }
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean and simple',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: 'from-white to-gray-50',
      surface: 'rgba(255, 255, 255, 0.9)',
      text: '#374151',
      border: '#d1d5db'
    },
    gradients: {
      main: 'bg-gradient-to-br from-white to-gray-50',
      accent: 'bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-cyan-400/10'
    },
    effects: {
      glow: false,
      particles: false,
      scanlines: false
    }
  }
};

export const getThemeConfig = (theme: ThemeType): ThemeConfig => {
  return themes[theme];
};
