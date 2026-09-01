'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@odyssey/ui/components/ui/tabs';
import { Card, CardContent } from '@odyssey/ui/components/ui/card';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthForm() {
  const t = useTranslations('AuthForm');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(value: string) =>
            setActiveTab(value as 'login' | 'register')
          }
          className="space-y-4"
        >
          <TabsList className="w-full">
            <TabsTrigger value="login">{t('login')}</TabsTrigger>
            <TabsTrigger value="register">{t('register')}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
