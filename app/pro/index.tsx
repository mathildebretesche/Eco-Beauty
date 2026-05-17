import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUserPreferences } from '@/lib/UserPreferencesContext';

const SAGE = '#9CAF88';
const SLATE = '#2C3E32';
const MUTED = '#5c6658';

export default function ProDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { onboarded, setUserSegment, clearUserSegment } = useUserPreferences();

  const goClientSpace = async () => {
    await setUserSegment('b2c');
    if (onboarded) router.replace('/(tabs)');
    else router.replace('/onboarding');
  };

  const goGateway = async () => {
    await clearUserSegment();
    router.replace('/gateway');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F7F4EF' }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingTop: insets.top + 16 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ paddingHorizontal: 22 }}>
        <Text style={styles.logo}>EcoBeauty Pro</Text>
        <Text style={styles.sub}>Espace marques, pharmacies & distributeurs</Text>

        <View style={styles.hero}>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={styles.statVal}>—</Text>
              <Text style={styles.statLbl}>Listings en ligne</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statVal}>—</Text>
              <Text style={styles.statLbl}>En vérification</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statVal}>—</Text>
              <Text style={styles.statLbl}>Unités sauvées</Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/pro/ajouter-produit')}
          style={({ pressed }) => [styles.primaryCta, pressed && { opacity: 0.92 }]}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={styles.primaryCtaTxt}>Ajouter un produit</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Prochaines étapes</Text>
          <Text style={styles.cardBody}>
            Complétez un listing avec photos (face, ingrédients, batch), DLC, PAO et état du packaging. Nos experts
            beauté valident sous 24 h en moyenne.
          </Text>
        </View>

        <Pressable onPress={goClientSpace} style={styles.linkRow}>
          <Ionicons name="sparkles-outline" size={20} color={SAGE} />
          <Text style={styles.linkTxt}>Découvrir l’espace client (B2C)</Text>
          <Ionicons name="chevron-forward" size={18} color={MUTED} />
        </Pressable>

        <Pressable onPress={goGateway} style={{ marginTop: 8 }}>
          <Text style={styles.mutedLink}>Retour au choix Particulier / Pro</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: SLATE,
    letterSpacing: -0.5,
    ...(Platform.OS === 'web' ? ({ fontFamily: 'Fraunces, Georgia, serif' } as const) : { fontFamily: 'Georgia' }),
  },
  sub: {
    marginTop: 6,
    fontSize: 14,
    color: MUTED,
    lineHeight: 20,
  },
  hero: {
    marginTop: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(156, 175, 136, 0.35)',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '800', color: SLATE },
  statLbl: { marginTop: 4, fontSize: 11, color: MUTED, textAlign: 'center' },
  primaryCta: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: SAGE,
    paddingVertical: 16,
    borderRadius: 16,
  },
  primaryCtaTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
  card: {
    marginTop: 18,
    padding: 18,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: SLATE },
  cardBody: { marginTop: 8, fontSize: 14, color: MUTED, lineHeight: 20 },
  linkRow: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  linkTxt: { flex: 1, fontSize: 15, fontWeight: '700', color: SLATE },
  mutedLink: {
    marginTop: 8,
    fontSize: 13,
    color: MUTED,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
