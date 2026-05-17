import React from 'react';
import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUserPreferences } from '@/lib/UserPreferencesContext';

const SAGE = '#9CAF88';
const CREAM = '#F7F4EF';
const DUSTY = '#C9A7A7';
const SLATE = '#2C3E32';
const MUTED = '#5c6658';

const SPLIT_MIN = 720;

export default function GatewayScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { setUserSegment, onboarded } = useUserPreferences();
  const split = Platform.OS === 'web' && width >= SPLIT_MIN;

  const goClient = async () => {
    await setUserSegment('b2c');
    if (onboarded) router.replace('/(tabs)');
    else router.replace('/onboarding');
  };

  const goPro = async () => {
    await setUserSegment('b2b');
    router.replace('/pro/index');
  };

  const BlockClient = (
    <Pressable
      onPress={goClient}
      style={({ pressed }) => [
        styles.half,
        styles.clientBg,
        pressed && styles.pressed,
        split ? styles.halfSplit : styles.halfStack,
      ]}
    >
      <View style={styles.iconCircle}>
        <Ionicons name="leaf-outline" size={28} color={SAGE} />
      </View>
      <Text style={styles.serifTitle}>Je prends soin de moi (et de la planète)</Text>
      <Text style={styles.body}>
        Cosmétiques & parapharmacie anti-gaspi : DLC transparente, produits authentiques.
      </Text>
      <View style={styles.ctaClient}>
        <Text style={styles.ctaClientText}>Découvrir les pépites</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </View>
    </Pressable>
  );

  const BlockPro = (
    <Pressable
      onPress={goPro}
      style={({ pressed }) => [
        styles.half,
        styles.proBg,
        pressed && styles.pressed,
        split ? styles.halfSplit : styles.halfStack,
      ]}
    >
      <View style={[styles.iconCircle, { borderColor: 'rgba(44,62,50,0.12)' }]}>
        <Ionicons name="briefcase-outline" size={26} color={SLATE} />
      </View>
      <Text style={styles.serifTitlePro}>Je valorise mes invendus</Text>
      <Text style={styles.bodyPro}>
        Logistique responsable, mise en ligne guidée, vérification beauté avant publication.
      </Text>
      <View style={styles.ctaPro}>
        <Text style={styles.ctaProText}>Devenir partenaire</Text>
        <Ionicons name="arrow-forward" size={18} color={SLATE} />
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={[styles.brandRow, { paddingHorizontal: split ? 32 : 20 }]}>
        <Text style={styles.logo}>EcoBeauty</Text>
        <Text style={styles.logoSub}>50 % particuliers · 50 % professionnels</Text>
      </View>

      {split ? (
        <View style={styles.splitRow}>
          {BlockClient}
          <View style={styles.divider} />
          {BlockPro}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.stackScroll, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {BlockClient}
          <View style={styles.transitionBar} />
          {BlockPro}
        </ScrollView>
      )}

      <View style={[styles.trust, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Text style={styles.trustText}>
          DLC affichée · conformité · emballages décrits avec honnêteté
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: CREAM,
  },
  brandRow: {
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: 'center',
  },
  logo: {
    fontSize: 26,
    fontWeight: '700',
    color: SLATE,
    letterSpacing: -0.5,
    ...(Platform.OS === 'web' ? ({ fontFamily: 'Fraunces, Georgia, serif' } as const) : { fontFamily: 'Georgia' }),
  },
  logoSub: {
    marginTop: 4,
    fontSize: 12,
    color: MUTED,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  splitRow: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 0,
  },
  stackScroll: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  half: {
    justifyContent: 'center',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
  },
  halfSplit: {
    flex: 1,
    minHeight: 360,
    marginBottom: 8,
  },
  halfStack: {
    width: '100%',
    minHeight: 280,
    marginBottom: 0,
  },
  clientBg: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderColor: 'rgba(201, 167, 167, 0.35)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  proBg: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderColor: 'rgba(156, 175, 136, 0.4)',
    ...(Platform.OS === 'web'
      ? ({
          backgroundImage:
            'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(247,244,239,0.75) 100%)',
        } as object)
      : {}),
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.992 }],
  },
  divider: {
    width: 1,
    marginVertical: 32,
    backgroundColor: 'rgba(156, 175, 136, 0.25)',
  },
  transitionBar: {
    height: 10,
    marginVertical: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(156, 175, 136, 0.2)',
    alignSelf: 'center',
    width: '42%',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(201, 167, 167, 0.25)',
  },
  serifTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: SLATE,
    lineHeight: 28,
    maxWidth: 420,
    ...(Platform.OS === 'web' ? ({ fontFamily: 'Fraunces, Georgia, serif' } as const) : { fontFamily: 'Georgia' }),
  },
  serifTitlePro: {
    fontSize: 22,
    fontWeight: '700',
    color: SLATE,
    lineHeight: 28,
    maxWidth: 420,
    ...(Platform.OS === 'web' ? ({ fontFamily: 'Fraunces, Georgia, serif' } as const) : { fontFamily: 'Georgia' }),
  },
  body: {
    marginTop: 10,
    fontSize: 14,
    color: MUTED,
    lineHeight: 20,
    maxWidth: 400,
  },
  bodyPro: {
    marginTop: 10,
    fontSize: 14,
    color: '#4a5548',
    lineHeight: 20,
    maxWidth: 400,
  },
  ctaClient: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: SAGE,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  ctaClientText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  ctaPro: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: SLATE,
  },
  ctaProText: {
    color: SLATE,
    fontWeight: '800',
    fontSize: 15,
  },
  trust: {
    paddingHorizontal: 20,
    paddingTop: 8,
    alignItems: 'center',
  },
  trustText: {
    fontSize: 11,
    color: MUTED,
    textAlign: 'center',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});
