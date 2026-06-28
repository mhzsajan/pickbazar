import MobileCategoryMenu from '@/components/layouts/mobile-menu/mobile-category-menu';
import { drawerAtom } from '@/store/drawer-atom';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import React from 'react';
import Drawer from './drawer';
const CartSidebarView = dynamic(
  () => import('@/components/cart/cart-sidebar-view'),
);
const MobileAuthorizedMenu = dynamic(
  () => import('@/components/layouts/mobile-menu/mobile-authorized-menu'),
);
const MobileMainMenu = dynamic(
  () => import('@/components/layouts/mobile-menu/mobile-main-menu'),
);
const SearchFilterView = dynamic(
  () => import('@/components/search-view/sidebar-filter'),
);
const MaintenanceMoreInfo = dynamic(
  () => import('@/components/maintenance/more-info')
);

export default function ManagedDrawer() {
  const [{ display, view, data }, setDrawerState] = useAtom(drawerAtom);
  const isOpenRef = React.useRef(false);
  const isHandlingPopState = React.useRef(false);

  React.useEffect(() => {
    function handlePopState(e: PopStateEvent) {
      if (isOpenRef.current && e.state?.__drawer) {
        isHandlingPopState.current = true;
        setDrawerState({ display: false, view: '' });
        isOpenRef.current = false;
        setTimeout(() => {
          isHandlingPopState.current = false;
        }, 0);
      }
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setDrawerState]);

  React.useEffect(() => {
    if (display && !isOpenRef.current) {
      isOpenRef.current = true;
      window.history.pushState({ __drawer: true }, '');
    }
  }, [display]);

  function handleClose() {
    if (isOpenRef.current && !isHandlingPopState.current) {
      isOpenRef.current = false;
      window.history.back();
    } else if (isHandlingPopState.current) {
      isOpenRef.current = false;
    }
    setDrawerState({ display: false, view: '' });
  }

  return (
    <Drawer
      open={display}
      onClose={handleClose}
      variant={
        [
          'FILTER_VIEW',
          'MAIN_MENU_VIEW',
          'FILTER_LAYOUT_TWO_VIEW',
          'SEARCH_FILTER',
        ].includes(view)
          ? 'left'
          : 'right'
      }
      className={
        ['MAINTENANCE_MORE_INFO']?.includes(view) ? 'max-w-sm md:max-w-xl' : ''
      }
    >
      {view === 'cart' && <CartSidebarView />}
      {view === 'FILTER_VIEW' && <MobileCategoryMenu variables={data} />}
      {view === 'MAIN_MENU_VIEW' && <MobileMainMenu />}
      {view === 'AUTH_MENU_VIEW' && <MobileAuthorizedMenu />}
      {view === 'SEARCH_FILTER' && (
        <SearchFilterView
          type={data?.type}
          showManufacturers={data?.showManufacturers}
        />
      )}
      {view === 'MAINTENANCE_MORE_INFO' && (
        <MaintenanceMoreInfo variables={data} />
      )}
    </Drawer>
  );
}
