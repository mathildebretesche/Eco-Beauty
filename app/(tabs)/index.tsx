import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { PRODUCTS } from '@/lib/products';
import { useCart } from '@/lib/CartContext';
import { useUserPreferences } from '@/lib/UserPreferencesContext';

const PASTEL_PINK = '#f8b4c4';
const PASTEL_GREEN = '#98d4a8';
const LIGHT_PINK = '#FFC5D3';

export default function RecommandationScreen() {
  const { addToCart, cart } = useCart();
  const { username, tags } = useUserPreferences();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, [fade]);

  const featured = useMemo(() => {
    const scored = PRODUCTS.map((p) => ({
      product: p,
      score: p.tags.reduce((acc, tag) => acc + (tags.includes(tag) ? 3 : 0), 0) + p.ecoScore / 100,
    }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.product);
    return scored.length ? scored : PRODUCTS.slice(0, 5);
  }, [tags]);

  const addFeaturedToCart = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      // Format identique au panier
      category: `${product.category.level1} > ${product.category.level2}${
        product.category.level3 ? ` > ${product.category.level3}` : ''
      }`,
      expirationDate: product.expirationDate,
    });
  };

  const glassStyle = (tone: 'pink' | 'green') => {
    const tint = tone === 'pink' ? PASTEL_PINK : PASTEL_GREEN;
    return {
      backgroundColor: 'rgba(255,255,255,0.40)',
      borderWidth: 1,
      borderColor: tint,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 6,
      // expo-web / react-native-web: blur via CSS
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
    } as const;
  };

  return (
    <Animated.View className="flex-1" style={{ backgroundColor: LIGHT_PINK, opacity: fade }}>
      {/* Décorations "mesh" (palette pastel inchangée) */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -120,
          left: -80,
          width: 240,
          height: 240,
          borderRadius: 999,
          backgroundColor: 'rgba(248, 180, 196, 0.55)',
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 120,
          right: -90,
          width: 260,
          height: 260,
          borderRadius: 999,
          backgroundColor: 'rgba(152, 212, 168, 0.45)',
        }}
      />

      <View className="px-4 pt-12 pb-6" style={{ backgroundColor: 'transparent' }}>
        <View
          style={{
            ...glassStyle('pink'),
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderRadius: 22,
          }}
        >
          <Text className="text-3xl font-extrabold" style={{ color: '#7c3aed' }}>
            Bonjour {username || 'beauty lover'}
          </Text>
          <Text className="mt-2 text-sm" style={{ color: '#6b7280' }}>
            Voici votre sélection Eco-responsable personnalisée.
          </Text>
        </View>

        {/* Boutons CTA */}
        <View className="flex-row mt-5 gap-3">
          <Link href="/flux" asChild>
            <Pressable
              className="flex-1"
              style={{
                ...glassStyle('green'),
                paddingVertical: 12,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="sparkles" size={20} color={PASTEL_GREEN} />
              <Text className="mt-2 font-semibold" style={{ color: '#166534' }}>
                Explorer le Flux
              </Text>
            </Pressable>
          </Link>
          <Link href="/map" asChild>
            <Pressable
              className="flex-1"
              style={{
                ...glassStyle('pink'),
                paddingVertical: 12,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="map" size={20} color={PASTEL_PINK} />
              <Text className="mt-2 font-semibold" style={{ color: '#7c3aed' }}>
                Trouver une boutique
              </Text>
            </Pressable>
          </Link>
        </View>

        <View className="mt-3">
          <Link href="/cart" asChild>
            <Pressable
              style={{
                ...glassStyle('green'),
                paddingVertical: 12,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 10,
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 999,
                  backgroundColor: 'rgba(152, 212, 168, 0.25)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="cart-outline" size={18} color={PASTEL_GREEN} />
              </View>
              <Text className="font-semibold" style={{ color: '#166534' }}>
                Panier ({cart.length})
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        <View
          style={{
            borderRadius: 26,
            padding: 18,
            ...glassStyle('pink'),
            marginBottom: 14,
          }}
        >
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: 'rgba(152,212,168,0.18)', borderWidth: 1, borderColor: PASTEL_GREEN }}
          >
            <Ionicons name="leaf" size={48} color={PASTEL_GREEN} />
          </View>
          <Text className="text-xl font-bold text-center mb-2" style={{ color: '#1f2937' }}>
            Bienvenue sur EcoBeauty
          </Text>
          <Text className="text-center" style={{ color: '#6b7280' }}>
            Explorez le Flux pour ajouter vos essentiels, puis passez par la Carte pour trouver les magasins proches.
          </Text>
        </View>

        <View
          style={{
            borderRadius: 22,
            padding: 16,
            ...glassStyle('green'),
            marginBottom: 16,
          }}
        >
          <Text className="font-semibold mb-2" style={{ color: '#166534' }}>
            💡 Conseil du jour
          </Text>
          <Text className="text-sm" style={{ color: '#6b7280' }}>
            Vérifiez toujours la date d’expiration de vos produits cosmétiques pour une utilisation optimale et sûre.
          </Text>
        </View>

        {/* Carrousel de recommandations */}
        <View style={{ marginBottom: 12 }}>
          <Text className="text-lg font-bold mb-3" style={{ color: '#7c3aed' }}>
            Recommandés pour vous
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {featured.map((product) => (
              <View
                key={product.id}
                style={{
                  width: 210,
                  borderRadius: 22,
                  padding: 14,
                  ...glassStyle('pink'),
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text className="text-xs font-semibold" style={{ color: '#6b7280' }}>
                    {product.brand}
                  </Text>
                  <View style={{ backgroundColor: 'rgba(152,212,168,0.22)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ color: '#166534', fontWeight: '700', fontSize: 11 }}>Eco {product.ecoScore}</Text>
                  </View>
                </View>
                <Text className="text-base font-bold mt-1" style={{ color: '#1f2937' }}>
                  {product.name}
                </Text>
                <Text className="text-xs mt-1" style={{ color: '#6b7280' }}>
                  {product.tags[0] || product.category.level2}
                </Text>
                <Text className="text-sm font-extrabold mt-2" style={{ color: PASTEL_GREEN }}>
                  {product.price.toFixed(2)} €
                </Text>

                <Pressable
                  onPress={() => addFeaturedToCart(product.id)}
                  style={{
                    marginTop: 12,
                    borderRadius: 16,
                    paddingVertical: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(152, 212, 168, 0.25)',
                    borderWidth: 1,
                    borderColor: PASTEL_GREEN,
                  }}
                >
                  <Text className="font-semibold" style={{ color: '#166534' }}>
                    Ajouter au panier
                  </Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </Animated.View>
  );
}
