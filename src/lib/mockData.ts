export type SkinProfile = {
  skin_type: 'oily' | 'dry' | 'combination' | 'normal';
  acne_level: 'none' | 'occasional' | 'frequent';
  sensitivity_score: 1 | 2 | 3;
  pigmentation: boolean;
  hormonal_condition: 'none' | 'pcod' | 'other' | 'prefer_not_to_say';
  climate: 'humid' | 'dry' | 'cold' | 'mixed';
  skin_profile_hash?: string;
};

export const MOCK_PROFILE: SkinProfile = {
  skin_type: 'combination',
  acne_level: 'frequent',
  sensitivity_score: 2,
  pigmentation: true,
  hormonal_condition: 'pcod',
  climate: 'humid',
  skin_profile_hash: 'comb-freq-2-pig-pcod-hum'
};

export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    category: 'serum',
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=640&auto=format&fit=crop',
    suitabilityScore: 82,
    trustLevel: 'high',
    workedPercentage: 82,
    failedPercentage: 6,
    neutralPercentage: 12,
    ingredientFlags: [
      { ingredient: 'Zinc PCA', reason: 'Great for reducing sebum production.', status: 'positive' }
    ],
    reviews: [
      { id: 'r1', user_name: 'Aisha', similarity: 'Exact match (Has PCOD)', text: 'Completely cleared up my hormonal breakouts!', outcome: 'worked' },
      { id: 'r2', user_name: 'Priya', similarity: 'Similar skin type', text: 'Good but slightly drying if not layered properly.', outcome: 'neutral' }
    ]
  },
  {
    id: '2',
    name: 'Salicylic Acid 2% Masque',
    brand: 'The Ordinary',
    category: 'treatment',
    image_url: 'https://images.unsplash.com/photo-1615397323145-a76c026da4f7?q=80&w=640&auto=format&fit=crop',
    suitabilityScore: 65,
    trustLevel: 'medium',
    workedPercentage: 65,
    failedPercentage: 20,
    neutralPercentage: 15,
    ingredientFlags: [
      { ingredient: 'Salicylic Acid', reason: 'Excellent for acne, but can be too strong for sensitive days.', status: 'warning' },
      { ingredient: 'Squalane', reason: 'May be comedogenic for some sensitive PCOD users.', status: 'negative' }
    ],
    reviews: [
      { id: 'r3', user_name: 'Sarah', similarity: 'Also has PCOD', text: 'Too harsh for me, burned my skin.', outcome: 'didnt_work' },
      { id: 'r4', user_name: 'Neha', similarity: 'Exact match', text: 'Works well as a spot treatment.', outcome: 'worked' }
    ]
  },
  {
    id: '3',
    name: 'Snail Mucin 96% Power Essence',
    brand: 'COSRX',
    category: 'serum',
    image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=640&auto=format&fit=crop',
    suitabilityScore: 91,
    trustLevel: 'high',
    workedPercentage: 91,
    failedPercentage: 2,
    neutralPercentage: 7,
    ingredientFlags: [
      { ingredient: 'Snail Secretion Filtrate', reason: 'Intensely hydrating and soothing, perfect for sensitive skin.', status: 'positive' }
    ],
    reviews: [
      { id: 'r5', user_name: 'Riya', similarity: 'Similar skin type', text: 'Holy grail! Calms down all red patches.', outcome: 'worked' }
    ]
  }
];
