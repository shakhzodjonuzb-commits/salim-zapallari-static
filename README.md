# Salim Zapallari — Static PWA

Pinterest-uslubidagi oddiy React + Vite galereya. **Backend, database, admin panel, R2 yoki upload API yo‘q.** Barcha postlar loyiha ichidagi fayllardan olinadi.

## Talablar

- Node.js 20 yoki undan yangiroq
- npm

## Lokal ishga tushirish

```bash
npm install
npm run dev
```

Terminal ko‘rsatgan lokal manzilni brauzerda oching.

Production build:

```bash
npm run build
npm run preview
```

Build natijasi `dist/` papkasiga yoziladi.

## Yangi post qo‘shish

1. Rasm yoki videoni `src/assets/posts/` papkasiga qo‘ying.
2. `src/data/posts.js` faylini oching.
3. Faylni import qiling va `posts` ro‘yxatiga yangi obyekt qo‘shing.

Rasm misoli:

```js
import myPhoto from '../assets/posts/my-photo.jpg';

// posts massivining ichiga:
{
  id: 'my-post-07', // Har bir post ID'si unikal bo‘lsin
  title: 'Mening yangi postim',
  description: 'Post haqida qisqa izoh.',
  image: myPhoto,
  author: 'Salim',
  category: 'Ilhom', // Ilhom, G‘oyalar, Dizayn yoki Hayot
  type: 'image',
  date: 'Bugun',
  height: 'medium', // short, medium yoki tall
},
```

Video misoli:

```js
import myVideo from '../assets/posts/my-video.mp4';

// posts massivining ichiga:
{
  id: 'my-video-08',
  title: 'Qisqa video',
  description: 'Video haqida izoh.',
  image: myVideo,
  author: 'Salim',
  category: 'G‘oyalar',
  type: 'video',
  date: 'Bugun',
  height: 'tall',
},
```

Video uchun MP4 (H.264) eng mos tanlov. Brauzerlar barcha video formatlarini qo‘llamaydi; “any format” kafolatlanmaydi. Juda katta videolarni GitHub repository ichiga joylash tavsiya etilmaydi.

Postlar ro‘yxatida yangi obyektni boshiga qo‘ysangiz, u lentada oldin ko‘rinadi.

## GitHub + Cloudflare Pages orqali bepul statik deploy

1. Loyihani GitHub repository'ga yuklang.
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** ni tanlang.
3. GitHub repository'ni ulang.
4. Build sozlamalari:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Deploy qiling.

Keyingi GitHub commit'lar Cloudflare Pages'da avtomatik qayta build/deploy qiladi.

**Muhim:** bu statik loyiha uchun `wrangler.jsonc`, D1, R2, Worker deploy command yoki Cloudflare Secrets kerak emas. Oldingi dinamik loyihadagi Worker deploy sozlamalarini ushbu repository'ga ko‘chirmang. Pages loyiha sifatida ulang.

## Nimalar ishlaydi?

- Pinterest uslubidagi masonry postlar lentasi
- Qidiruv va kategoriyalar
- Like va saqlangan postlar
- Post tafsiloti oynasi
- Fikr yozish
- Native share yoki havola nusxalash
- PWA manifest va service worker
- Mobilga mos responsive dizayn

## Cheklovlar — ataylab soddalashtirilgan

- Sayt ichida post yuklash/admin panel yo‘q. Post faqat source code orqali qo‘shiladi.
- Like, saqlash va fikrlar `localStorage` orqali faqat foydalanuvchining o‘z qurilmasida saqlanadi. Hamma foydalanuvchilarga umumiy emas.
- Login, foydalanuvchi profili, server push va real-time sinxronlash yo‘q.
- Barcha postlar build vaqtida statik fayllarga aylanadi.
