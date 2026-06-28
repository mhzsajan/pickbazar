import { useTranslation } from 'next-i18next';
import { siteSettings } from '@/config/site';
import Link from '@/components/ui/link';
import Logo from '@/components/ui/logo';
import SubscriptionWidget from '@/components/settings/subscribe-to-newsletter';
import { useSettings } from '@/framework/settings';
import { useRouter } from 'next/router';
import { StripeIcon } from '@/components/icons/payment-gateways/stripe';
import { PayPalIcon } from '@/components/icons/payment-gateways/paypal';
import { MollieIcon } from '@/components/icons/payment-gateways/mollie';
import { RazorPayIcon } from '@/components/icons/payment-gateways/razorpay';
import { SSLComerz } from '@/components/icons/payment-gateways/sslcomerz';
import { PayStack } from '@/components/icons/payment-gateways/paystack';
import { IyzicoIcon } from '@/components/icons/payment-gateways/iyzico';
import { XenditIcon } from '@/components/icons/payment-gateways/xendit';
import { BkashIcon } from '@/components/icons/payment-gateways/bkash';
import { PaymongoIcon } from '@/components/icons/payment-gateways/paymongo';
import { FlutterwaveIcon } from '@/components/icons/payment-gateways/flutterwave';
import { isEmpty } from 'lodash';
import { SVGLoaderIcon } from '@/components/icons/svg-loader';
import { Routes } from '@/config/routes';
import { getIcon } from '@/lib/get-icon';
import * as socialIcons from '@/components/icons/social';

export const icon: any = {
  stripe: <StripeIcon />,
  paypal: <PayPalIcon />,
  razorpay: <RazorPayIcon />,
  mollie: <MollieIcon />,
  sslcommerz: <SSLComerz />,
  paystack: <PayStack />,
  iyzico: <IyzicoIcon />,
  xendit: <XenditIcon />,
  bkash: <BkashIcon />,
  paymongo: <PaymongoIcon />,
  flutterwave: <FlutterwaveIcon />,
};

const Footer = () => {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const { settings, isLoading: settingsLoading } = useSettings();
  const paymentGateway = settings?.paymentGateway,
    siteTitle = settings?.siteTitle,
    siteLink = settings?.siteLink,
    copyrightText = settings?.copyrightText,
    externalText = settings?.externalText,
    externalLink = settings?.externalLink,
    contactDetails = settings?.contactDetails;

  const date = new Date();

  return (
    <div className="flex w-full flex-col border-t border-border-200 bg-gray-100 px-5 md:px-10 lg:px-[50px] xl:px-16">
      {/* Top */}
      <div className="grid w-full grid-cols-1 gap-8 pt-10 pb-12 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <div className="flex flex-col">
          <div className="mb-4 flex h-16 items-start">
            <Logo />
          </div>

          {settingsLoading ? (
            <SVGLoaderIcon className="text-2xl" />
          ) : (
            <div className="space-y-3">
              {contactDetails?.location?.formattedAddress && (
                <Link
                  href={`https://www.google.com/maps/place/${contactDetails?.location?.formattedAddress}`}
                  className="text-sm not-italic text-heading"
                >
                  {contactDetails?.location?.formattedAddress}
                </Link>
              )}
              {contactDetails?.emailAddress && (
                <Link
                  className="text-sm text-heading"
                  href={`mailto:${contactDetails?.emailAddress}`}
                >
                  {contactDetails?.emailAddress}
                </Link>
              )}
              {contactDetails?.contact && (
                <Link
                  className="text-sm text-heading"
                  href={`tel:${contactDetails?.contact}`}
                >
                  {contactDetails?.contact}
                </Link>
              )}
            </div>
          )}

          <div>
            {settingsLoading ? (
              <SVGLoaderIcon className="text-xl" />
            ) : (
              <div className="flex items-center gap-4 mt-4">
                {contactDetails?.socials?.map(
                  //@ts-ignore
                  (social: { url: string; icon: string }, index: number) => {
                    return social?.url ? (
                      <Link
                        href={social?.url}
                        key={index}
                        target="_blank"
                        className="text-accent hover:text-accent-hover"
                      >
                        {getIcon({
                          iconList: socialIcons,
                          iconName: social?.icon,
                          className: 'w-5 h-5',
                        })}
                      </Link>
                    ) : (
                      ''
                    );
                  },
                )}
              </div>
            )}
          </div>
        </div>

        {siteSettings?.footer?.menus?.map((menu, idx) => (
          <div className="flex flex-col" key={`${menu.title}-${idx}`}>
            <h3 className="mb-5 font-semibold text-heading">
              {t(menu.title)}
            </h3>

            <ul className="space-y-3">
              {menu.links.map((link, index) => (
                <li key={`${link.href}-${index}`}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors text-heading hover:text-orange-500"
                  >
                    {t(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-full md:col-span-2 lg:col-span-1">
          <SubscriptionWidget
            title="text-subscribe-now"
            description="text-subscribe-details"
          />
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col items-center w-full gap-3 py-6 border-t border-border-100 md:flex-row md:justify-between">
        {settingsLoading ? (
          <SVGLoaderIcon className="text-xl" />
        ) : (
          <span className="text-sm text-heading">
            ©{date.getFullYear()}{' '}
            <Link
              className="font-medium text-heading"
              href={siteLink ?? Routes?.home}
            >
              {siteTitle}
            </Link>
            . {copyrightText}{' '}
            {externalText ? (
              <Link
                className="font-medium text-heading"
                href={externalLink ?? Routes?.home}
              >
                {externalText}
              </Link>
            ) : (
              ''
            )}
          </span>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end md:gap-5">
          {settingsLoading ? (
            <SVGLoaderIcon className="text-xl" />
          ) : !isEmpty(paymentGateway) && settings?.useEnableGateway ? (
            paymentGateway?.map(
              //@ts-ignore
              (method: { name: string; title: string }, index: number) => {
                return icon[method?.name] ? (
                  <div
                    className="relative flex items-center h-5 overflow-hidden"
                    key={index}
                  >
                    {icon[method?.name]}
                  </div>
                ) : (
                  ''
                );
              },
            )
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;
