import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  Modal,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

const SAGE = '#9CAF88';
const SLATE = '#2C3E32';
const MUTED = '#5c6658';

type PhotoSlot = 'face' | 'ingredients' | 'batch';
type Category = 'Soin' | 'Maquillage' | 'Capillaire';
type Packaging = 'neuf_scelle' | 'neuf_sans_boite' | 'tres_bon';

const STEPS = ['Photos', 'Détails', 'Cosmétique', 'Packaging'] as const;

function SkeletonBox({ style }: { style?: object }) {
  const pulse = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.85, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.35, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return (
    <Animated.View
      style={[
        {
          backgroundColor: '#d4d9d0',
          borderRadius: 14,
          opacity: pulse,
        },
        style,
      ]}
    />
  );
}

export default function AjouterProduitScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [loadingSlot, setLoadingSlot] = useState<PhotoSlot | null>(null);
  const [photos, setPhotos] = useState<Partial<Record<PhotoSlot, string>>>({});
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [dlc, setDlc] = useState('');
  const [pao, setPao] = useState<'non_ouvert' | '6M' | '12M' | '24M' | 'autre'>('non_ouvert');
  const [packaging, setPackaging] = useState<Packaging | null>(null);
  const [certify, setCertify] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const checkScale = useRef(new Animated.Value(0)).current;

  const pickPhoto = async (slot: PhotoSlot) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission', 'Autorisez l’accès à la galerie pour ajouter des photos.');
      return;
    }
    setLoadingSlot(slot);
    await new Promise((r) => setTimeout(r, 600));
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.75,
    });
    setLoadingSlot(null);
    if (!result.canceled && result.assets[0]) {
      setPhotos((p) => ({ ...p, [slot]: result.assets[0].uri }));
    }
  };

  const canNext =
    step === 0
      ? !!(photos.face && photos.batch)
      : step === 1
        ? name.trim().length > 1 && brand.trim().length > 1 && category !== null
        : step === 2
          ? dlc.trim().length > 3
          : packaging !== null && certify;

  const submit = () => {
    checkScale.setValue(0);
    setSuccessOpen(true);
    requestAnimationFrame(() => {
      Animated.spring(checkScale, { toValue: 1, friction: 6, useNativeDriver: true }).start();
    });
  };

  const resetForm = () => {
    setSuccessOpen(false);
    checkScale.setValue(0);
    setStep(0);
    setPhotos({});
    setName('');
    setBrand('');
    setCategory(null);
    setDlc('');
    setPao('non_ouvert');
    setPackaging(null);
    setCertify(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F4EF' }}>
      <ScrollView
        contentContainerStyle={{
          padding: 18,
          paddingTop: 12,
          paddingBottom: insets.bottom + 28,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stepper}>
          {STEPS.map((label, i) => (
            <View key={label} style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  i <= step && { backgroundColor: SAGE, borderColor: SAGE },
                ]}
              >
                <Text style={[styles.stepNum, i <= step && { color: '#fff' }]}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepLbl, i === step && { color: SLATE, fontWeight: '800' }]}>{label}</Text>
            </View>
          ))}
        </View>

        {step === 0 && (
          <View>
            <Text style={styles.h}>Photos du produit</Text>
            <Text style={styles.p}>Face produit, liste ingrédients, code batch / DLC visible.</Text>
            {(['face', 'ingredients', 'batch'] as PhotoSlot[]).map((slot) => (
              <Pressable
                key={slot}
                onPress={() => pickPhoto(slot)}
                style={styles.dropZone}
              >
                {loadingSlot === slot ? (
                  <SkeletonBox style={{ height: 160, width: '100%' }} />
                ) : photos[slot] ? (
                  <Image source={{ uri: photos[slot]! }} style={styles.prevImg} />
                ) : (
                  <View style={styles.dropInner}>
                    <Ionicons name="cloud-upload-outline" size={32} color={MUTED} />
                    <Text style={styles.dropTitle}>
                      {slot === 'face' ? 'Face produit' : slot === 'ingredients' ? 'Ingrédients' : 'Batch / DLC'}
                    </Text>
                    <Text style={styles.dropHint}>Toucher pour importer</Text>
                  </View>
                )}
              </Pressable>
            ))}
            <Text style={styles.note}>Minimum : face + batch pour continuer.</Text>
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.h}>Détails</Text>
            <Text style={styles.label}>Nom du produit</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Ex. Sérum hydratant" />
            <Text style={styles.label}>Marque</Text>
            <TextInput value={brand} onChangeText={setBrand} style={styles.input} placeholder="Marque" />
            <Text style={styles.label}>Catégorie</Text>
            <View style={styles.chips}>
              {(['Soin', 'Maquillage', 'Capillaire'] as Category[]).map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[styles.chip, category === c && styles.chipOn]}
                >
                  <Text style={[styles.chipTxt, category === c && styles.chipTxtOn]}>{c}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.h}>Spécificités cosmétiques</Text>
            <Text style={styles.label}>Date de péremption (DLC / DDM)</Text>
            <TextInput
              value={dlc}
              onChangeText={setDlc}
              style={styles.input}
              placeholder="JJ/MM/AAAA ou fin de mois"
            />
            <Text style={styles.label}>PAO</Text>
            <View style={styles.chips}>
              {(
                [
                  ['non_ouvert', 'Non ouvert'],
                  ['12M', '12M'],
                  ['6M', '6M'],
                  ['24M', '24M'],
                ] as const
              ).map(([k, lab]) => (
                <Pressable key={k} onPress={() => setPao(k)} style={[styles.chip, pao === k && styles.chipOn]}>
                  <Text style={[styles.chipTxt, pao === k && styles.chipTxtOn]}>{lab}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.h}>État du packaging</Text>
            {(
              [
                ['neuf_scelle', 'Neuf scellé', 'Film ou scellé d’usine intact'],
                ['neuf_sans_boite', 'Neuf sans boîte', 'Produit neuf, emballage secondaire manquant'],
                ['tres_bon', 'Très bon état', 'Boîte légèrement marquée, contenu intact'],
              ] as const
            ).map(([id, title, desc]) => (
              <Pressable
                key={id}
                onPress={() => setPackaging(id)}
                style={[styles.packCard, packaging === id && styles.packCardOn]}
              >
                <Text style={styles.packTitle}>{title}</Text>
                <Text style={styles.packDesc}>{desc}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setCertify(!certify)} style={styles.checkRow}>
              <Ionicons
                name={certify ? 'checkbox' : 'square-outline'}
                size={22}
                color={certify ? SAGE : MUTED}
              />
              <Text style={styles.checkTxt}>Je certifie que les photos reflètent l’état réel du produit.</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.navRow}>
          {step > 0 ? (
            <Pressable onPress={() => setStep((s) => s - 1)} style={styles.btnSec}>
              <Text style={styles.btnSecTxt}>Retour</Text>
            </Pressable>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {step < STEPS.length - 1 ? (
            <Pressable
              disabled={!canNext}
              onPress={() => setStep((s) => s + 1)}
              style={[styles.btnPri, !canNext && { opacity: 0.45 }]}
            >
              <Text style={styles.btnPriTxt}>Continuer</Text>
            </Pressable>
          ) : (
            <Pressable
              disabled={!canNext}
              onPress={submit}
              style={[styles.btnPri, !canNext && { opacity: 0.45 }]}
            >
              <Text style={styles.btnPriTxt}>Envoyer pour vérification</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <Modal visible={successOpen} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Animated.View style={[styles.checkCircle, { transform: [{ scale: checkScale }] }]}>
              <Ionicons name="checkmark" size={40} color="#fff" />
            </Animated.View>
            <Text style={styles.modalTitle}>Merci pour votre engagement</Text>
            <Text style={styles.modalBody}>
              Nos expertes et experts beauté vérifient la conformité de votre article (DLC, authenticité,
              cohérence des photos). Vous recevrez une notification sous 24 h dès sa mise en ligne.
            </Text>
            <Pressable onPress={resetForm} style={styles.btnPri}>
              <Text style={styles.btnPriTxt}>Ajouter un autre article</Text>
            </Pressable>
            <Pressable onPress={() => { setSuccessOpen(false); router.back(); }} style={{ marginTop: 14 }}>
              <Text style={styles.linkOnly}>Retour au tableau de bord</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
    paddingHorizontal: 4,
  },
  stepItem: { alignItems: 'center', flex: 1 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#c5ccc0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  stepNum: { fontSize: 12, fontWeight: '800', color: MUTED },
  stepLbl: { marginTop: 6, fontSize: 10, color: MUTED, textAlign: 'center' },
  h: { fontSize: 20, fontWeight: '800', color: SLATE, marginBottom: 8 },
  p: { fontSize: 14, color: MUTED, marginBottom: 14, lineHeight: 20 },
  dropZone: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(156,175,136,0.45)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  dropInner: {
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  dropTitle: { marginTop: 8, fontWeight: '700', color: SLATE },
  dropHint: { marginTop: 4, fontSize: 12, color: MUTED },
  prevImg: { width: '100%', height: 180, resizeMode: 'cover' },
  note: { fontSize: 12, color: MUTED, marginTop: 4 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: '700', color: SLATE, fontSize: 13 },
  input: {
    borderWidth: 1,
    borderColor: '#d5d9d3',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'web' ? 12 : 10,
    backgroundColor: '#fff',
    fontSize: 15,
    color: SLATE,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d5d9d3',
  },
  chipOn: { backgroundColor: 'rgba(156,175,136,0.25)', borderColor: SAGE },
  chipTxt: { color: MUTED, fontWeight: '600' },
  chipTxtOn: { color: SLATE },
  packCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  packCardOn: { borderColor: SAGE, backgroundColor: 'rgba(156,175,136,0.12)' },
  packTitle: { fontWeight: '800', color: SLATE },
  packDesc: { marginTop: 4, fontSize: 13, color: MUTED },
  checkRow: { flexDirection: 'row', gap: 10, marginTop: 16, alignItems: 'flex-start' },
  checkTxt: { flex: 1, fontSize: 13, color: SLATE, lineHeight: 18 },
  navRow: { flexDirection: 'row', gap: 12, marginTop: 28, alignItems: 'center' },
  btnSec: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#e8ebe6',
    alignItems: 'center',
  },
  btnSecTxt: { fontWeight: '800', color: SLATE },
  btnPri: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: SAGE,
    alignItems: 'center',
  },
  btnPriTxt: { fontWeight: '800', color: '#fff', fontSize: 15 },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: SAGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: SLATE,
    textAlign: 'center',
  },
  modalBody: {
    marginTop: 12,
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },
  linkOnly: {
    fontSize: 14,
    fontWeight: '700',
    color: SAGE,
    textDecorationLine: 'underline',
  },
});
