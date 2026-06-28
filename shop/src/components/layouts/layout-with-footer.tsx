import useLayout from '@/lib/hooks/use-layout';
import Header from './header';
import HeaderMinimal from './header-minimal';
// import MobileNavigation from './mobile-navigation';

import dynamic from 'next/dynamic';
import Footer from './footer';

const MobileNavigation = dynamic(() => import('./mobile-navigation'), {
  ssr: false,
});

const SiteLayoutWithFooter = ({ children }: { children?: React.ReactNode }) => {
  const { layout } = useLayout();
  return (
    <div className="flex flex-col min-h-screen transition-colors duration-150 bg-surface pb-14 lg:pb-0">
      {layout === 'minimal' ? (
        <HeaderMinimal layout={layout} />
      ) : (
        <Header layout={layout} />
      )}
      {children}
      <MobileNavigation />
      <div className="w-full border-t border-border-200" />
      <Footer />
    </div>
  );
};
export const getLayoutWithFooter = (page: React.ReactElement) => (
  <SiteLayoutWithFooter>{page}</SiteLayoutWithFooter>
);
export default SiteLayoutWithFooter;
