import { translations } from '@/i18n/translations';
import { EXPERIENCE } from '@/data/experience';



const defaultLang = 'es';

export function getLangFromUrl(url) {
  const [, lang] = url.pathname.split('/');
  console.log('Idioma obtenido de la URL:', lang); // Verifica el idioma obtenido de la URL
  if (lang in translations) return lang;
  return defaultLang;
}

export function useTranslations(lang) {
  console.log('Usando traducciones para el idioma:', lang); // Verifica el idioma actual para las traducciones
  return function t(key) {
    return key.split('.').reduce((obj, k) => obj && obj[k], translations[lang]) || key;
  };
}

export function updateLanguage(lang) {
  console.log('Actualizando idioma a:', lang);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('lang', lang);
    
    const elements = document.querySelectorAll('[data-i18n]');
    console.log('Elementos con data-i18n:', elements);
    
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = useTranslations(lang)(key);
      
      const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      
      if (textNode) {
        textNode.nodeValue = translation;
      } else {
        el.insertBefore(document.createTextNode(translation), el.firstChild);
      }

      console.log(`Actualizando ${key} con la traducción:`, translation);
    });

    // Update experience items
    updateExperienceItems(lang);
  }
}

function updateExperienceItems(lang) {
  const experienceItems = document.querySelectorAll('.experience-item');
  const translations = EXPERIENCE[lang] || EXPERIENCE[defaultLang];

  experienceItems.forEach((item, index) => {
    const experience = translations[index];
    if (experience) {
      item.querySelector('h3').textContent = experience.title;
      item.querySelector('h4').textContent = experience.position;
      item.querySelector('time').textContent = experience.endDate 
        ? `${experience.startDate} - ${experience.endDate}`
        : experience.startDate;
      item.querySelector('p').textContent = experience.description;
      const link = item.querySelector('a');
      if (link) {
        link.href = experience.url;
      }
    }
  });
}

export function getCurrentLang() {
  if (typeof localStorage !== 'undefined') {
    const lang = localStorage.getItem('lang') || defaultLang;
    console.log('Idioma actual obtenido de localStorage:', lang); // Verifica el idioma actual de localStorage
    return lang;
  }
  return defaultLang;
}