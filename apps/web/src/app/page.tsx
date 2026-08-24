import { Button } from '@odyssey/ui/components/ui/button';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { SiDiscord } from '@icons-pack/react-simple-icons';
import Link from 'next/link';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  const messengerUrl = process.env.NEXT_PUBLIC_MESSENGER_URL || '/';
  const discordUrl = process.env.NEXT_PUBLIC_DISCORD_URL || '/';

  return (
    <main className="">
      <section className="px-5 pb-8 flex flex-col gap-16 md:px-20 md:py-20 md:flex-row-reverse md:justify-center md:items-center md:gap-40">
        <div className="w-full max-w-100 ">
          <div className="relative aspect-square ">
            <Image
              src="/page/landing/hero.png"
              alt={t('heroImage')}
              fill
              className="object-cover bg-transparent"
              sizes="(max-width: 768px) 100vw, 360px"
              priority
            />
          </div>
        </div>
        <div className="w-full max-w-3xs flex flex-col gap-4 justify-center">
          <div className="space-y-2">
            <h1 className="whitespace-pre-line">{t('title')}</h1>
            <p className="max-w-60">
              Học tập, tinh tấn và tìm đến hạnh phúc cùng với Odyssey.
            </p>
          </div>
          <div>
            <Button
              className="text-center"
              nativeButton={false}
              render={<Link href={discordUrl} />}
            >
              <SiDiscord />
              Discord
            </Button>
          </div>
          <div>
            <p>
              {t('helper')}
              <Link href={messengerUrl} className="link text-lg">
                Messenger
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
