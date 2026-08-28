'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchBlogs } from '../lib/api/blogs';

export default function BlogsList() {
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });
  console.log(data, isLoading);
  const blogs = data?.data || [];
  return (
    <div>
      <p>alo</p>
      <p>Total blogs: {blogs.length}</p>
      <p>{data.data[0].title}</p>
      {blogs.map((blog) => (
        <div key={blog.id}>{blog.title}</div>
      ))}
    </div>
  );
}
