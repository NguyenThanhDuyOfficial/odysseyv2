import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = 'vi';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
