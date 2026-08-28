import { httpClient } from '../httpClient';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http:localhost:3000/api/v1';
export async function fetchBlogs() {
  console.log(apiUrl);
  const response = await httpClient.get(`${apiUrl}/blogs`);
  console.log(response);
  return response;
}
