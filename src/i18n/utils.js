import { ui, defaultLang } from './ui.js';

export function getLangFromUrl(url) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang;
  return defaultLang;
}

export function useTranslations(lang) {
  return function t(key) {
    return key.split('.').reduce((obj, k) => obj && obj[k], ui[lang]) || key;
  }
}

export function useTranslatedPath(lang) {
  return function translatePath(path) {
    return lang === defaultLang ? path : `/${lang}${path}`;
  }
}