import { useQuery } from '@tanstack/react-query';
import { fetchBlogs } from '../lib/api/blogs';

export default function BlogsList() {
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });
  return <div></div>;
}
