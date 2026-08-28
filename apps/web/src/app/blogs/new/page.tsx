import { useTranslations } from 'next-intl';
import Tiptap from '../../../components/Tiptap';
import { Button } from '@odyssey/ui/components/ui/button';

export default function NewBlogPage() {
  const t = useTranslations('BlogNew');
  return (
    <main className="sticky top-30 h-[calc(100vh-80px)] container mx-auto pb-8 px-5 md:px-20 flex flex-col gap-2">
      <form className="flex gap-4">
        <input type="text" placeholder={t('title')} className="w-full" />
        <Button>{t('preview')}</Button>
        <Button>{t('publish')}</Button>
      </form>
      <Tiptap />
    </main>
  );
}
