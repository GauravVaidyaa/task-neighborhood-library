export const isEmptyOrWhitespace = (value) => {
  if (value === null || value === undefined) return true;

  // if number
  if (typeof value === "number") return false;

  // if string
  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  return true;
};

export const trimValue = (value) =>
  typeof value === "string" ? value.trim() : value;


export const isValidEmail = (email = "") => {
  const trimmed = trimValue(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
};

export const isValidName = (name = "") => {
  const trimmed = trimValue(name);
  const nameRegex = /^[A-Za-z\s]+$/;
  return nameRegex.test(trimmed);
};

export const isValidPhone = (phone = "") => {
  const trimmed = trimValue(phone);
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(trimmed);
};