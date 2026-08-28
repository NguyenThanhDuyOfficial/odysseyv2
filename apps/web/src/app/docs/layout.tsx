import { source } from '../../lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '../../lib/layout.shared';
import { RootProvider } from 'fumadocs-ui/provider/next';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <RootProvider search={{ options: { api: '/api/v1/search' } }}>
      <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
