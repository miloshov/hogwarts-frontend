import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from './ThemeContext';
import { podesavanjaService, PodesavanjaResponse } from '../services/podesavanjaService';

interface UserSettings {
  tema: 'light' | 'dark';
  jezik: 'sr' | 'en' | 'bg' | 'uk';
  emailNotifikacije: boolean;
  deadlineNotifikacije: boolean;
  stavkiPoStranici: number;
  autoSave: boolean;
  timeZone: string;
}

interface SettingsContextType {
  settings: UserSettings;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  applyTheme: (theme: 'light' | 'dark') => void;
  applyLanguage: (language: 'sr' | 'en' | 'bg' | 'uk') => void;
}

const defaultSettings: UserSettings = {
  tema: 'light',
  jezik: 'sr',
  emailNotifikacije: true,
  deadlineNotifikacije: true,
  stavkiPoStranici: 10,
  autoSave: true,
  timeZone: 'Europe/Belgrade',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { i18n } = useTranslation();
  const { setTheme } = useThemeContext();

  // Load settings from backend on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Apply theme and language when settings change
  useEffect(() => {
    if (!isLoading) {
      applyTheme(settings.tema);
      applyLanguage(settings.jezik);
    }
  }, [settings.tema, settings.jezik, isLoading]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await podesavanjaService.getPodesavanja();
      
      if (response) {
        const userSettings: UserSettings = {
          tema: response.tema as 'light' | 'dark',
          jezik: response.jezik as 'sr' | 'en' | 'bg' | 'uk',
          emailNotifikacije: response.emailNotifikacije,
          deadlineNotifikacije: response.deadlineNotifikacije,
          stavkiPoStranici: response.stavkiPoStranici,
          autoSave: response.autoSave,
          timeZone: response.timeZone,
        };
        setSettings(userSettings);
      } else {
        // If no settings found, use defaults and create them
        setSettings(defaultSettings);
        await createDefaultSettings();
      }
    } catch (error) {
      console.warn('No settings found, using defaults:', error);
      setSettings(defaultSettings);
      // Optionally try to create default settings
      try {
        await createDefaultSettings();
      } catch (createError) {
        console.warn('Could not create default settings:', createError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      await podesavanjaService.updatePodesavanja({
        tema: defaultSettings.tema,
        jezik: defaultSettings.jezik,
        emailNotifikacije: defaultSettings.emailNotifikacije,
        deadlineNotifikacije: defaultSettings.deadlineNotifikacije,
        stavkiPoStranici: defaultSettings.stavkiPoStranici,
        autoSave: defaultSettings.autoSave,
        timeZone: defaultSettings.timeZone,
      });
    } catch (error) {
      console.warn('Failed to create default settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    
    try {
      // Update backend
      await podesavanjaService.updatePodesavanja({
        tema: updatedSettings.tema,
        jezik: updatedSettings.jezik,
        emailNotifikacije: updatedSettings.emailNotifikacije,
        deadlineNotifikacije: updatedSettings.deadlineNotifikacije,
        stavkiPoStranici: updatedSettings.stavkiPoStranici,
        autoSave: updatedSettings.autoSave,
        timeZone: updatedSettings.timeZone,
      });
      
      // Update local state
      setSettings(updatedSettings);
      
      // Apply changes immediately
      if (newSettings.tema) {
        applyTheme(newSettings.tema);
      }
      if (newSettings.jezik) {
        applyLanguage(newSettings.jezik);
      }
      
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  const resetSettings = async () => {
    try {
      const response = await podesavanjaService.resetPodesavanja();
      
      const resetUserSettings: UserSettings = {
        tema: response.tema as 'light' | 'dark',
        jezik: response.jezik as 'sr' | 'en' | 'bg' | 'uk',
        emailNotifikacije: response.emailNotifikacije,
        deadlineNotifikacije: response.deadlineNotifikacije,
        stavkiPoStranici: response.stavkiPoStranici,
        autoSave: response.autoSave,
        timeZone: response.timeZone,
      };
      
      setSettings(resetUserSettings);
      applyTheme(resetUserSettings.tema);
      applyLanguage(resetUserSettings.jezik);
      
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw error;
    }
  };

  const applyTheme = (theme: 'light' | 'dark') => {
    setTheme(theme);
    // Store in localStorage for persistence
    localStorage.setItem('hogwarts-theme', theme);
  };

  const applyLanguage = (language: 'sr' | 'en' | 'bg' | 'uk') => {
    i18n.changeLanguage(language);
    // Store in localStorage for persistence
    localStorage.setItem('hogwarts-language', language);
    
    // Update document language attribute
    document.documentElement.lang = language;
  };

  const contextValue: SettingsContextType = {
    settings,
    isLoading,
    updateSettings,
    resetSettings,
    applyTheme,
    applyLanguage,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
