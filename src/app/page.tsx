import { useTranslations } from 'next-intl';
import LangSwitcher from '@/components/LangSwitcher';
import HomePage from '@/features/home';

export default function Page() {

  return (
    <main>
      <HomePage />
    </main>
  );
}