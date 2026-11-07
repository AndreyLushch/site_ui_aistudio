import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteGame, SiteUser } from '../types';
import { mockAdapter, MockAdapter } from '../api/MockAdapter';
import { StylePresetId, stylePresets } from '../theme/tokens';

type ThemeMode = 'light' | 'dark' | 'system';

interface AppContextValue {
  adapter: MockAdapter;
  user: SiteUser | null;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  stylePreset: StylePresetId;
  setStylePreset: (preset: StylePresetId) => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  qrModalGame: SiteGame | null;
  openQrModal: (game: SiteGame) => void;
  closeQrModal: () => void;
  isPageMapOpen: boolean;
  setPageMapOpen: (open: boolean) => void;
  previewWidth: number | null;
  setPreviewWidth: (width: number | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SiteUser | null>(null);
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nastolki_theme');
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    }
    return 'system';
  });

  const [stylePreset, setStylePresetState] = useState<StylePresetId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nastolki_style');
      if (saved === 'cozy' || saved === 'neo' || saved === 'night') return saved;
    }
    return 'cozy';
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [qrModalGame, setQrModalGame] = useState<SiteGame | null>(null);
  const [isPageMapOpen, setPageMapOpen] = useState(false);
  const [previewWidth, setPreviewWidth] = useState<number | null>(null);

  // Sync user from adapter
  useEffect(() => {
    const update = async () => {
      const current = await mockAdapter.getSession();
      setUser(current);
    };
    update();
    const unsubscribe = mockAdapter.subscribe(update);
    return () => unsubscribe();
  }, []);

  // Handle dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nastolki_theme', mode);
    }
  };

  const setStylePreset = (preset: StylePresetId) => {
    setStylePresetState(preset);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nastolki_style', preset);
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openQrModal = (game: SiteGame) => {
    // If on a touch mobile screen, direct link opens Telegram directly;
    // but we support opening the QR modal on any desktop or preview click
    setQrModalGame(game);
  };
  const closeQrModal = () => setQrModalGame(null);

  return (
    <AppContext.Provider
      value={{
        adapter: mockAdapter,
        user,
        theme,
        setTheme,
        stylePreset,
        setStylePreset,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        qrModalGame,
        openQrModal,
        closeQrModal,
        isPageMapOpen,
        setPageMapOpen,
        previewWidth,
        setPreviewWidth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
