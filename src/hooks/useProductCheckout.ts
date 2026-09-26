import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { checkoutForLanding } from '@/lib/productCheckout.js';

/** Fixed public origin also lets local previews resolve the real landing route. */
export function useProductCheckout() {
  const { pathname } = useLocation();
  const query = useQuery({
    queryKey: ['landing-product-checkout'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products')
        .select('id, external_url, icount_page_url, is_published')
        .eq('is_published', true)
        .abortSignal(AbortSignal.timeout(10000));
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    checkoutUrl: query.isError ? null : checkoutForLanding(query.data ?? [], `https://ai-master.co.il${pathname}`),
    checkoutLoading: query.isFetching,
  };
}
