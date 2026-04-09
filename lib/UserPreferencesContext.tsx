import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  username: '@ecobeauty_username',
  email: '@ecobeauty_email',
  tags: '@ecobeauty_tags',
  onboarded: '@ecobeauty_onboarded',
};

export const INTEREST_TAGS = [
  'Maquillage Teint',
  'Maquillage Yeux',
  'Soin de la peau',
  'Tendances Acnéiques',
  'Ridules & Anti-âge',
  'Taches pigmentaires',
  'Solaire & protection UV',
  'Ingrédients bio & vegan',
  'Hydratation intense',
  'Peaux sensibles / rougeurs',
  'Cosmétique solide & zéro déchet',
  'Éclat du teint / glow',
  'Soins capillaires naturels',
  'Détox & anti-pollution',
  'Texture huile / sérum',
  'Parfums naturels',
] as const;

export type InterestTag = (typeof INTEREST_TAGS)[number];

interface UserPreferencesContextType {
  loading: boolean;
  onboarded: boolean;
  username: string;
  email: string;
  tags: string[];
  setUsername: (value: string) => Promise<void>;
  setEmail: (value: string) => Promise<void>;
  setTags: (value: string[]) => Promise<void>;
  completeOnboarding: (payload: { username: string; email: string; tags: string[] }) => Promise<void>;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);
  const [username, setUsernameState] = useState('');
  const [email, setEmailState] = useState('');
  const [tags, setTagsState] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [savedUsername, savedEmail, savedTags, savedOnboarded] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.username),
          AsyncStorage.getItem(STORAGE_KEYS.email),
          AsyncStorage.getItem(STORAGE_KEYS.tags),
          AsyncStorage.getItem(STORAGE_KEYS.onboarded),
        ]);
        if (savedUsername) setUsernameState(savedUsername);
        if (savedEmail) setEmailState(savedEmail);
        if (savedTags) setTagsState(JSON.parse(savedTags));
        setOnboarded(savedOnboarded === 'true');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const setUsername = useCallback(async (value: string) => {
    setUsernameState(value);
    await AsyncStorage.setItem(STORAGE_KEYS.username, value);
  }, []);

  const setEmail = useCallback(async (value: string) => {
    setEmailState(value);
    await AsyncStorage.setItem(STORAGE_KEYS.email, value);
  }, []);

  const setTags = useCallback(async (value: string[]) => {
    setTagsState(value);
    await AsyncStorage.setItem(STORAGE_KEYS.tags, JSON.stringify(value));
  }, []);

  const completeOnboarding = useCallback(
    async (payload: { username: string; email: string; tags: string[] }) => {
      setUsernameState(payload.username);
      setEmailState(payload.email);
      setTagsState(payload.tags);
      setOnboarded(true);
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.username, payload.username),
        AsyncStorage.setItem(STORAGE_KEYS.email, payload.email),
        AsyncStorage.setItem(STORAGE_KEYS.tags, JSON.stringify(payload.tags)),
        AsyncStorage.setItem(STORAGE_KEYS.onboarded, 'true'),
      ]);
    },
    []
  );

  const value = useMemo(
    () => ({
      loading,
      onboarded,
      username,
      email,
      tags,
      setUsername,
      setEmail,
      setTags,
      completeOnboarding,
    }),
    [loading, onboarded, username, email, tags, setUsername, setEmail, setTags, completeOnboarding]
  );

  return <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>;
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  }
  return context;
}

