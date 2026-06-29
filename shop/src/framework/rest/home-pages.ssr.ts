import type {
  CategoryQueryOptions,
  HomePageProps,
  PopularProductQueryOptions,
  SettingsQueryOptions,
  TypeQueryOptions,
  BestSellingProductQueryOptions,
  ShopQueryOptions,
} from '@/types';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import invariant from 'tiny-invariant';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  CATEGORIES_PER_PAGE,
  PRODUCTS_PER_PAGE,
  TYPES_PER_PAGE,
  SHOPS_PER_PAGE,
} from './client/variables';

type ParsedQueryParams = {
  pages: string[];
};

// This function gets called at build time
export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
  locales,
}) => {
  invariant(locales, 'locales is not defined');
  const data = await client.types.all({ limit: 100 });
  const paths = data?.flatMap((type) =>
    locales?.map((locale) => ({ params: { pages: [type.slug] }, locale }))
  );
  // We'll pre-render only these paths at build time also with the slash route.
  return {
    paths: paths.concat(
      locales?.map((locale) => ({ params: { pages: [] }, locale }))
    ),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  HomePageProps,
  ParsedQueryParams
> = async ({ locale, params }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [API_ENDPOINTS.SETTINGS, { language: locale }],
    ({ queryKey }) => client.settings.all(queryKey[1] as SettingsQueryOptions)
  );

  const { pages } = params!;

  // Root "/" — show minimal page (client-side redirect in component)
  if (!pages) {
    await queryClient.prefetchInfiniteQuery(
      [API_ENDPOINTS.SHOPS, { limit: SHOPS_PER_PAGE, is_active: 1 }],
      ({ queryKey }) => client.shops.all(queryKey[1] as ShopQueryOptions)
    );
    return {
      props: {
        variables: {
          shops: { limit: SHOPS_PER_PAGE, is_active: 1 },
        },
        layout: 'shops',
        ...(await serverSideTranslations(locale!, ['common', 'banner'])),
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      revalidate: 120,
    };
  }

  // Type pages — show product-based homepage
  const types = await queryClient.fetchQuery(
    [API_ENDPOINTS.TYPES, { limit: TYPES_PER_PAGE, language: locale }],
    ({ queryKey }) => client.types.all(queryKey[1] as TypeQueryOptions)
  );

  let pageType: string | undefined;
  pageType = pages[0];

  if (!types?.some((t) => t.slug === pageType)) {
    return {
      notFound: true,
      revalidate: 120,
    };
  }

  await queryClient.prefetchQuery(
    [API_ENDPOINTS.TYPES, { slug: pageType, language: locale }],
    ({ queryKey }: any) => client.types.get(queryKey[1])
  );
  const productVariables = {
    type: pageType,
    limit: PRODUCTS_PER_PAGE,
  };
  await queryClient.prefetchInfiniteQuery(
    [
      API_ENDPOINTS.PRODUCTS,
      { limit: PRODUCTS_PER_PAGE, type: pageType, language: locale },
    ],
    ({ queryKey }) => client.products.all(queryKey[1] as any)
  );

  const popularProductVariables = {
    type_slug: pageType,
    limit: 10,
    with: 'type;author',
    language: locale,
  };

  if (pageType === 'book') {
    await queryClient.prefetchQuery(
      [API_ENDPOINTS.PRODUCTS_POPULAR, popularProductVariables],
      ({ queryKey }) =>
        client.products.popular(queryKey[1] as PopularProductQueryOptions)
    );

    await queryClient.prefetchQuery(
      [API_ENDPOINTS.BEST_SELLING_PRODUCTS, popularProductVariables],
      ({ queryKey }) =>
        client.products.bestSelling(
          queryKey[1] as BestSellingProductQueryOptions
        )
    );
  }

  const categoryVariables = {
    type: pageType,
    limit: CATEGORIES_PER_PAGE,
    language: locale,
    parent:
      types.find((t) => t.slug === pageType)?.settings.layoutType === 'minimal'
        ? 'all'
        : 'null',
  };
  await queryClient.prefetchInfiniteQuery(
    [API_ENDPOINTS.CATEGORIES, categoryVariables],
    ({ queryKey }) =>
      client.categories.all(queryKey[1] as CategoryQueryOptions),
  );
  return {
    props: {
      variables: {
        popularProducts: popularProductVariables,
        products: productVariables,
        categories: categoryVariables,
        bestSellingProducts: popularProductVariables,
        layoutSettings: {
          ...types.find((t) => t.slug === pageType)?.settings,
        },
        types: {
          type: pageType,
        },
      },
      layout:
        types.find((t) => t.slug === pageType)?.settings.layoutType ??
        'default',
      ...(await serverSideTranslations(locale!, ['common', 'banner'])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 120,
  };
};
