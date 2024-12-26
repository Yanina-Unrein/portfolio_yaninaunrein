import { translations } from '@/i18n/translations';
import { EXPERIENCE } from '@/data/experience';
import { PROJECTS } from '@/data/projects_details';
import { PROJECTSC } from '@/data/projects_colaborate';


const defaultLang = 'es';

export function getLangFromUrl(url) {
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang;
  return defaultLang;
}

export function useTranslations(lang) {
  return function t(key) {
    return key.split('.').reduce((obj, k) => obj && obj[k], translations[lang]) || key;
  };
}

export function updateLanguage(lang) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('lang', lang);
    
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = useTranslations(lang)(key);
      
      const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      
      if (textNode) {
        textNode.nodeValue = translation;
      } else {
        el.insertBefore(document.createTextNode(translation), el.firstChild);
      }
    });

    updateExperienceItems(lang);
    updateCardProject(lang);
    updateCardProjectColaboration(lang);
    const slug = getCurrentProjectSlug();
    updateProjectDetails(lang, slug); 
    updateCVDownload(lang); 
    updateFormPlaceholders(lang);

    // Evitar cambiar la URL en la página 404
    const is404Page = window.location.pathname.includes('404');
    if (is404Page) return;

    // Obtener la ruta actual sin modificar
    const pathParts = window.location.pathname.split('/');
    const isLangInPath = pathParts[1] in translations;
    
    // Reconstruir la ruta para español e inglés
    let currentPath = isLangInPath ? pathParts.slice(2).join('/') : pathParts.slice(1).join('/');
    let newPath = `/${currentPath}`;
    
    // Si el idioma es distinto de español, agregar el código de idioma
    if (lang !== 'es') {
      newPath = `/${lang}/${currentPath}`;
    }
    
    // Actualizar el estado de la URL sin recargar la página
    window.history.replaceState({}, '', newPath);
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

function updateCardProject(lang) {
  const cardProject = document.querySelectorAll('.link-detail-proyect');
  const translations = PROJECTS[lang] || PROJECTS[defaultLang];

  cardProject.forEach((item, index) => {
    const project = translations[index];
    if (project) {
      item.querySelector('h4').textContent = project.title;
      item.querySelector('p').textContent = project.description;
      item.querySelector('span').textContent = project.link; 
    }
  });
}

function updateCardProjectColaboration(lang) {
  const cardProject = document.querySelectorAll('.card-colaboration');
  const translations = PROJECTSC[lang] || PROJECTSC[defaultLang];

  cardProject.forEach((item, index) => {
    const project = translations[index];
    if (project) {
      item.querySelector('h4').textContent = project.title;
      item.querySelector('p').textContent = project.description;
      item.querySelector('a').textContent = project.view_more;
    }
  });
}

function getCurrentProjectSlug() {
  const pathParts = window.location.pathname.split('/');
  return pathParts[pathParts.length - 1]; 
}

function updateProjectDetails(lang, slug) {
  const project = PROJECTS[lang]?.find((p) => p.slug === slug);

  if (project) {
    document.querySelector('.title').textContent = project.title;
    document.querySelector('.description').textContent = project.description;
    document.querySelector('.description-extend').textContent = project.descriptionExtend;
    document.querySelector('.responsability').textContent = project.rol;
  }
}

export function updateCVDownload(lang) {
  const downloadButton = document.querySelector('a[download*="YaninaUnrein_CV"]');
  if (downloadButton) {
    const cvPath = lang === 'en' ? '/CV_YaninaUnrein_EN.pdf' : '/CV_YaninaUnrein_ES.pdf';
    const downloadFileName = `YaninaUnrein_CV_${lang.toUpperCase()}.pdf`;
    
    downloadButton.href = cvPath;
    downloadButton.setAttribute('download', downloadFileName);
  }
}

export function updateFormPlaceholders(lang) {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const t = translations[lang] || translations[defaultLang];
  
  // Update input placeholders
  const nameInput = form.querySelector('#name');
  const messageTextarea = form.querySelector('#message');
  
  if (nameInput) {
    nameInput.placeholder = t.contactForm.namePlaceholder;
  }
  
  if (messageTextarea) {
    messageTextarea.placeholder = t.contactForm.messagePlaceholder;
  }
}

export function getCurrentLang() {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('lang') || defaultLang;
  }
  return defaultLang;
}

// Función para cambiar el idioma
export function changeLanguage(newLang) {
  updateLanguage(newLang);
}