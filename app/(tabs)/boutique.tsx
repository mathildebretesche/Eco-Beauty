import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  useWindowDimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { PRODUCTS, type Product } from '@/lib/products';
import { useCart } from '@/lib/CartContext';

const SAGE = '#9CAF88';
const SAGE_SOFT = 'rgba(156, 175, 136, 0.22)';
const CREAM = '#F7F4EF';
const DUSTY_ROSE = '#C9A7A7';
const DUSTY_DEEP = '#A67F7F';
const TEXT = '#2C2C2C';
const TEXT_MUTED = '#6B6B6B';
const MAX_WEB = 1240;
const GAP = 14;

function discountPercent(p: Product): number | null {
  if (!p.originalPrice || p.originalPrice <= p.price) return null;
  return Math.round((1 - p.price / p.originalPrice) * 100);
}

export default function BoutiqueScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { addToCart, cart } = useCart();
  const [query, setQuery] = useState('');

  const isWeb = Platform.OS === 'web';
  const contentWidth = isWeb ? Math.min(width, MAX_WEB) : width;
  const pad = isWeb ? 28 : 18;
  const inner = contentWidth - pad * 2;
  const columns = isWeb ? (width >= 1080 ? 4 : width >= 720 ? 3 : 2) : 2;
  const cardWidth = (inner - GAP * (columns - 1)) / columns;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const addProduct = (p: Product) => {
    addToCart({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      category: `${p.category.level1} > ${p.category.level2}${
        p.category.level3 ? ` > ${p.category.level3}` : ''
      }`,
      expirationDate: p.expirationDate,
      image: p.image,
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Fond crème + “grain” léger (web) + halos pastel */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: CREAM }]} />
        {isWeb ? (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: 0.45,
                ...( {
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.014) 2px, rgba(0,0,0,0.014) 3px)',
                } as object ),
              },
            ]}
          />
        ) : null}
        <View
          style={{
            position: 'absolute',
            top: -80,
            left: -60,
            width: 220,
            height: 220,
            borderRadius: 999,
            backgroundColor: 'rgba(201, 167, 167, 0.18)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 140,
            right: -70,
            width: 260,
            height: 260,
            borderRadius: 999,
            backgroundColor: SAGE_SOFT,
          }}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
          alignItems: isWeb ? 'center' : undefined,
        }}
      >
        <View style={{ width: isWeb ? contentWidth : '100%', paddingHorizontal: pad }}>
          {/* Header site web : logo + recherche + panier */}
          <View style={[styles.headerGlass, isWeb && styles.headerGlassWeb]}>
            <View style={styles.headerRow}>
              <View style={styles.logoMark}>
                <Ionicons name="leaf" size={20} color={SAGE} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.logoSerif}>EcoBeauty</Text>
                <Text style={styles.tagline}>Anti-gaspillage · Luxe responsable</Text>
              </View>
              <Link href="/cart" asChild>
                <Pressable style={styles.iconBtn} accessibilityLabel="Panier">
                  <Ionicons name="bag-outline" size={22} color={TEXT} />
                  {cart.length > 0 ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeTxt}>{cart.length}</Text>
                    </View>
                  ) : null}
                </Pressable>
              </Link>
            </View>

            <View style={styles.searchRow}>
              <Ionicons name="search" size={18} color={TEXT_MUTED} style={{ marginRight: 8 }} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Rechercher un produit…"
                placeholderTextColor={TEXT_MUTED}
                style={styles.searchInput}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Bandeau promo */}
          <View style={styles.promoBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.promoEyebrow}>Offres du moment</Text>
              <Text style={styles.promoTitle}>Jusqu&apos;à -40 % sur le soin sélectionné</Text>
              <Text style={styles.promoSub}>Lots proches de la DLC — même efficacité, moins de gaspillage.</Text>
            </View>
            <View style={styles.promoPill}>
              <Text style={styles.promoPillText}>-40 %</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Soins & maquillage premium</Text>
          <Text style={styles.sectionHint}>
            {isWeb ? 'Grille adaptée au grand écran · cartes minimalistes' : 'Glissez pour parcourir la sélection'}
          </Text>

          <View style={[styles.grid, { gap: GAP }]}>
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} width={cardWidth} onAdd={() => addProduct(p)} />
            ))}
          </View>

          {filtered.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 24, color: TEXT_MUTED }}>
              Aucun produit ne correspond à « {query} ».
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

function ProductCard({
  product,
  width,
  onAdd,
}: {
  product: Product;
  width: number;
  onAdd: () => void;
}) {
  const pct = discountPercent(product);
  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.imageWrap}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, { backgroundColor: '#e8e4dc', alignItems: 'center', justifyContent: 'center' }]}>
            <Ionicons name="image-outline" size={32} color={TEXT_MUTED} />
          </View>
        )}
        {pct != null ? (
          <View style={styles.discountChip}>
            <Text style={styles.discountChipTxt}>-{pct}%</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.cardBody}>
        <View style={styles.tagPill}>
          <Text style={styles.tagPillTxt}>Anti-gaspillage</Text>
        </View>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.pname} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          {product.originalPrice != null && product.originalPrice > product.price ? (
            <Text style={styles.priceOld}>{product.originalPrice.toFixed(2)} €</Text>
          ) : null}
          <Text style={styles.priceNew}>{product.price.toFixed(2)} €</Text>
        </View>
        <Pressable onPress={onAdd} style={({ pressed }) => [styles.cta, pressed && { opacity: 0.88 }]}>
          <Text style={styles.ctaTxt}>Ajouter au panier</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: CREAM,
  },
  headerGlass: {
    marginTop: 8,
    borderRadius: 22,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  headerGlassWeb: {
    ...( {
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
    } as object ),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: SAGE_SOFT,
  },
  logoSerif: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: -0.5,
    ...(Platform.OS === 'web' ? ({ fontFamily: 'Fraunces, "Georgia", serif' } as const) : { fontFamily: 'Georgia' }),
  },
  tagline: {
    marginTop: 2,
    fontSize: 12,
    color: TEXT_MUTED,
    ...(Platform.OS === 'web' ? ({ fontFamily: '"DM Sans", system-ui, sans-serif' } as const) : {}),
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201, 167, 167, 0.35)',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: DUSTY_ROSE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeTxt: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'web' ? 12 : 10,
    backgroundColor: 'rgba(247, 244, 239, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(201, 167, 167, 0.45)',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: TEXT,
    ...(Platform.OS === 'web' ? ({ fontFamily: '"DM Sans", system-ui, sans-serif' } as const) : {}),
  },
  promoBanner: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(156, 175, 136, 0.28)',
    borderWidth: 1,
    borderColor: 'rgba(156, 175, 136, 0.45)',
  },
  promoEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: DUSTY_DEEP,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  promoTitle: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: '700',
    color: TEXT,
    maxWidth: 520,
  },
  promoSub: {
    marginTop: 6,
    fontSize: 13,
    color: TEXT_MUTED,
    maxWidth: 560,
    lineHeight: 18,
  },
  promoPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: DUSTY_ROSE,
  },
  promoPillText: {
    fontWeight: '800',
    color: DUSTY_DEEP,
    fontSize: 14,
  },
  sectionTitle: {
    marginTop: 26,
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
    ...(Platform.OS === 'web' ? ({ fontFamily: '"DM Sans", system-ui, sans-serif' } as const) : {}),
  },
  sectionHint: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 13,
    color: TEXT_MUTED,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.98)',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#eeeae4',
  },
  discountChip: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: DUSTY_ROSE,
  },
  discountChipTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: DUSTY_DEEP,
  },
  cardBody: {
    padding: 14,
  },
  tagPill: {
    alignSelf: 'flex-start',
    backgroundColor: SAGE_SOFT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  tagPillTxt: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4a5c3f',
    letterSpacing: 0.3,
  },
  brand: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pname: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '700',
    color: TEXT,
    minHeight: 40,
    ...(Platform.OS === 'web' ? ({ fontFamily: '"DM Sans", system-ui, sans-serif' } as const) : {}),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 10,
  },
  priceOld: {
    fontSize: 13,
    color: TEXT_MUTED,
    textDecorationLine: 'line-through',
  },
  priceNew: {
    fontSize: 17,
    fontWeight: '800',
    color: DUSTY_DEEP,
  },
  cta: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: SAGE,
  },
  ctaTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2,
  },
});
