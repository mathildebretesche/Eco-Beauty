import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  username: '@ecobeauty_username',
  email: '@ecobeauty_email',
  tags: '@ecobeauty_tags',
  onboarded: '@ecobeauty_onboarded',
  /** Parcours choisi sur la gateway : client ou partenaire */
  segment: '@ecobeauty_segment',
};

export type UserSegment = 'b2c' | 'b2b';

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
  /** null = pas encore passé par la gateway (ou reset) */
  segment: UserSegment | null;
  username: string;
  email: string;
  tags: string[];
  setUsername: (value: string) => Promise<void>;
  setEmail: (value: string) => Promise<void>;
  setTags: (value: string[]) => Promise<void>;
  setUserSegment: (value: UserSegment) => Promise<void>;
  /** Remet le choix gateway (B2C/B2B) pour afficher à nouveau l’accueil split */
  clearUserSegment: () => Promise<void>;
  completeOnboarding: (payload: { username: string; email: string; tags: string[] }) => Promise<void>;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);
  const [segment, setSegmentState] = useState<UserSegment | null>(null);
  const [username, setUsernameState] = useState('');
  const [email, setEmailState] = useState('');
  const [tags, setTagsState] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [savedUsername, savedEmail, savedTags, savedOnboarded, savedSegment] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.username),
          AsyncStorage.getItem(STORAGE_KEYS.email),
          AsyncStorage.getItem(STORAGE_KEYS.tags),
          AsyncStorage.getItem(STORAGE_KEYS.onboarded),
          AsyncStorage.getItem(STORAGE_KEYS.segment),
        ]);
        if (savedUsername) setUsernameState(savedUsername);
        if (savedEmail) setEmailState(savedEmail);
        if (savedTags) setTagsState(JSON.parse(savedTags));
        const isOnboarded = savedOnboarded === 'true';
        setOnboarded(isOnboarded);

        let seg: UserSegment | null =
          savedSegment === 'b2b' || savedSegment === 'b2c' ? savedSegment : null;
        if (isOnboarded && !seg) {
          seg = 'b2c';
          await AsyncStorage.setItem(STORAGE_KEYS.segment, 'b2c');
        }
        setSegmentState(seg);
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

  const setUserSegment = useCallback(async (value: UserSegment) => {
    setSegmentState(value);
    await AsyncStorage.setItem(STORAGE_KEYS.segment, value);
  }, []);

  const clearUserSegment = useCallback(async () => {
    setSegmentState(null);
    await AsyncStorage.removeItem(STORAGE_KEYS.segment);
  }, []);

  const completeOnboarding = useCallback(
    async (payload: { username: string; email: string; tags: string[] }) => {
      setUsernameState(payload.username);
      setEmailState(payload.email);
      setTagsState(payload.tags);
      setOnboarded(true);
      const existingSeg = await AsyncStorage.getItem(STORAGE_KEYS.segment);
      if (existingSeg !== 'b2b' && existingSeg !== 'b2c') {
        await AsyncStorage.setItem(STORAGE_KEYS.segment, 'b2c');
        setSegmentState('b2c');
      }
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
      segment,
      username,
      email,
      tags,
      setUsername,
      setEmail,
      setTags,
      setUserSegment,
      clearUserSegment,
      completeOnboarding,
    }),
    [
      loading,
      onboarded,
      segment,
      username,
      email,
      tags,
      setUsername,
      setEmail,
      setTags,
      setUserSegment,
      clearUserSegment,
      completeOnboarding,
    ]
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

