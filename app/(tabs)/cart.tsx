import { useCart } from '@/lib/CartContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const PASTEL_PINK = '#f8b4c4';
const PASTEL_GREEN = '#98d4a8';
const LIGHT_PINK = '#FFC5D3';

export default function CartScreen() {
  const { cart, removeFromCart, total } = useCart();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 320, useNativeDriver: true }).start();
  }, [fade]);

  return (
    <Animated.View className="flex-1" style={{ backgroundColor: LIGHT_PINK, opacity: fade }}>
      <View className="px-4 pt-12 pb-4" style={{ backgroundColor: 'rgba(248,180,196,0.95)' }}>
        <Text className="text-2xl font-bold" style={{ color: '#7c3aed' }}>
          Panier
        </Text>
        <Text className="mt-1 text-sm" style={{ color: '#6b7280' }}>
          {cart.length} article{cart.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {cart.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-24 h-24 rounded-full items-center justify-center mb-4" style={{ backgroundColor: '#ecfdf5' }}>
            <Ionicons name="cart-outline" size={48} color={PASTEL_GREEN} />
          </View>
          <Text className="text-lg font-semibold text-center mb-2" style={{ color: '#1f2937' }}>
            Votre panier est vide
          </Text>
          <Text className="text-center" style={{ color: '#6b7280' }}>
            Parcourez le Flux pour ajouter des produits éco-responsables.
          </Text>
        </View>
      ) : (
        <>
          <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
            {cart.map((item, index) => (
              <View
                key={`${item.id}-${index}`}
                className="mb-3 p-4 rounded-2xl flex-row items-center"
                style={{ backgroundColor: '#fff', shadowColor: PASTEL_PINK, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 }}
              >
                <View className="w-14 h-14 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: '#ecfdf5' }}>
                  <Ionicons name="sparkles" size={28} color={PASTEL_GREEN} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold" style={{ color: '#1f2937' }}>
                    {item.name}
                  </Text>
                  <Text className="text-sm" style={{ color: '#6b7280' }}>
                    {item.brand}
                  </Text>
                  <Text className="text-sm font-semibold mt-1" style={{ color: PASTEL_GREEN }}>
                    {item.price.toFixed(2)} €
                  </Text>
                </View>
                <Pressable
                  onPress={() => removeFromCart(item.id, index)}
                  className="p-2 rounded-full"
                  style={{ backgroundColor: '#fee2e2' }}
                >
                  <Ionicons name="trash-outline" size={20} color="#dc2626" />
                </Pressable>
              </View>
            ))}
          </ScrollView>

          <View
            className="px-4 py-4 border-t"
            style={{ backgroundColor: '#fff', borderTopColor: PASTEL_PINK }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold" style={{ color: '#1f2937' }}>
                Total
              </Text>
              <Text className="text-xl font-bold" style={{ color: PASTEL_GREEN }}>
                {total.toFixed(2)} €
              </Text>
            </View>
            <TouchableOpacity
            className="py-4 rounded-2xl items-center"
              style={{ backgroundColor: PASTEL_GREEN, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 }}
            >
              <Text className="text-lg font-bold text-white">Passer au paiement</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Animated.View>
  );
}
