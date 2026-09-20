import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { getHomepageCatalogs, getProductDestination, getProductSummary } from '@/lib/homepageCatalog.js';
import { resolveProductImageUrl } from '@/lib/productImage.js';
import fallback from '@/assets/hero-bg-ai-modern.jpg';

type Product = Pick<Tables<'products'>, 'id' | 'title' | 'slug' | 'description' | 'short_description' | 'thumbnail_url' | 'external_url' | 'product_type' | 'category' | 'persona' | 'is_published' | 'display_order'>;

function Catalog({ products, kind }: { products: Product[]; kind: 'courses' | 'organizations' }) {
  const track = useRef<HTMLDivElement>(null);
  if (!products.length) return null;
  const courses = kind === 'courses';
  const title = courses ? 'קורסים ומרחבי לימוד' : 'הרצאות וסדנאות לארגונים';
  return <section className={`home-catalog home-section home-catalog--${kind}`} id={kind} dir="rtl" aria-labelledby={`${kind}-title`}>
    <div className="home-container">
      <div className="home-catalog__heading"><h2 id={`${kind}-title`}>{title}</h2>
        {products.length > 1 && <div className="home-carousel-controls">
          <button type="button" aria-label={`הקודם ב${title}`} onClick={() => track.current?.scrollBy({ left: track.current.clientWidth * .8, behavior: 'smooth' })}><ChevronRight aria-hidden="true" /></button>
          <button type="button" aria-label={`הבא ב${title}`} onClick={() => track.current?.scrollBy({ left: -track.current.clientWidth * .8, behavior: 'smooth' })}><ChevronLeft aria-hidden="true" /></button>
        </div>}
      </div>
      <div className={`home-catalog__track ${products.length === 1 ? 'is-single' : ''}`} ref={track} tabIndex={products.length > 1 ? 0 : undefined} role="region" aria-label={title}>
        {products.map((product) => <article className="home-product" key={product.id}>
          <div className="home-product__image"><img src={resolveProductImageUrl(product.thumbnail_url, fallback)} alt="" loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallback; }} /></div>
          <div className="home-product__content">
            <h3>{product.title}</h3>
            {product.persona?.trim() && <p className="home-product__audience">{product.persona}</p>}
            {getProductSummary(product) && <p>{getProductSummary(product)}</p>}
            <a href={getProductDestination(product)} className="home-product__link">לפרטים נוספים <ArrowUpLeft size={19} aria-hidden="true" /></a>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}

export default function Catalogs() {
  const mode = import.meta.env.DEV ? new URLSearchParams(location.search).get('catalog') : null;
  const { data: products = [] } = useQuery({
    queryKey: ['homepage-catalog', mode],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase.from('products')
        .select('id,title,slug,description,short_description,thumbnail_url,external_url,product_type,category,persona,is_published,display_order')
        .eq('is_published', true).order('display_order').order('created_at', { ascending: false });
      if (error) throw error;
      if (import.meta.env.DEV && ['demo', 'multiple', 'single', 'empty'].includes(mode ?? '')) {
        const { previewCatalog } = await import('./catalog-preview');
        return previewCatalog(data ?? [], mode!);
      }
      return data ?? [];
    },
    staleTime: 0,
    refetchOnWindowFocus: 'always',
    refetchInterval: mode ? false : 30000,
  });
  const { courses, organizations } = getHomepageCatalogs(products);
  return <><Catalog products={courses} kind="courses" /><Catalog products={organizations} kind="organizations" /></>;
}
