import { Stack } from 'expo-router';

export default function ProLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: '#2C3E32',
        headerStyle: { backgroundColor: '#F7F4EF' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#F7F4EF' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="ajouter-produit"
        options={{ title: 'Nouveau listing', headerBackTitle: 'Retour' }}
      />
    </Stack>
  );
}
