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
  price: number;
  ecoScore: number;
  tags: string[];
  image?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Crème Jeunesse',
    brand: 'Garnier',
    expirationDate: '18/03/2026',
    category: { level1: 'Soin de la peau', level2: 'Crèmes', level3: 'Hydratante' },
    price: 12.99,
    ecoScore: 92,
    tags: ['Soin de la peau', 'Hydratation intense', 'Peaux sensibles / rougeurs'],
  },
  {
    id: '2',
    name: 'Rouge à Lèvres Velours',
    brand: 'L\'Oréal',
    expirationDate: '22/05/2026',
    category: { level1: 'Maquillage', level2: 'Bouche', level3: 'Rouge à lèvres' },
    price: 14.50,
    ecoScore: 79,
    tags: ['Maquillage Teint', 'Ingrédients bio & vegan', 'Éclat du teint / glow'],
  },
  {
    id: '3',
    name: 'Palette Fard à Paupières',
    brand: 'Maybelline',
    expirationDate: '10/08/2026',
    category: { level1: 'Maquillage', level2: 'Yeux', level3: 'Fard à paupières' },
    price: 18.90,
    ecoScore: 84,
    tags: ['Maquillage Yeux', 'Ingrédients bio & vegan', 'Parfums naturels'],
  },
  {
    id: '4',
    name: 'Huile Nourrissante Visage',
    brand: 'Nuxe',
    expirationDate: '15/04/2026',
    category: { level1: 'Soin de la peau', level2: 'Huile', level3: 'Nourrissante' },
    price: 24.00,
    ecoScore: 95,
    tags: ['Texture huile / sérum', 'Hydratation intense', 'Détox & anti-pollution'],
  },
  {
    id: '5',
    name: 'Baume Réparateur',
    brand: 'La Roche-Posay',
    expirationDate: '30/06/2026',
    category: { level1: 'Soin de la peau', level2: 'Baume', level3: 'Réparateur' },
    price: 16.75,
    ecoScore: 88,
    tags: ['Peaux sensibles / rougeurs', 'Tendances Acnéiques', 'Soin de la peau'],
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
