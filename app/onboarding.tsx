import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Animated } from 'react-native';
import { Redirect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { INTEREST_TAGS, useUserPreferences } from '@/lib/UserPreferencesContext';

const SAGE = '#98d4a8';
const SAND = '#efe0d1';
const OFF_WHITE = '#fff7fa';
const TERRA = '#d08b73';

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 1) return { label: 'Faible', color: '#ef4444', width: '25%' as const };
  if (score <= 2) return { label: 'Moyen', color: '#f59e0b', width: '50%' as const };
  if (score === 3) return { label: 'Bon', color: '#84cc16', width: '75%' as const };
  return { label: 'Fort', color: '#16a34a', width: '100%' as const };
}

export default function OnboardingScreen() {
  const { onboarded, completeOnboarding } = useUserPreferences();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [fade] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [step, fade]);

  if (onboarded) return <Redirect href="/(tabs)" />;

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const passwordStrength = getPasswordStrength(password);
  const canContinueStep1 = username.trim().length > 1 && emailValid && password.length >= 8;
  const canFinish = selectedTags.length > 0;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleComplete = async () => {
    await completeOnboarding({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      tags: selectedTags,
    });
    router.replace('/(tabs)');
  };

  const handleDevSkip = async () => {
    await completeOnboarding({
      username: 'Mathilde',
      email: 'dev@ecobeauty.local',
      tags: [...INTEREST_TAGS].slice(0, 4),
    });
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: OFF_WHITE }}>
      {__DEV__ && (
        <Pressable
          onPress={handleDevSkip}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            zIndex: 20,
            backgroundColor: '#111827',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 11 }}>DEV • Skip init</Text>
        </Pressable>
      )}

      <View style={{ position: 'absolute', width: 280, height: 280, borderRadius: 999, top: -100, left: -70, backgroundColor: 'rgba(152,212,168,0.28)' }} />
      <View style={{ position: 'absolute', width: 320, height: 320, borderRadius: 999, bottom: -130, right: -90, backgroundColor: 'rgba(208,139,115,0.20)' }} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 56, paddingBottom: 40 }}>
        <Text style={{ fontSize: 33, fontWeight: '800', color: '#2f3b2f', letterSpacing: 0.5 }}>Eco Beauty</Text>
        <Text style={{ marginTop: 6, color: '#6b7280' }}>
          {step === 1 ? 'Créons votre compte clean beauty.' : 'Personnalisez votre expérience sur-mesure.'}
        </Text>

        <View style={{ marginTop: 12, flexDirection: 'row', gap: 8 }}>
          <View style={{ height: 6, flex: 1, borderRadius: 99, backgroundColor: step >= 1 ? SAGE : '#e5e7eb' }} />
          <View style={{ height: 6, flex: 1, borderRadius: 99, backgroundColor: step >= 2 ? SAGE : '#e5e7eb' }} />
        </View>

        <Animated.View style={{ opacity: fade }}>
          {step === 1 ? (
            <View style={{ marginTop: 18, backgroundColor: 'rgba(255,255,255,0.72)', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: SAND, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 }}>
              <Text style={{ fontWeight: '700', color: '#374151' }}>Comment souhaitez-vous qu'on vous appelle ?</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Votre username"
                style={{ marginTop: 8, borderWidth: 1, borderColor: '#dedede', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff' }}
                placeholderTextColor="#9ca3af"
              />

              <Text style={{ marginTop: 14, fontWeight: '700', color: '#374151' }}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="vous@exemple.com"
                style={{ marginTop: 8, borderWidth: 1, borderColor: '#dedede', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff' }}
                placeholderTextColor="#9ca3af"
              />
              {!!email && !emailValid && <Text style={{ marginTop: 4, color: '#ef4444', fontSize: 12 }}>Format d'email invalide.</Text>}

              <Text style={{ marginTop: 14, fontWeight: '700', color: '#374151' }}>Mot de passe</Text>
              <View style={{ marginTop: 8, borderWidth: 1, borderColor: '#dedede', borderRadius: 12, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Minimum 8 caractères"
                  style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 10 }}
                  placeholderTextColor="#9ca3af"
                />
                <Pressable onPress={() => setShowPassword((v) => !v)} style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#6b7280" />
                </Pressable>
              </View>

              <View style={{ marginTop: 10 }}>
                <View style={{ height: 8, borderRadius: 99, backgroundColor: '#f3f4f6' }}>
                  <View style={{ width: passwordStrength.width, height: 8, borderRadius: 99, backgroundColor: passwordStrength.color }} />
                </View>
                <Text style={{ marginTop: 4, fontSize: 12, color: '#6b7280' }}>Force : {passwordStrength.label}</Text>
              </View>

              <Pressable
                onPress={() => setStep(2)}
                disabled={!canContinueStep1}
                style={{
                  marginTop: 18,
                  backgroundColor: canContinueStep1 ? TERRA : '#d1d5db',
                  paddingVertical: 12,
                  borderRadius: 14,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontWeight: '700' }}>Continuer</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ marginTop: 18, backgroundColor: 'rgba(255,255,255,0.72)', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: SAND, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 }}>
              <Text style={{ fontWeight: '700', color: '#374151' }}>Sélectionnez vos besoins pour une expérience sur-mesure</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {INTEREST_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <Pressable
                      key={tag}
                      onPress={() => toggleTag(tag)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 999,
                        backgroundColor: active ? SAGE : 'white',
                        borderWidth: 1,
                        borderColor: active ? SAGE : '#e5e7eb',
                      }}
                    >
                      <Text style={{ color: active ? '#14532d' : '#4b5563', fontSize: 12, fontWeight: '600' }}>{tag}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={{ marginTop: 12, color: '#6b7280', fontSize: 12 }}>
                {selectedTags.length} sélection{selectedTags.length > 1 ? 's' : ''}
              </Text>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                <Pressable
                  onPress={() => setStep(1)}
                  style={{ flex: 1, backgroundColor: '#e5e7eb', paddingVertical: 12, borderRadius: 14, alignItems: 'center' }}
                >
                  <Text style={{ color: '#374151', fontWeight: '700' }}>Retour</Text>
                </Pressable>
                <Pressable
                  onPress={handleComplete}
                  disabled={!canFinish}
                  style={{
                    flex: 1,
                    backgroundColor: canFinish ? TERRA : '#d1d5db',
                    paddingVertical: 12,
                    borderRadius: 14,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: '700' }}>Finaliser</Text>
                </Pressable>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

