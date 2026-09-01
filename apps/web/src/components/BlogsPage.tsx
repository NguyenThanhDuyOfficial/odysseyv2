'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchBlogs } from '../lib/api/blogs';
import BlogCard from './BlogCard';
import { useTranslations } from 'next-intl';
import { Button } from '@odyssey/ui/components/ui/button';
import Link from 'next/link';

export default function BlogsPage() {
  const t = useTranslations('Blog');
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });
  const blogs = data?.data || [];
  return (
    <main className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <h4>{t('title')}</h4>
        <p className="max-w-100">{t('description')}</p>
        <Button
          nativeButton={false}
          render={<Link href="/blogs/new">{t('createPost')}</Link>}
        ></Button>
      </div>

      {/* BLOGS LIST */}
      {!isLoading ? (
        <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-4">
          {blogs.map((blog) => (
            <BlogCard key={blog.posts.id} data={blog}></BlogCard>
          ))}
        </div>
      ) : (
        <p>No blogs found</p>
      )}
    </main>
  );
}
