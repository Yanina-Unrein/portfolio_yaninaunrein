export function validateName(name) {
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return 'El nombre solo puede contener letras y espacios';
  }
  return '';
}

export function validateEmail(email) {
  if (!/\S+@\S+\.\S+/.test(email)) {
    return 'El correo no es válido';
  }
  return '';
}

export function validateMessage(message) {
  if (!message.trim()) {
    return 'El mensaje es obligatorio';
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