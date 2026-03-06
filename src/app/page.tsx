import { useTranslations } from 'next-intl';
import LangSwitcher from '@/components/LangSwitcher';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <LangSwitcher />
    </main>
  );
}