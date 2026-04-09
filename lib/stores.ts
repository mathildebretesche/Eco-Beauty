export interface Store {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export const STORES: Store[] = [
  { id: '1', name: 'EcoBeauty Marais', address: '12 Rue des Archives, 75004 Paris', lat: 48.8584, lng: 2.3589 },
  { id: '2', name: 'EcoBeauty Saint-Germain', address: '45 Boulevard Saint-Germain, 75005 Paris', lat: 48.8534, lng: 2.3488 },
  { id: '3', name: 'EcoBeauty Champs-Élysées', address: '78 Avenue des Champs-Élysées, 75008 Paris', lat: 48.8698, lng: 2.3078 },
  { id: '4', name: 'EcoBeauty Montmartre', address: '23 Rue Lepic, 75018 Paris', lat: 48.8867, lng: 2.3431 },
  { id: '5', name: 'EcoBeauty Bastille', address: '15 Rue de la Roquette, 75011 Paris', lat: 48.8534, lng: 2.3692 },
];

export const PARIS_CENTER = { lat: 48.8566, lng: 2.3522 };
