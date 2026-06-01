import translations from '../i18n/translations'

function useTranslations() {
  const language = localStorage.getItem('language') || 'en'

  function t(key) {
    return translations[language]?.[key] || key
  }

  return {
    t,
    language,
  }
}

export default useTranslations