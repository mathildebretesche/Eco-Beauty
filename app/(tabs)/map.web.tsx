import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Linking } from 'react-native';
import Slider from '@react-native-community/slider';
import { STORES, PARIS_CENTER } from '@/lib/stores';

const PASTEL_PINK = '#f8b4c4';
const PASTEL_GREEN = '#98d4a8';
const LIGHT_PINK = '#fdf2f8';

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapWebScreen() {
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState(5);
  const [searchLat, setSearchLat] = useState<number | null>(null);
  const [searchLng, setSearchLng] = useState<number | null>(null);

  const handleSearch = async () => {
    if (!address.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Paris, France')}&limit=1`
      );
      const data = await res.json();
      if (data?.[0]) {
        setSearchLat(parseFloat(data[0].lat));
        setSearchLng(parseFloat(data[0].lon));
      } else {
        setSearchLat(PARIS_CENTER.lat);
        setSearchLng(PARIS_CENTER.lng);
      }
    } catch {
      setSearchLat(PARIS_CENTER.lat);
      setSearchLng(PARIS_CENTER.lng);
    }
  };

  const nearestStores = useMemo(() => {
    const userLat = searchLat ?? PARIS_CENTER.lat;
    const userLng = searchLng ?? PARIS_CENTER.lng;
    return [...STORES]
      .map((s) => ({
        ...s,
        distance: haversineDistance(userLat, userLng, s.lat, s.lng),
      }))
      .filter((s) => s.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }, [searchLat, searchLng, radius]);

  const displayStores = address.trim() ? nearestStores : STORES;

  return (
    <View className="flex-1" style={{ backgroundColor: LIGHT_PINK }}>
      <View className="flex-1 flex-row">
        <View className="flex-1" style={{ minHeight: 400 }}>
          <View
            style={{
              flex: 1,
              minHeight: 400,
              backgroundColor: '#e5e7eb',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}
          >
            <Text className="text-lg font-bold mb-2" style={{ color: '#6b7280' }}>
              Carte Paris
            </Text>
            <Text className="text-sm text-center mb-4" style={{ color: '#9ca3af' }}>
              Carte interactive disponible sur iOS/Android
            </Text>
            <Pressable
              onPress={() => Linking.openURL('https://www.openstreetmap.org/#map=12/48.8566/2.3522')}
              className="px-6 py-3 rounded-xl"
              style={{ backgroundColor: PASTEL_GREEN }}
            >
              <Text className="font-semibold" style={{ color: '#166534' }}>
                Ouvrir OpenStreetMap
              </Text>
            </Pressable>
          </View>
        </View>

        <View
          className="w-64 p-4 rounded-2xl m-4"
          style={{ backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8 }}
        >
          <Text className="text-sm font-bold mb-2" style={{ color: '#7c3aed' }}>
            Recherche
          </Text>
          <TextInput
            placeholder="Adresse..."
            value={address}
            onChangeText={setAddress}
            className="border rounded-xl px-3 py-2 mb-3 text-sm"
            style={{ borderColor: PASTEL_PINK }}
            placeholderTextColor="#9ca3af"
          />
          <Text className="text-xs font-semibold mb-1" style={{ color: '#6b7280' }}>
            Rayon: {radius} km
          </Text>
          <Slider
            style={{ width: '100%', height: 24 }}
            minimumValue={1}
            maximumValue={15}
            step={1}
            value={radius}
            onValueChange={setRadius}
            minimumTrackTintColor={PASTEL_GREEN}
            maximumTrackTintColor={PASTEL_PINK}
            thumbTintColor={PASTEL_GREEN}
          />
          <Pressable
            onPress={handleSearch}
            className="py-2 rounded-xl items-center"
            style={{ backgroundColor: PASTEL_PINK }}
          >
            <Text className="font-semibold text-sm" style={{ color: '#7c3aed' }}>
              Rechercher
            </Text>
          </Pressable>
          <ScrollView className="mt-3 max-h-48" showsVerticalScrollIndicator={false}>
            {displayStores.map((store) => (
              <View key={store.id} className="mb-2 p-2 rounded-lg" style={{ backgroundColor: '#fdf2f8' }}>
                <Text className="text-xs font-bold" style={{ color: '#1f2937' }}>
                  {store.name}
                </Text>
                <Text className="text-xs" style={{ color: '#6b7280' }} numberOfLines={2}>
                  {store.address}
                </Text>
                {'distance' in store && (
                  <Text className="text-xs mt-1" style={{ color: PASTEL_GREEN }}>
                    {(store as { distance: number }).distance.toFixed(1)} km
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
