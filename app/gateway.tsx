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
  
  // 1. On récupère TOUT ici, à l'intérieur du composant
  const { setUserSegment, onboarded, completeOnboarding } = useUserPreferences();
  const split = Platform.OS === 'web' && width >= SPLIT_MIN;

  // 2. La fonction DEV est bien à l'intérieur du composant
  const handleDevSkipAll = async () => {
    await setUserSegment('b2c');
    if (!onboarded && completeOnboarding) {
      await completeOnboarding({
        username: 'Dev',
        email: 'dev@ecobeauty.local',
        tags: ['Soins'], 
      });
    }
    router.replace('/(tabs)');
  };

  const goClient = async () => {
    await setUserSegment('b2c');
    if (onboarded) router.replace('/(tabs)');
    else router.replace('/onboarding');
  };

  const goPro = async () => {
    await setUserSegment('b2b');
    router.replace('/pro');
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

  // 3. Le bouton est ajouté dans le return global du composant
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {__DEV__ && (
        <Pressable
          onPress={handleDevSkipAll}
          style={{
            position: 'absolute',
            top: insets.top + 14,
            right: 14,
            zIndex: 20,
            backgroundColor: '#111827',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 11 }}>DEV • Go to App</Text>
        </Pressable>
      )}

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
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  stackScroll: {
    flexGrow: 1,
  },
  transitionBar: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 20,
  },
  trust: {
    alignItems: 'center',
    paddingTop: 16,
  },
  trustText: {
    fontSize: 11,
    color: MUTED,
    textAlign: 'center',
  },
  half: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  halfSplit: {
    paddingHorizontal: 40,
  },
  halfStack: {
    paddingVertical: 40,
  },
  clientBg: {
    backgroundColor: '#FFFFFF',
  },
  proBg: {
    backgroundColor: '#F3F4F6',
  },
  pressed: {
    opacity: 0.8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(156,175,136,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  serifTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: SLATE,
    textAlign: 'center',
    marginBottom: 12,
  },
  serifTitlePro: {
    fontSize: 22,
    fontWeight: '700',
    color: SLATE,
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  bodyPro: {
    fontSize: 15,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  ctaClient: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SAGE,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  ctaClientText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
  ctaPro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: SLATE,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  ctaProText: {
    color: SLATE,
    fontWeight: '600',
    marginRight: 8,
  },
});