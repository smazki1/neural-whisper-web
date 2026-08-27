export function validatePasswordChange(password, confirmation) {
  if (password.length < 8) {
    return "too_short";
  }

  if (!/[A-Z]/.test(password)) {
    return "missing_uppercase";
  }

  if (!/[a-z]/.test(password)) {
    return "missing_lowercase";
  }

  if (!/\d/.test(password)) {
    return "missing_number";
  }

  if (password !== confirmation) {
    return "mismatch";
  }

  return null;
}
