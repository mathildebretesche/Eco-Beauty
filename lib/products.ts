export interface Product {
  id: string;
  name: string;
  brand: string;
  expirationDate: string;
  category: {
    level1: 'Maquillage' | 'Soin de la peau';
    level2: string;
    level3?: string;
  };
  /** Prix affiché (ex. anti-gaspillage / promo) */
  price: number;
  /** Prix public barré, optionnel */
  originalPrice?: number;
  ecoScore: number;
  tags: string[];
  image?: string;
}

/** Visuels soins / maquillage (Pexels, hotlink autorisé). */
const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`;

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Crème Jeunesse',
    brand: 'Garnier',
    expirationDate: '18/03/2026',
    category: { level1: 'Soin de la peau', level2: 'Crèmes', level3: 'Hydratante' },
    price: 12.99,
    originalPrice: 18.5,
    ecoScore: 92,
    tags: ['Soin de la peau', 'Hydratation intense', 'Peaux sensibles / rougeurs'],
    image: px(3785147),
  },
  {
    id: '2',
    name: 'Rouge à Lèvres Velours',
    brand: "L'Oréal",
    expirationDate: '22/05/2026',
    category: { level1: 'Maquillage', level2: 'Bouche', level3: 'Rouge à lèvres' },
    price: 14.5,
    originalPrice: 21.0,
    ecoScore: 79,
    tags: ['Maquillage Teint', 'Ingrédients bio & vegan', 'Éclat du teint / glow'],
    image: px(2648705),
  },
  {
    id: '3',
    name: 'Palette Fard à Paupières',
    brand: 'Maybelline',
    expirationDate: '10/08/2026',
    category: { level1: 'Maquillage', level2: 'Yeux', level3: 'Fard à paupières' },
    price: 18.9,
    originalPrice: 26.9,
    ecoScore: 84,
    tags: ['Maquillage Yeux', 'Ingrédients bio & vegan', 'Parfums naturels'],
    image: px(3018845),
  },
  {
    id: '4',
    name: 'Huile Nourrissante Visage',
    brand: 'Nuxe',
    expirationDate: '15/04/2026',
    category: { level1: 'Soin de la peau', level2: 'Huile', level3: 'Nourrissante' },
    price: 24.0,
    originalPrice: 34.5,
    ecoScore: 95,
    tags: ['Texture huile / sérum', 'Hydratation intense', 'Détox & anti-pollution'],
    image: px(4465124),
  },
  {
    id: '5',
    name: 'Baume Réparateur',
    brand: 'La Roche-Posay',
    expirationDate: '30/06/2026',
    category: { level1: 'Soin de la peau', level2: 'Baume', level3: 'Réparateur' },
    price: 16.75,
    originalPrice: 23.9,
    ecoScore: 88,
    tags: ['Peaux sensibles / rougeurs', 'Tendances Acnéiques', 'Soin de la peau'],
    image: px(3785145),
  },
  {
    id: '6',
    name: 'Sérum Éclat Céramides',
    brand: 'CeraVe',
    expirationDate: '12/09/2026',
    category: { level1: 'Soin de la peau', level2: 'Crèmes', level3: 'Hydratante' },
    price: 19.9,
    originalPrice: 28.0,
    ecoScore: 90,
    tags: ['Hydratation intense', 'Peaux sensibles / rougeurs'],
    image: px(3373735),
  },
  {
    id: '7',
    name: 'Eau Micellaire Douceur',
    brand: 'Bioderma',
    expirationDate: '01/11/2026',
    category: { level1: 'Soin de la peau', level2: 'Crèmes', level3: 'Hydratante' },
    price: 11.5,
    originalPrice: 16.9,
    ecoScore: 87,
    tags: ['Détox & anti-pollution', 'Peaux sensibles / rougeurs'],
    image: px(4041392),
  },
  {
    id: '8',
    name: 'Masque Nuit Régénérant',
    brand: 'Estée Lauder',
    expirationDate: '20/02/2027',
    category: { level1: 'Soin de la peau', level2: 'Baume', level3: 'Nourrissant' },
    price: 42.0,
    originalPrice: 65.0,
    ecoScore: 82,
    tags: ['Hydratation intense', 'Éclat du teint / glow'],
    image: px(3785148),
  },
];

export const FILTER_OPTIONS = {
  'Maquillage': {
    level2: ['Teint', 'Bouche', 'Yeux', 'Sourcils'],
    level3: {
      Teint: ['Fond de teint', 'Correcteur', 'Poudre'],
      Bouche: ['Rouge à lèvres', 'Gloss', 'Crayon'],
      Yeux: ['Fard à paupières', 'Mascara', 'Eyeliner'],
      Sourcils: ['Crayon sourcils', 'Gel sourcils', 'Poudre sourcils'],
    },
  },
  'Soin de la peau': {
    level2: ['Crèmes', 'Huile', 'Baume'],
    level3: {
      Crèmes: ['Hydratante', 'Anti-âge', 'Éclaircissante'],
      Huile: ['Nourrissante', 'Démaquillante', 'Sérum'],
      Baume: ['Réparateur', 'Apaisant', 'Nourrissant'],
    },
  },
};
