let languageCache;
const subscribers = new Set(); // Para almacenar los suscriptores

// Obtener el idioma actual o usar 'es' como predeterminado
export const getCurrentLanguage = () => {
  if (typeof window !== 'undefined') {
    const language = localStorage.getItem('language');
    return (language === 'en' || language === 'es') ? language : 'es';
  }
  return 'es'; // Valor predeterminado si está en el servidor
};

// Permitir que los componentes se suscriban a los cambios de idioma
export const subscribeToLanguageChange = (callback) => {
    subscribers.add(callback);
    // Retornar función para cancelar la suscripción
    return () => subscribers.delete(callback); 
  };

// Llamar a todos los suscriptores al cambiar el idioma
export const setLanguage = (newLanguage) => {
    if (typeof window !== 'undefined' && (newLanguage === 'en' || newLanguage === 'es')) {
      console.log(`Estableciendo idioma: ${newLanguage}`); // Agrega este log
      localStorage.setItem('language', newLanguage);
      
      // Notificar a los suscriptores sobre el cambio de idioma
      subscribers.forEach(callback => {
        callback(newLanguage); // Asegúrate de que este callback esté usando el idioma correcto
      });
    }
  };

