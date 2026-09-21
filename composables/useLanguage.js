import { translate } from '~/utils/translations.js';

export function useLanguage() {
  const preference = useCookie('skarn-language', {
    default: () => 'en',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  });
  const locale = computed(() => preference.value === 'pt' ? 'pt' : 'en');
  const t = (message, values) => translate(locale.value, message, values);

  async function setLanguage(value) {
    if (!['en', 'pt'].includes(value) || value === locale.value) return;
    preference.value = value;
    await nextTick();
    // Reload so legacy canvas games and setup-time labels use the same language.
    window.location.reload();
  }

  return { locale, t, setLanguage };
}
