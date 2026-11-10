
const images = import.meta.glob(
  '../assets/posts/*.{jpg,jpeg,png,webp}',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
);

const getImage = (number) => {
  const filename = `post-${String(number).padStart(2, '0')}`;
  const entry = Object.entries(images).find(([path]) =>
    path.split('/').pop().replace(/\.[^.]+$/, '') === filename
  );

  return entry?.[1] ?? '';
};

const descriptions = [
  'Unutilmas xotiralar 📸',
  'Salimning Zapallari 😂',
  'Oddiy kunlardan lavhalar',
  'Yaxshi kayfiyat!',
  'Style va kayfiyat',
  'Creative moment',
  'KING 👑',
  'Yo‘ldagi xotiralar',
  'Yangi obraz',
  'Har bir kun — yangi xotira',
  'Smile! 😁',
  'Good memories',
  'Random moment',
  'Road trip 🚗',
  'Just vibes',
  'Old memories',
  'Portrait',
  'Funny moments',
  'Everyday life',
  'Best moments'
];

const heights = [
  'large', 'medium', 'large', 'medium', 'medium',
  'medium', 'large', 'medium', 'large', 'medium',
  'medium', 'large', 'medium', 'large', 'medium',
  'medium', 'medium', 'large', 'medium', 'large'
];

export const posts = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;

  return {
    id: `post-${String(id).padStart(2, '0')}`,
    title: `Post #${String(id).padStart(2, '0')}`,
    description: descriptions[index],
    image: getImage(id),
    author: 'Salim',
    category: id === 2 ? 'Logo' : 'Xotiralar',
    type: 'image',
    date: '2026-11-10',
    height: heights[index],
    likes: 0,
    comments: []
  };
});

export const categories = [
  'Barchasi',
  'Xotiralar',
  'Logo'
];