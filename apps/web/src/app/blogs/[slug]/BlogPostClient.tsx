'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Calendar, Eye, Clock, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { httpClient } from '../../../lib/httpClient';

export default function BlogPostClient({ slug }: { slug: string }) {
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get(`/blogs/${slug}`);
        console.log(response);
        setCurrentPost(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentPost) return <div>Loading</div>;
  const formattedDate = new Date(currentPost.publishedAt).toLocaleDateString(
    'vi-VN',
  );

  const wordCount =
    currentPost.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="container mx-auto py-8 px-4">
      {error && <div>{error}</div>}
      <article className="container max-w-screen">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại Blogs</span>
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentPost.published
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {currentPost.published ? 'Đã xuất bản' : 'Bản nháp'}
            </span>
            {currentPost.isFeatured && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                ⭐ Nổi bật
              </span>
            )}
          </div>

          {/* Tiêu đề */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {currentPost.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{readTime} phút đọc</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>{currentPost.viewCount || 0} lượt xem</span>
            </div>
          </div>
        </header>

        {currentPost.featuredImageUrl && (
          <div className="relative w-full h-64 sm:h-96 rounded-xl overflow-hidden mb-8 bg-gray-200">
            <Image
              src={currentPost.featuredImageUrl}
              alt={currentPost.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/*  Action buttons  */}
        {/* <div className="flex items-center justify-between border-y border-gray-200 py-4 mb-8"> */}
        {/*   <div className="flex items-center gap-2"> */}
        {/*     <button className="p-2 rounded-full hover:bg-gray-100 transition-colors"> */}
        {/*       <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" /> */}
        {/*     </button> */}
        {/*     <button className="p-2 rounded-full hover:bg-gray-100 transition-colors"> */}
        {/*       <Bookmark className="w-5 h-5 text-gray-600 hover:text-blue-500" /> */}
        {/*     </button> */}
        {/*   </div> */}
        {/*   <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm"> */}
        {/*     <Share2 className="w-4 h-4" /> */}
        {/*     <span>Chia sẻ</span> */}
        {/*   </button> */}
        {/* </div> */}

        {/* Nội dung bài viết */}
        <div
          className="prose prose-lg prose-blue max-w-none
            prose-headings:text-gray-900 
            prose-p:text-gray-700 
            prose-a:text-blue-600 hover:prose-a:text-blue-800
            prose-strong:text-gray-900
            prose-ul:text-gray-700
            prose-ol:text-gray-700
            prose-blockquote:border-l-blue-500 prose-blockquote:bg-gray-50 prose-blockquote:py-1
            prose-img:rounded-lg
            prose-pre:bg-gray-900 prose-pre:text-gray-100
            prose-code:text-blue-600
            prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
          "
          dangerouslySetInnerHTML={{
            __html: currentPost.content || 'Nội dung đang được cập nhật...',
          }}
        />

        {/* Footer bài viết */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              <p>Bài viết được đăng lúc {formattedDate}</p>
              {currentPost.excerpt && (
                <p className="mt-1 text-gray-600 italic">
                  "{currentPost.excerpt}"
                </p>
              )}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
