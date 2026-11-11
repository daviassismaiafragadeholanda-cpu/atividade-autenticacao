const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailValido(email) {
  return FORMATO_EMAIL.test(email.trim());
}
