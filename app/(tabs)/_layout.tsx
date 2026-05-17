import { Feather, Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { useUserPreferences } from '@/lib/UserPreferencesContext';

const PASTEL_PINK = '#f8b4c4';
const PASTEL_GREEN = '#98d4a8';
const SAGE = '#9CAF88';

const tabBarBase = {
  position: 'absolute' as const,
  left: 12,
  right: 12,
  bottom: 12,
  height: 66,
  paddingBottom: 10,
  paddingTop: 6,
  borderRadius: 18,
  borderTopColor: 'transparent',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 8,
};

const tabBarGlass =
  Platform.OS === 'web'
    ? ({
        ...tabBarBase,
        backgroundColor: 'rgba(247, 244, 239, 0.72)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      } as (typeof tabBarBase) & { backdropFilter?: string; WebkitBackdropFilter?: string })
    : {
        ...tabBarBase,
        backgroundColor: 'rgba(253,242,248,0.95)',
      };

export default function TabLayout() {
  const { loading, onboarded, segment } = useUserPreferences();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff7f9' }}>
        <Text style={{ color: '#6b7280' }}>Chargement...</Text>
      </View>
    );
  }

  if (!onboarded) {
    if (!segment) return <Redirect href="/gateway" />;
    if (segment === 'b2b') return <Redirect href="/pro/index" />;
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: SAGE,
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: { fontFamily: 'System', fontWeight: '700', fontSize: 11 },
        tabBarStyle: tabBarGlass,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Recommandation',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="boutique"
        options={{
          title: 'Boutique',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="diamond-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="flux"
        options={{
          title: 'Flux',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Carte',
          tabBarIcon: ({ color, size }) => (
            <Feather name="map-pin" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Panier',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}
