import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('HomePage');

  return <h1 className="whitespace-pre-line">{t('title')}</h1>;
}
