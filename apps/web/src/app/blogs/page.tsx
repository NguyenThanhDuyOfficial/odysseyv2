import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchBlogs } from '../../lib/api/blogs';
import BlogsList from '../../components/BlogsList';

export default async function BlogsPage() {
  const queryClient = new QueryClient();

  await queryClient.query({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <BlogsList></BlogsList>
    </HydrationBoundary>
  );
}
