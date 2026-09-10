import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchBlogs } from '../../lib/api/blogs';
import BlogsClientPage from '../../components/BlogsPage';

export default async function BlogsPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 5 * 60,
        gcTime: 24 * 60 * 60 * 1000,
      },
    },
  });

  await queryClient.query({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <BlogsClientPage></BlogsClientPage>
    </HydrationBoundary>
  );
}
