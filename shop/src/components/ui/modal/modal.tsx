import { CloseIcon } from '@/components/icons/close-icon';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { getDirection } from '@/lib/constants';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

export default function Modal({
  open,
  onClose,
  showBackDrop = true,
  children,
  closeButtonClass,
  className,
}: any) {
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('common');

  const { locale } = useRouter();
  const dir = getDirection(locale);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    },
    [open, onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className={twMerge(
          classNames('fixed inset-0 z-[70] overflow-y-auto', className),
        )}
        initialFocus={cancelButtonRef}
        static
        open={open}
        onClose={onClose}
        dir={dir}
      >
        <div className="min-h-full text-center p-4 md:p-5">
          {showBackDrop ? (
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className="fixed inset-0 h-full w-full bg-gray-900 bg-opacity-50"
                onClick={onClose}
              />
            </Transition.Child>
          ) : (
            ''
          )}

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="min-w-content relative inline-block max-w-full align-middle transition-all ltr:text-left rtl:text-right">
              <button
                onClick={onClose}
                aria-label="Close panel"
                ref={cancelButtonRef}
                className={twMerge(
                  classNames(
                    'fixed top-4 z-[80] flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-muted shadow-lg transition-all duration-200 hover:bg-accent hover:text-light focus:bg-accent focus:text-light focus:outline-0 ltr:right-4 rtl:left-4',
                    closeButtonClass,
                  ),
                )}
              >
                <span className="sr-only">{t('text-close')}</span>
                <CloseIcon className="h-5 w-5" />
              </button>
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
