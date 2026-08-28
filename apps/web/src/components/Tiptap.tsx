'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useTranslations } from 'next-intl';
import { Toolbar } from './Toolbar';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import { TextStyleKit } from '@tiptap/extension-text-style';

export function Tiptap({
  className,
  content,
}: {
  className?: string;
  content?: string;
}) {
  const t = useTranslations('BlogNew');
  if (!content) {
    content = `${t('content')}`;
  }
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: `${t('content')}` }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Link,
      Image,
      Highlight,
      TextStyleKit,
      Color,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'prose sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none',
      },
    },
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  return (
    <div className={`${className} h-full flex min-h-0 flex-col gap-4`}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="overflow-auto" />
    </div>
  );
}

export default Tiptap;
