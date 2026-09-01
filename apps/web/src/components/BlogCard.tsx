import { Button } from '@odyssey/ui/components/ui/button';
import { Badge } from '@odyssey/ui/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@odyssey/ui/components/ui/card';
import { EyeIcon, HeartIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { BlogDTO } from '@odyssey/shared';

export default function BlogCard({ data }: { data: BlogDTO }) {
  const t = useTranslations('Blog');
  if (!data.posts.featuredImageUrl) {
    data.posts.featuredImageUrl =
      'https://images.pexels.com/photos/28441747/pexels-photo-28441747.jpeg';
  }
  return (
    <Card size="sm" className="relative mx-auto w-full max-w-sm pt-0">
      <div className="relative w-full aspect-video">
        <Image
          src={data.posts.featuredImageUrl}
          alt="Blog Image"
          fill
          className="object-cover "
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader>
        <CardTitle>
          <div className="flex gap-2">
            <div className="relative w-6 h-6  aspect-video">
              <Image
                src={data.users.avatarUrl}
                alt="User Avatar"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p>
              {data.users.display_name
                ? data.users.display_name
                : data.users.username}
            </p>
            <p className="text-muted-foreground">
              {new Date(data.posts.publishedAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="">
          <h6>{data.posts.title}</h6>
          <p className="w-full line-clamp-2 text-ellipsis text-muted-foreground">
            {data.posts.excerpt}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          nativeButton={false}
          render={
            <Link href={`/blogs/${data.posts.slug}`}>{t('readNow')}</Link>
          }
        ></Button>
        <div className="space-x-4">
          <Badge variant="outline" className="px-2 h-6">
            <HeartIcon size={24} color="oklch(71.2% 0.194 13.428)" />
            {data.posts.voteCount}
          </Badge>
          <Badge variant="outline" className="px-2 h-6">
            <EyeIcon size={24} />
            {data.posts.viewCount}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
