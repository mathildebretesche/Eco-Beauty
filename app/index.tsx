import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useUserPreferences } from '@/lib/UserPreferencesContext';

/**
 * Point d’entrée : gateway (choix B2C/B2B), puis onboarding client ou espace pro.
 */
export default function Index() {
  const { loading, onboarded, segment } = useUserPreferences();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F7F4EF',
        }}
      >
        <ActivityIndicator size="large" color="#9CAF88" />
      </View>
    );
  }

  if (!segment) {
    return <Redirect href="/gateway" />;
  }
  if (segment === 'b2b') {
    return <Redirect href="/pro/index" />;
  }
  if (!onboarded) {
    return <Redirect href="/onboarding" />;
  }
  return <Redirect href="/(tabs)" />;
}
