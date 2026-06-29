import Banner from '@/components/banners/banner';
import PromotionSliders from '@/components/promotions/promotions';
import Categories from '@/components/categories/categories';
import { Element } from 'react-scroll';
import FilterBar from './filter-bar';
import ProductGridHome from '@/components/products/grids/home';
import AnimatedSection from '@/components/ui/animated-section';
import type { HomePageProps } from '@/types';

export default function ClassicLayout({ variables }: HomePageProps) {
  return (
    <>
      <Banner layout="classic" variables={variables.types} />
      <AnimatedSection>
        <PromotionSliders variables={variables.types} />
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <FilterBar variables={variables.categories} />
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <Element
          name="grid"
          className="flex border-t border-solid border-border-200 border-opacity-70"
        >
          <Categories layout="classic" variables={variables.categories} />
          <ProductGridHome
            className="px-4 pt-3.5 pb-16 lg:p-6 xl:p-8"
            variables={variables.products}
          />
        </Element>
      </AnimatedSection>
    </>
  );
}
