import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRODUCTS, FILTER_OPTIONS } from '@/lib/products';
import { useCart } from '@/lib/CartContext';
import type { Product } from '@/lib/products';
import type { CartProduct } from '@/lib/CartContext';

const PASTEL_PINK = '#f8b4c4';
const PASTEL_GREEN = '#98d4a8';
const LIGHT_PINK = '#FFC5D3';
const OVERLAY_DARK = 'rgba(17,24,39,0.34)';

function filterProducts(
  level1: string | null,
  level2: string | null,
  level3: string | null
): Product[] {
  if (!level1) return PRODUCTS;
  return PRODUCTS.filter((p) => {
    if (p.category.level1 !== level1) return false;
    if (!level2) return true;
    if (p.category.level2 !== level2) return false;
    if (!level3) return true;
    return p.category.level3 === level3;
  });
}

export default function FluxScreen() {
  const [level1, setLevel1] = useState<string | null>(null);
  const [level2, setLevel2] = useState<string | null>(null);
  const [level3, setLevel3] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();
  const { width } = useWindowDimensions();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 320, useNativeDriver: true }).start();
  }, [fade]);

  const level2Options: string[] = level1
    ? (FILTER_OPTIONS[level1 as keyof typeof FILTER_OPTIONS]?.level2 ?? [])
    : [];
  const level3Options: string[] =
    level1 && level2
      ? ((FILTER_OPTIONS[level1 as keyof typeof FILTER_OPTIONS]?.level3 as Record<string, string[]> | undefined)?.[
          level2
        ] ?? [])
      : [];

  const filteredProducts = useMemo(
    () => filterProducts(level1, level2, level3),
    [level1, level2, level3]
  );
  const columns = width < 520 ? 2 : 4;
  const cardSize = Math.floor((width - 4) / columns);

  const handleAddToCart = (product: Product) => {
    const cartProduct: CartProduct = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      category: `${product.category.level1} > ${product.category.level2}${product.category.level3 ? ` > ${product.category.level3}` : ''}`,
      expirationDate: product.expirationDate,
    };
    addToCart(cartProduct);
  };

  return (
    <Animated.View className="flex-1" style={{ backgroundColor: LIGHT_PINK, opacity: fade }}>
      <View className="px-4 pt-12 pb-4" style={{ backgroundColor: 'rgba(248,180,196,0.95)' }}>
        <Text className="text-2xl font-bold" style={{ color: '#7c3aed' }}>
          Flux Produits
        </Text>
        <Text className="mt-1 text-sm" style={{ color: '#6b7280' }}>
          Grille découverte compacte
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={{ width: cardSize, height: cardSize, margin: 0.5, backgroundColor: '#f3f4f6', overflow: 'hidden', borderRadius: 6 }}>
              <Pressable onPress={() => handleAddToCart(product)} style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'flex-end', padding: 6 }}>
                  {product.ecoScore >= 85 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(152,212,168,0.28)', borderRadius: 999, paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Ionicons name="leaf" size={10} color="#166534" />
                      <Text style={{ marginLeft: 3, color: '#166534', fontWeight: '700', fontSize: 10 }}>{product.ecoScore}</Text>
                    </View>
                  )}
                </View>
                <View style={{ backgroundColor: OVERLAY_DARK, paddingHorizontal: 6, paddingVertical: 7 }}>
                  <Text numberOfLines={1} style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>
                    {product.name}
                  </Text>
                  <Text numberOfLines={1} style={{ color: '#d1d5db', fontSize: 10 }}>
                    {product.brand}
                  </Text>
                  <Text style={{ color: PASTEL_GREEN, fontSize: 11, fontWeight: '700' }}>{product.price.toFixed(2)} €</Text>
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => setShowFilters((v) => !v)}
        style={{
          position: 'absolute',
          right: 18,
          bottom: 104,
          width: 52,
          height: 52,
          borderRadius: 999,
          backgroundColor: PASTEL_GREEN,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 7,
        }}
      >
        <Ionicons name="options-outline" size={24} color="#14532d" />
      </Pressable>

      {showFilters && (
        <View
          style={{
            position: 'absolute',
            right: 16,
            top: 120,
            width: 280,
            maxHeight: 360,
            backgroundColor: 'rgba(255,255,255,0.96)',
            borderRadius: 18,
            borderWidth: 1,
            borderColor: PASTEL_PINK,
            padding: 12,
          }}
        >
          <Text style={{ color: '#7c3aed', fontWeight: '700', marginBottom: 8 }}>Filtres dynamiques</Text>
          <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 6 }}>Niveau 1</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
            {(['Maquillage', 'Soin de la peau'] as const).map((opt) => (
              <Pressable
                key={opt}
                onPress={() => {
                  setLevel1(opt);
                  setLevel2(null);
                  setLevel3(null);
                }}
                style={{
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  backgroundColor: level1 === opt ? PASTEL_GREEN : '#f3f4f6',
                }}
              >
                <Text style={{ fontSize: 12, color: level1 === opt ? '#14532d' : '#6b7280' }}>{opt}</Text>
              </Pressable>
            ))}
          </View>

          {level2Options.length > 0 && (
            <>
              <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 6 }}>Niveau 2</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {level2Options.map((opt) => (
                  <Pressable
                    key={opt}
                    onPress={() => {
                      setLevel2(opt);
                      setLevel3(null);
                    }}
                    style={{
                      borderRadius: 999,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      backgroundColor: level2 === opt ? PASTEL_GREEN : '#f3f4f6',
                    }}
                  >
                    <Text style={{ fontSize: 12, color: level2 === opt ? '#14532d' : '#6b7280' }}>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {level3Options.length > 0 && (
            <>
              <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 6 }}>Niveau 3</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {level3Options.map((opt) => (
                  <Pressable
                    key={opt}
                    onPress={() => setLevel3(opt)}
                    style={{
                      borderRadius: 999,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      backgroundColor: level3 === opt ? PASTEL_GREEN : '#f3f4f6',
                    }}
                  >
                    <Text style={{ fontSize: 12, color: level3 === opt ? '#14532d' : '#6b7280' }}>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </View>
      )}
    </Animated.View>
  );
}
