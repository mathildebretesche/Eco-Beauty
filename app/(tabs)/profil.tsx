import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserPreferences } from '@/lib/UserPreferencesContext';

const PASTEL_PINK = '#f8b4c4';
const PASTEL_GREEN = '#98d4a8';
const LIGHT_PINK = '#FFC5D3';

const STORAGE_KEYS = { photo: '@ecobeauty_photo' };

export default function ProfilScreen() {
  const { username, setUsername, tags } = useUserPreferences();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadProfile();
    Animated.timing(fade, { toValue: 1, duration: 320, useNativeDriver: true }).start();
  }, []);

  const loadProfile = async () => {
    try {
      const [savedPhoto] = await Promise.all([AsyncStorage.getItem(STORAGE_KEYS.photo)]);
      if (savedPhoto) setPhotoUri(savedPhoto);
    } catch (e) {
      console.warn('Erreur chargement profil:', e);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Accédez aux paramètres pour autoriser la galerie.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      await AsyncStorage.setItem(STORAGE_KEYS.photo, uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Accédez aux paramètres pour autoriser la caméra.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      await AsyncStorage.setItem(STORAGE_KEYS.photo, uri);
    }
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Photo de profil',
      'Choisir une option',
      [
        { text: 'Galerie', onPress: pickImage },
        { text: 'Appareil photo', onPress: takePhoto },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const saveUsername = async () => {
    const value = editValue.trim() || username;
    await setUsername(value);
    setEditValue('');
    setIsEditing(false);
  };

  return (
    <Animated.View className="flex-1" style={{ backgroundColor: LIGHT_PINK, opacity: fade }}>
      <View className="px-4 pt-12 pb-4" style={{ backgroundColor: 'rgba(248,180,196,0.95)' }}>
        <Text className="text-2xl font-bold" style={{ color: '#7c3aed' }}>
          Profil
        </Text>
        <Text className="mt-1 text-sm" style={{ color: '#6b7280' }}>
          Gérez votre compte
        </Text>
      </View>

      <View className="flex-1 px-4 py-8">
        {/* Photo de profil */}
        <View className="items-center mb-8">
          <TouchableOpacity
            onPress={showPhotoOptions}
            className="w-28 h-28 rounded-full overflow-hidden"
            style={{ backgroundColor: '#ecfdf5', borderWidth: 4, borderColor: PASTEL_PINK }}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <Text className="text-4xl">👤</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showPhotoOptions}
            className="mt-3 px-4 py-2 rounded-xl"
            style={{ backgroundColor: PASTEL_GREEN }}
          >
            <Text className="font-semibold" style={{ color: '#166534' }}>
              Modifier la photo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nom d'utilisateur */}
        <View
          className="p-4 rounded-2xl"
          style={{ backgroundColor: '#fff', shadowColor: PASTEL_PINK, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 }}
        >
          <Text className="text-sm font-semibold mb-2" style={{ color: '#6b7280' }}>
            Nom d'utilisateur
          </Text>
          {isEditing ? (
            <View className="flex-row gap-2">
              <TextInput
                value={editValue}
                onChangeText={setEditValue}
                placeholder={username || 'Entrez votre nom'}
                placeholderTextColor="#9ca3af"
                className="flex-1 border rounded-xl px-3 py-2"
                style={{ borderColor: PASTEL_PINK }}
                autoFocus
              />
              <TouchableOpacity
                onPress={saveUsername}
                className="px-4 py-2 rounded-xl"
                style={{ backgroundColor: PASTEL_GREEN }}
              >
                <Text className="font-semibold" style={{ color: '#166534' }}>
                  OK
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsEditing(false);
                  setEditValue('');
                }}
                className="px-4 py-2 rounded-xl"
                style={{ backgroundColor: '#f3f4f6' }}
              >
                <Text className="font-semibold" style={{ color: '#6b7280' }}>
                  Annuler
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row justify-between items-center">
              <Text className="text-lg" style={{ color: '#1f2937' }}>
                {username || 'Non défini'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setEditValue(username);
                  setIsEditing(true);
                }}
                className="px-4 py-2 rounded-xl"
                style={{ backgroundColor: PASTEL_PINK }}
              >
                <Text className="font-semibold" style={{ color: '#7c3aed' }}>
                  Modifier
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View
          className="p-4 rounded-2xl mt-4"
          style={{ backgroundColor: '#fff', shadowColor: PASTEL_PINK, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 }}
        >
          <Text className="text-sm font-semibold mb-2" style={{ color: '#6b7280' }}>
            Tags personnalisés
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {tags.length === 0 ? (
              <Text style={{ color: '#9ca3af' }}>Aucun tag sélectionné.</Text>
            ) : (
              tags.map((tag) => (
                <View key={tag} style={{ backgroundColor: '#ecfdf5', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
                  <Text style={{ color: '#166534', fontSize: 12, fontWeight: '600' }}>{tag}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
