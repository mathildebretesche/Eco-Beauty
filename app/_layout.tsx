import { Stack } from 'expo-router';
import { CartProvider } from '@/lib/CartContext';
import { UserPreferencesProvider } from '@/lib/UserPreferencesContext';

export default function RootLayout() {
  return (
    <UserPreferencesProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="gateway" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="pro" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </CartProvider>
    </UserPreferencesProvider>
  );
}
