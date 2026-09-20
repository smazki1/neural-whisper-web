import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Play } from 'lucide-react';

const videos = ['QjkZ96r6DmU', 'D16zprjUmuQ', 'G9lYVvp6keE'];
const posterSizes = ['maxresdefault', 'sddefault', 'hqdefault'];

function TestimonialPoster({ id }: { id: string }) {
  const [size, setSize] = useState(0);
  const [unavailable, setUnavailable] = useState(false);
  const fallback = () => {
    if (size < posterSizes.length - 1) setSize(size + 1);
    else setUnavailable(true);
  };
  if (unavailable) return null;
  return <img src={`https://i.ytimg.com/vi/${id}/${posterSizes[size]}.jpg`} alt="" loading="lazy"
    onError={fallback} onLoad={(event) => {
      // YouTube can return a small placeholder with a successful HTTP response.
      if (event.currentTarget.naturalWidth < 320) fallback();
    }} />;
}

export default function Testimonials() {
  const [viewport, api] = useEmblaCarousel({
    direction: 'rtl', loop: false, align: 'start', containScroll: 'keepSnaps',
    inViewThreshold: 0.95, breakpoints: { '(prefers-reduced-motion: reduce)': { duration: 0 } },
  });
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState<number[]>([0, 1]);
  const [playing, setPlaying] = useState<string | null>(null);
  const syncVisible = useCallback(() => {
    if (!api) return;
    const shown = api.slidesInView();
    setVisible(shown);
    // Remove the only iframe when its slide leaves the gallery's visible area.
    setPlaying(current => current && !shown.includes(videos.indexOf(current)) ? null : current);
  }, [api]);
  useEffect(() => {
    if (!api) return;
    const select = () => setSelected(api.selectedScrollSnap());
    const stop = () => setPlaying(null);
    syncVisible();
    api.on('select', select).on('slidesInView', syncVisible).on('reInit', syncVisible).on('pointerDown', stop);
    return () => { api.off('select', select).off('slidesInView', syncVisible).off('reInit', syncVisible).off('pointerDown', stop); };
  }, [api, syncVisible]);

  const choose = (index: number, play = false) => {
    const next = Math.max(0, Math.min(videos.length - 1, index));
    setPlaying(null);
    // A clicked partial card is brought fully into view before mounting its player.
    api?.scrollTo(next, play || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setSelected(next);
    if (play) setPlaying(videos[next]);
  };

  return <section className="home-testimonials home-section" dir="rtl" aria-labelledby="testimonials-title">
    <div className="home-container home-testimonials__layout">
      <div className="home-testimonials__copy">
        <h2 id="testimonials-title">הידע שלכם יכול להגיע רחוק יותר.</h2>
        <p>כל מה שלמדתם, הניסיון שצברתם, הדברים שאתם יודעים לעשות טוב. עכשיו דמיינו שלצד כל זה יש לכם עוזר שיכול לחקור בשבילכם, לפתח איתכם רעיונות ולעזור לכם לבצע דברים שעד היום דרשו עוד זמן, עוד ידיים או ידע שלא היה לכם. אתם מביאים את הכיוון ואת שיקול הדעת. AI מרחיב את מה שאתם יכולים לעשות איתם.</p>
      </div>
      <div className="home-testimonials__carousel" role="region" aria-roledescription="קרוסלה" aria-label="סרטוני עדויות" tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') { event.preventDefault(); choose(selected + 1); }
          if (event.key === 'ArrowRight') { event.preventDefault(); choose(selected - 1); }
        }}>
        <div className="home-testimonials__viewport" ref={viewport}>
          <div className="home-testimonials__track">
            {videos.map((id, index) => <div className="home-testimonials__slide" key={id} role="group" aria-label={`עדות ${index + 1} מתוך ${videos.length}`}>
              <div className="home-testimonials__media">
                {playing === id ? <iframe
                  src={`https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&controls=1&rel=0`}
                  title={`סרטון עדות ${index + 1}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> :
                  <button type="button" className="home-testimonials__play" onClick={() => choose(index, true)} tabIndex={visible.includes(index) ? 0 : -1} aria-label={`ניגון עדות ${index + 1} עם קול`}>
                    <TestimonialPoster id={id} />
                    <span className="home-testimonials__play-icon"><Play fill="currentColor" aria-hidden="true" /></span>
                  </button>}
              </div>
            </div>)}
          </div>
        </div>
      </div>
    </div>
  </section>;
}
