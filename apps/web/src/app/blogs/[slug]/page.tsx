import BlogPostClient from './BlogPostClient';

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  return <BlogPostClient slug={slug} />;
}
