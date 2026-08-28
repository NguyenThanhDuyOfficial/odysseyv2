'use client';

import { useTranslations } from 'next-intl';
import Tiptap from '../../../components/Tiptap';
import { Button } from '@odyssey/ui/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { httpClient } from '../../../lib/httpClient';
import { authClient } from '../../../lib/auth-client';
import { createBlog } from '../../../lib/api/blogs';

export default function NewBlogPage() {
  const router = useRouter();
  const t = useTranslations('BlogNew');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: session } = authClient.useSession();

  const handlePublish = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const data = await httpClient.post('/blogs', {
        title,
        content,
        authorId: session!.user.id,
      });
      console.log(data);
      router.push(`/blogs/${data.id}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="sticky top-30 h-[calc(100vh-80px)] container mx-auto pb-8 px-5 md:px-20 flex flex-col gap-2">
      {error && <p>{error}</p>}
      <form className="flex gap-4">
        <input
          type="text"
          placeholder={t('title')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
        <Button>{t('preview')}</Button>
        <Button onClick={handlePublish}>{t('publish')}</Button>
      </form>
      <Tiptap onChangeAction={(content) => setContent(content)} />
    </main>
  );
}
