import { useEffect, useMemo, useState } from 'react';
import {
  Bookmark, Check, ChevronDown, Heart, Image as ImageIcon, MessageCircle,
  MoreHorizontal, Search, Share2, Sparkles, X, Play, ArrowUpRight,
} from 'lucide-react';
import { posts, categories } from './data/posts.js';

const readStore = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Barchasi');
  const [activeView, setActiveView] = useState('feed');
  const [liked, setLiked] = useState(() => readStore('sz-liked', []));
  const [saved, setSaved] = useState(() => readStore('sz-saved', []));
  const [comments, setComments] = useState(() => readStore('sz-comments', {}));
  const [selected, setSelected] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => localStorage.setItem('sz-liked', JSON.stringify(liked)), [liked]);
  useEffect(() => localStorage.setItem('sz-saved', JSON.stringify(saved)), [saved]);
  useEffect(() => localStorage.setItem('sz-comments', JSON.stringify(comments)), [comments]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visiblePosts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('uz');
    return posts.filter((post) => {
      const matchesCategory = category === 'Barchasi' || post.category === category;
      const matchesSearch = !normalized || `${post.title} ${post.description} ${post.category} ${post.author}`.toLocaleLowerCase('uz').includes(normalized);
      const matchesSaved = activeView !== 'saved' || saved.includes(post.id);
      return matchesCategory && matchesSearch && matchesSaved;
    });
  }, [query, category, activeView, saved]);

  const toggleItem = (list, setList, id) => {
    setList((current) => current.includes(id) ? current.filter((item) => item !== id) : [id, ...current]);
  };

  const sharePost = async (post) => {
    const url = `${window.location.origin}${window.location.pathname}#${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.description, url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setToast('Havola nusxalandi');
      } else {
        setToast(url);
      }
    } catch (error) {
      if (error?.name !== 'AbortError') setToast('Ulashib bo‘lmadi');
    }
  };

  const openPost = (post) => {
    setSelected(post);
    setCommentText('');
    window.history.replaceState(null, '', `#${post.id}`);
  };

  const closePost = () => {
    setSelected(null);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  };

  const addComment = (event) => {
    event.preventDefault();
    if (!selected || !commentText.trim()) return;
    const entry = { id: `${Date.now()}`, text: commentText.trim(), date: new Date().toLocaleDateString('uz-UZ') };
    setComments((current) => ({ ...current, [selected.id]: [...(current[selected.id] || []), entry] }));
    setCommentText('');
    setToast('Fikringiz saqlandi');
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const post = posts.find((item) => item.id === hash);
    if (post) setSelected(post);
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" onClick={() => { setActiveView('feed'); setCategory('Barchasi'); }} aria-label="Salim Zapallari bosh sahifa">
          <span className="brand-mark"><Sparkles size={20} strokeWidth={2.4} /></span>
          <span className="brand-name">salim<span>zapallari</span><i>✳</i></span>
        </a>

        <div className="search-wrap">
          <Search size={19} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nimani qidiramiz?" aria-label="Postlarni qidirish" />
          {query && <button className="search-clear" onClick={() => setQuery('')} aria-label="Qidiruvni tozalash"><X size={16} /></button>}
        </div>

        <nav className="top-actions" aria-label="Asosiy navigatsiya">
          <button className={`nav-link ${activeView === 'feed' ? 'active' : ''}`} onClick={() => setActiveView('feed')}>Kashf etish</button>
          <button className={`saved-nav ${activeView === 'saved' ? 'active' : ''}`} onClick={() => setActiveView(activeView === 'saved' ? 'feed' : 'saved')}>
            <Bookmark size={18} /> <span>Saqlangan</span>
            {saved.length > 0 && <b>{saved.length}</b>}
          </button>
          <div className="avatar" title="Salim">S</div>
        </nav>
      </header>

      <main id="top" className="main-content">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span /> KICHIK TOPILMALAR, KATTA ILHOM</div>
            <h1>{activeView === 'saved' ? <>Saqlab qo‘ygan<br /><em>topilmalaringiz.</em></> : <>O‘zingizga yoqqan<br /><em>narsalarni toping.</em></>}</h1>
            <p>G‘oyalar, kayfiyat va ilhom ulashiladigan kichkina makon.</p>
            <div className="hero-note"><span className="note-icon">✦</span> Bugun ham nimadir chiroyli narsani toping.</div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-sun" />
            <div className="art-card art-card-back"><span>good<br />things</span><b>✳</b></div>
            <div className="art-card art-card-front"><div className="art-flower">✿</div><strong>stay<br />curious.</strong><small>COLLECT MOMENTS</small></div>
            <span className="art-star star-one">✳</span><span className="art-star star-two">✦</span>
          </div>
        </section>

        <section className="feed-section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">SIZ UCHUN SARALANDI</div>
              <h2>{activeView === 'saved' ? 'Saqlanganlar' : 'Yangi topilmalar'} <span>{visiblePosts.length}</span></h2>
            </div>
            <div className="sort-label">Eng yangi <ChevronDown size={16} /></div>
          </div>

          <div className="category-row" role="tablist" aria-label="Kategoriyalar">
            {categories.map((item) => (
              <button key={item} role="tab" aria-selected={category === item} className={`category-chip ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>

          {visiblePosts.length ? (
            <div className="masonry-grid">
              {visiblePosts.map((post, index) => (
                <article className={`post-card card-${post.height || 'medium'}`} key={post.id} style={{ '--card-order': index }}>
                  <button className="post-image-button" onClick={() => openPost(post)} aria-label={`${post.title} postini ochish`}>
                    {post.type === 'video' ? (
                      <video className="post-media" src={post.image} muted playsInline preload="metadata" />
                    ) : (
                      <img className="post-media" src={post.image} alt={post.title} loading={index < 4 ? 'eager' : 'lazy'} />
                    )}
                    <span className="image-shade" />
                    {post.type === 'video' && <span className="video-indicator"><Play size={15} fill="currentColor" /></span>}
                    <span className="image-category">{post.category}</span>
                    <span className="open-indicator"><ArrowUpRight size={18} /></span>
                  </button>
                  <div className="post-info">
                    <div className="post-title-line"><h3>{post.title}</h3><button className={`icon-button save-button ${saved.includes(post.id) ? 'is-saved' : ''}`} onClick={() => toggleItem(saved, setSaved, post.id)} aria-label="Saqlash"><Bookmark size={18} fill={saved.includes(post.id) ? 'currentColor' : 'none'} /></button></div>
                    <p>{post.description}</p>
                    <div className="post-footer">
                      <div className="author"><span className="author-avatar">S</span><span>{post.author}</span><i>·</i><time>{post.date}</time></div>
                      <div className="post-tools">
                        <button className={`tool-button ${liked.includes(post.id) ? 'is-liked' : ''}`} onClick={() => toggleItem(liked, setLiked, post.id)} aria-label="Like"><Heart size={16} fill={liked.includes(post.id) ? 'currentColor' : 'none'} /><span>{liked.includes(post.id) ? '1' : ''}</span></button>
                        <button className="tool-button" onClick={() => openPost(post)} aria-label="Fikrlar"><MessageCircle size={16} /><span>{(comments[post.id] || []).length || ''}</span></button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state"><div className="empty-icon"><ImageIcon size={26} /></div><h3>Hozircha bu yer bo‘sh</h3><p>Boshqa kategoriya yoki qidiruv so‘zini sinab ko‘ring.</p><button onClick={() => { setQuery(''); setCategory('Barchasi'); setActiveView('feed'); }}>Barchasini ko‘rish</button></div>
          )}
        </section>

        <footer className="footer"><span>✳ salim zapallari</span><span>Yaxshi narsalarni yig‘amiz.</span><span>© 2026</span></footer>
      </main>

      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePost(); }}>
          <section className="post-modal" role="dialog" aria-modal="true" aria-label={selected.title}>
            <button className="modal-close" onClick={closePost} aria-label="Yopish"><X size={20} /></button>
            <div className="modal-media-wrap">
              {selected.type === 'video' ? <video src={selected.image} controls autoPlay playsInline className="modal-media" /> : <img src={selected.image} alt={selected.title} className="modal-media" />}
            </div>
            <div className="modal-content">
              <div className="modal-meta"><span>{selected.category}</span><span>{selected.date}</span></div>
              <h2>{selected.title}</h2>
              <p className="modal-description">{selected.description}</p>
              <div className="modal-author"><span className="author-avatar">S</span><strong>{selected.author}</strong><span>muallif</span></div>
              <div className="modal-actions">
                <button className={`modal-action like-action ${liked.includes(selected.id) ? 'is-liked' : ''}`} onClick={() => toggleItem(liked, setLiked, selected.id)}><Heart size={18} fill={liked.includes(selected.id) ? 'currentColor' : 'none'} /> {liked.includes(selected.id) ? 'Yoqdi' : 'Like'}</button>
                <button className={`modal-action ${saved.includes(selected.id) ? 'is-saved' : ''}`} onClick={() => toggleItem(saved, setSaved, selected.id)}><Bookmark size={18} fill={saved.includes(selected.id) ? 'currentColor' : 'none'} /> {saved.includes(selected.id) ? 'Saqlandi' : 'Saqlash'}</button>
                <button className="modal-action" onClick={() => sharePost(selected)}><Share2 size={18} /> Ulashish</button>
              </div>
              <div className="comments-head"><h3>Fikrlar</h3><span>{(comments[selected.id] || []).length}</span></div>
              <div className="comments-list">
                {(comments[selected.id] || []).length ? comments[selected.id].map((comment) => <div className="comment" key={comment.id}><span className="comment-avatar">S</span><div><strong>Siz</strong><p>{comment.text}</p><time>{comment.date}</time></div></div>) : <div className="no-comments">Hali fikr bildirilmagan. Birinchi bo‘lib yozing!</div>}
              </div>
              <form className="comment-form" onSubmit={addComment}><input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Fikringizni yozing..." maxLength={300} /><button type="submit" disabled={!commentText.trim()}>Yuborish</button></form>
              <p className="local-note"><Check size={13} /> Like va fikrlar faqat ushbu qurilmada saqlanadi.</p>
            </div>
          </section>
        </div>
      )}

      {toast && <div className="toast"><Check size={16} />{toast}</div>}
    </div>
  );
}

export default App;
