/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS } from '../data/constants'
import { LANGUAGES, LOCALES, memberNames, seedTaskContent, translations } from '../i18n/translations'

const LanguageContext = createContext(null)

const getInitialLanguage = () => {
  try {
    const storedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE)
    if (storedLanguage === LANGUAGES.AR || storedLanguage === LANGUAGES.EN) return storedLanguage
  } catch (error) {
    console.error('Failed to read language from localStorage:', error)
  }
  return LANGUAGES.EN
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage)
  const isRTL = language === LANGUAGES.AR
  const locale = LOCALES[language]

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language)
    } catch (error) {
      console.error('Failed to save language to localStorage:', error)
    }
  }, [language, isRTL])

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === LANGUAGES.AR ? LANGUAGES.EN : LANGUAGES.AR))
  }, [])

  const t = useCallback(
    (key, params) => {
      const template = translations[language][key] ?? translations[LANGUAGES.EN][key] ?? key
      if (!params) return template
      return Object.keys(params).reduce(
        (text, name) => text.split(`{${name}}`).join(String(params[name])),
        template,
      )
    },
    [language],
  )

  const getTaskContent = useCallback(
    (task) => {
      const translated = language === LANGUAGES.AR ? seedTaskContent[task.id] : null
      return translated ?? { title: task.title, description: task.description }
    },
    [language],
  )

  const translateName = useCallback(
    (name) => (language === LANGUAGES.AR ? memberNames[name] ?? name : name),
    [language],
  )

  const formatDate = useCallback(
    (isoDate) =>
      new Date(`${isoDate}T00:00:00`).toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
    [locale],
  )

  const value = useMemo(
    () => ({
      language,
      isRTL,
      locale,
      toggleLanguage,
      t,
      getTaskContent,
      translateName,
      formatDate,
    }),
    [language, isRTL, locale, toggleLanguage, t, getTaskContent, translateName, formatDate],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}