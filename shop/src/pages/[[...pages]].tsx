import type { NextPageWithLayout } from '@/types';
import type { InferGetStaticPropsType } from 'next';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { scroller } from 'react-scroll';
import HomeLayout from '@/components/layouts/_home';
import Seo from '@/components/seo/seo';
import { useWindowSize } from '@/lib/use-window-size';
import { getStaticPaths, getStaticProps } from '@/framework/home-pages.ssr';
import { useType } from '@/framework/type';
import { useTranslation } from 'next-i18next';
import Button from '@/components/ui/button';
import ShopCard from '@/components/ui/cards/shop';
import CouponLoader from '@/components/ui/loaders/coupon-loader';
import { useShops } from '@/framework/shop';
import rangeMap from '@/lib/range-map';
import ErrorMessage from '@/components/ui/error-message';
import NotFound from '@/components/ui/not-found';

export { getStaticPaths, getStaticProps };

const CartCounterButton = dynamic(
  () => import('@/components/cart/cart-counter-button'),
  { ssr: false },
);
const Classic = dynamic(() => import('@/components/layouts/classic'));
const Standard = dynamic(() => import('@/components/layouts/standard'));
const Modern = dynamic(() => import('@/components/layouts/modern'));
const Minimal = dynamic(() => import('@/components/layouts/minimal'));
const Compact = dynamic(() => import('@/components/layouts/compact'));

const MAP_LAYOUT_TO_GROUP: Record<string, any> = {
  classic: Classic,
  modern: Modern,
  standard: Standard,
  minimal: Minimal,
  compact: Compact,
  default: Classic,
};

// Shops homepage component
const ShopsHome = () => {
  const { t } = useTranslation('common');
  const limit = 30;
  const { shops, isLoading, isLoadingMore, hasMore, loadMore, error } =
    useShops({ limit, is_active: 1 });

  if (error) return <ErrorMessage message={error.message} />;
  if (!isLoading && !shops.length) {
    return (
      <div className="min-h-full bg-gray-100 px-4 pt-6 pb-8 lg:p-8">
        <NotFound text="text-no-shops" />
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      <div className="mx-auto w-full max-w-6xl px-5 pt-24 pb-10 lg:px-6 2xl:px-8">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold text-heading">
            {t('text-all-shops')}
          </h1>
          <p className="text-base text-body">
            Our Services &amp; Products.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && !shops.length ? (
            <>
              {rangeMap(limit, (i) => (
                <CouponLoader key={i} uniqueKey={`shops-${i}`} />
              ))}
            </>
          ) : (
            shops.map((shop) => <ShopCard shop={shop} key={shop.id} />)
          )}
        </div>
        {hasMore && (
          <div className="mt-8 flex items-center justify-center lg:mt-12">
            <Button onClick={loadMore} loading={isLoadingMore}>
              {t('text-load-more')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const Home: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ variables, layout }) => {
  const { query, replace } = useRouter();
  const { width } = useWindowSize();
  const { type } = useType(variables.types?.type);
  const { t } = useTranslation('common');

  // Redirect homepage / to default type page (single-shop mode)
  useEffect(() => {
    if (layout === 'shops') {
      replace('/grocery');
    }
  }, [layout]);

  useEffect(() => {
    if (query.text || query.category) {
      scroller.scrollTo('grid', {
        smooth: true,
        offset: -110,
      });
    }
  }, [query.text, query.category]);

  // Shops homepage (redirects to /grocery — preserved for future multi-shop restore)
  if (layout === 'shops') {
    return (
      <>
        <Seo title="Shops" url="/" />
        <ShopsHome />
      </>
    );
  }

  // Product type homepage
  const Component = MAP_LAYOUT_TO_GROUP[layout];
  return (
    <>
      <Seo title={type?.name as string} url={type?.slug as string} images={type?.banners} />
      <Component variables={variables} />
      {!['compact', 'minimal'].includes(layout) && width > 1023 && (
        <CartCounterButton />
      )}
    </>
  );
};

Home.getLayout = function getLayout(page) {
  return <HomeLayout layout={page.props.layout}>{page}</HomeLayout>;
};

export default Home;
