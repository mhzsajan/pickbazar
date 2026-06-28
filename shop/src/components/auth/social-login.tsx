import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useSocialLogin } from '@/framework/user';

const SocialLogin = () => {
  const { data: session, status } = useSession();
  const { mutate: socialLogin, error } = useSocialLogin();
  useEffect(() => {
    //@ts-ignore
    if (session?.access_token && session?.provider) {
      socialLogin({
        //@ts-ignore
        provider: session.provider as string,
        //@ts-ignore
        access_token: session.access_token as string,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (error) {
    return <div>{`${error}`}</div>;
  }
  return null;
};

export default SocialLogin;
