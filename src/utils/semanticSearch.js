export class SemanticSearch {
  constructor(data, keywords, language) {
    this.data = data;
    this.keywords = keywords;
    this.language = language;
  }

  findMatches(query) {
    const lowerQuery = query.toLowerCase();
    
    // Buscar por categoría principal
    for (const [category, terms] of Object.entries(this.keywords[this.language])) {
      if (terms.some(term => lowerQuery.includes(term))) {
        return this.getCategoryResponse(category, query);
      }
    }
    
    // Búsqueda específica por tecnología
    const techResponse = this.searchTechnology(lowerQuery);
    if (techResponse) return techResponse;
    
    // Búsqueda en experiencia laboral específica
    const expResponse = this.searchSpecificExperience(lowerQuery);
    if (expResponse) return expResponse;
    
    return this.data.mensajes_base.no_data;
  }

  getCategoryResponse(category, originalQuery) {
    switch(category) {
      case 'sobre_mi':
        return this.data.sobre_mi;
      
      case 'experiencia':
      case 'experience':
        return this.formatExperienceResponse();
      
      case 'proyectos':
      case 'projects':
        return this.formatProjectsResponse();
      
      case 'educacion':
      case 'education':
        return this.formatEducationResponse();
      
      case 'habilidades':
      case 'skills':
        return this.formatSkillsResponse();
      
      case 'cursos':
        return this.formatCoursesResponse();
      
      case 'contacto':
      case 'contact':
        return this.formatContactResponse();
      
      default:
        return this.data.mensajes_base.no_data;
    }
  }

  formatExperienceResponse() {
    const exp = this.data.experiencia;
    let response = this.language === 'es' ? 
      "<div class='experience-section'><h4>💼 Experiencia Laboral</h4>" : 
      "<div class='experience-section'><h4>💼 Work Experience</h4>";
    
    Object.values(exp).forEach(job => {
      response += `
        <div class="job-item">
          <div class="job-header">
            <strong class="job-title">${job.titulo}</strong>
            <span class="job-period">${job.periodo}</span>
          </div>
          <ul class="job-description">
            ${job.descripcion.map(desc => `<li>${desc}</li>`).join('')}
          </ul>
          <div class="job-technologies">
            <strong>${this.language === 'es' ? 'Tecnologías' : 'Technologies'}:</strong> 
            <span class="tech-tags">${job.stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}</span>
          </div>
        </div>
      `;
    });
    
    response += "</div>";
    return response;
  }

  formatSkillsResponse() {
    const skills = this.data.skills;
    let response = this.language === 'es' ? 
      "<div class='skills-section'><h4>🛠️ Habilidades Técnicas</h4>" : 
      "<div class='skills-section'><h4>🛠️ Technical Skills</h4>";
    
    Object.entries(skills).forEach(([category, techs]) => {
      const categoryName = this.getCategoryName(category);
      response += `
        <div class="skill-category">
          <strong>${categoryName}:</strong>
          <div class="skill-tags">${techs.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}</div>
        </div>
      `;
    });
    
    response += "</div>";
    return response;
  }

  formatEducationResponse() {
    const edu = this.data.educacion;
    let response = this.language === 'es' ? 
      "<div class='education-section'><h4>🎓 Educación</h4>" : 
      "<div class='education-section'><h4>🎓 Education</h4>";
    
    Object.values(edu).forEach(study => {
      response += `
        <div class="education-item">
          <div class="edu-header">
            <strong class="edu-title">${study.titulo}</strong>
            <span class="edu-period">${study.periodo}</span>
          </div>
          <p class="edu-detail">${study.detalle}</p>
          ${study.proyectos && study.proyectos.length > 0 ? `
            <div class="edu-projects">
              <strong>${this.language === 'es' ? 'Proyectos destacados' : 'Featured projects'}:</strong>
              <ul class="project-list">
                ${study.proyectos.map(proj => `<li>${proj}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `;
    });
    
    response += "</div>";
    return response;
  }

  formatProjectsResponse() {
    return this.data.proyectos;
  }

  formatCoursesResponse() {
    const courses = this.data.cursos_destacados;
    let response = this.language === 'es' ? 
      "<div class='courses-section'><h4>📚 Cursos y Certificaciones</h4>" : 
      "<div class='courses-section'><h4>📚 Courses and Certifications</h4>";
    
    courses.forEach(course => {
      response += `<div class="course-item">${course}</div>`;
    });
    
    response += "</div>";
    return response;
  }

  formatContactResponse() {
    const contact = this.data.contacto;
    return this.language === 'es' ? 
      `<div class="contact-section">
        <h4>📞 Contacto</h4>
        <div class="contact-info">
          <div class="contact-item"><strong>📧 Email:</strong> ${contact.email}</div>
          <div class="contact-item"><strong>📱 Teléfono:</strong> ${contact.telefono}</div>
          <div class="contact-item"><strong>📍 Ubicación:</strong> ${contact.ubicacion}</div>
          <div class="contact-item"><strong>🔗 LinkedIn:</strong> ${contact.linkedin}</div>
          <div class="contact-item"><strong>🐙 GitHub:</strong> ${contact.github}</div>
          <div class="contact-item"><strong>🌐 Portfolio:</strong> ${contact.portfolio}</div>
        </div>
      </div>` :
      `<div class="contact-section">
        <h4>📞 Contact</h4>
        <div class="contact-info">
          <div class="contact-item"><strong>📧 Email:</strong> ${contact.email}</div>
          <div class="contact-item"><strong>📱 Phone:</strong> ${contact.telefono}</div>
          <div class="contact-item"><strong>📍 Location:</strong> ${contact.ubicacion}</div>
          <div class="contact-item"><strong>🔗 LinkedIn:</strong> ${contact.linkedin}</div>
          <div class="contact-item"><strong>🐙 GitHub:</strong> ${contact.github}</div>
          <div class="contact-item"><strong>🌐 Portfolio:</strong> ${contact.portfolio}</div>
        </div>
      </div>`;
  }

  searchTechnology(query) {
    const allTechs = [
      ...(this.data.skills.frontend || []),
      ...(this.data.skills.backend || []),
      ...(this.data.skills.herramientas || []),
      ...(this.data.skills.bases_de_datos || []),
      ...(this.data.skills.cms || []),
      ...(this.data.skills.metodologias || [])
    ];
    
    const foundTech = allTechs.find(tech => 
      query.includes(tech.toLowerCase())
    );
    
    if (foundTech) {
      return this.language === 'es' ? 
        `✅ Sí, Yanina tiene experiencia con **${foundTech}**. ${this.getTechContext(foundTech)}` :
        `✅ Yes, Yanina has experience with **${foundTech}**. ${this.getTechContext(foundTech, 'en')}`;
    }
    
    return null;
  }

  searchSpecificExperience(query) {
    const experiences = this.data.experiencia;
    
    // Buscar por empresa
    if (query.includes('ausa')) {
      return this.formatSingleExperience(experiences.ausa);
    }
    if (query.includes('epidata')) {
      return this.formatSingleExperience(experiences.epidata);
    }
    if (query.includes('publissoft')) {
      return this.formatSingleExperience(experiences.publissoft);
    }
    
    return null;
  }

  formatSingleExperience(job) {
    let response = `<div class="single-experience">
      <div class="job-header">
        <strong class="job-title">${job.titulo}</strong>
        <span class="job-period">${job.periodo}</span>
      </div>
      <div class="job-details">
        <strong>${this.language === 'es' ? 'Responsabilidades' : 'Responsibilities'}:</strong>
        <ul class="job-description">
          ${job.descripcion.map(desc => `<li>${desc}</li>`).join('')}
        </ul>
      </div>
      <div class="job-technologies">
        <strong>${this.language === 'es' ? 'Tecnologías' : 'Technologies'}:</strong> 
        <span class="tech-tags">${job.stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}</span>
      </div>
    </div>`;
    
    return response;
  }

  getTechContext(tech, lang = 'es') {
    // Buscar en qué experiencias se usa esta tecnología
    const experiencesWithTech = [];
    
    for (const [company, job] of Object.entries(this.data.experiencia || {})) {
      if (job.stack.includes(tech)) {
        experiencesWithTech.push(job.titulo.split('—')[1]?.trim());
      }
    }
    
    if (experiencesWithTech.length > 0) {
      return lang === 'es' ? 
        `La utilizó en: ${experiencesWithTech.join(', ')}.` :
        `She used it at: ${experiencesWithTech.join(', ')}.`;
    }
    
    return lang === 'es' ? 
      "Es parte de su stack tecnológico actual." :
      "It's part of her current tech stack.";
  }

  getCategoryName(category) {
    const translations = {
      es: {
        'frontend': '🎨 Frontend',
        'backend': '⚙️ Backend', 
        'herramientas': '🔧 Herramientas',
        'bases_de_datos': '🗄️ Bases de Datos',
        'cms': '🌐 CMS',
        'metodologias': '📋 Metodologías'
      },
      en: {
        'frontend': '🎨 Frontend',
        'backend': '⚙️ Backend',
        'herramientas': '🔧 Tools',
        'bases_de_datos': '🗄️ Databases',
        'cms': '🌐 CMS',
        'metodologias': '📋 Methodologies'
      }
    };
    
    return translations[this.language]?.[category] || category;
  }

  getTechContext(tech, lang = 'es') {
    const experiencesWithTech = [];

    // Revisar dónde se usa la tecnología
    for (const [company, job] of Object.entries(this.data.experiencia || {})) {
      if (job.stack.includes(tech)) {
        // Extract company name from title
        const companyName = job.titulo.split('—')[1]?.trim();
        experiencesWithTech.push(companyName || job.titulo);
      }
    }

    if (experiencesWithTech.length === 0) {
      return lang === 'es'
        ? "Forma parte de su stack general."
        : "It is part of her general tech stack.";
    }

    const companiesText = experiencesWithTech.join(", ");

    return lang === 'es'
      ? `Lo ha utilizado especialmente en: ${companiesText}.`
      : `She has used it especially at: ${companiesText}.`;
  }
}