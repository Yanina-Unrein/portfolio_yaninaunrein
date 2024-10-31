import { useTranslations, getCurrentLang } from '@/i18n/utils';

export function validateName(name) {
  const lang = getCurrentLang();
  const t = useTranslations(lang);

  if (!name.trim()) {
    return t('contactForm.errors.name_required');
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return t('contactForm.errors.name_invalid');
  }
  return '';
}

export function validateEmail(email) {
  const lang = getCurrentLang();
  const t = useTranslations(lang);

  if (!email.trim()) {
    return t('contactForm.errors.email_required');
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return t('contactForm.errors.email_invalid');
  }
  return '';
}

export function validateMessage(message) {
  const lang = getCurrentLang();
  const t = useTranslations(lang);

  if (!message.trim()) {
    return t('contactForm.errors.message_required');
  }
  return '';
}

export function validateFormFields(name, email, message) {
  const nameErrorMessage = validateName(name);
  const emailErrorMessage = validateEmail(email);
  const messageErrorMessage = validateMessage(message);

  return {
    nameErrorMessage,
    emailErrorMessage,
    messageErrorMessage,
  };
}