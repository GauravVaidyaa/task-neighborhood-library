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
