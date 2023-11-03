export default function validatePassword(password) {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigits = /\d/.test(password);

  if (password.length < 8) {
    return 'パスワードは8文字以上でお願いします';
  }
  if (!hasUpperCase) {
    return 'パスワードには大文字も含めてください';
  }
  if (!hasLowerCase) {
    return 'パスワードには小文字も含めてください';
  }
  if (!hasDigits) {
    return 'パスワードには数字も入れてください';
  }

  return null; // パスワードがすべての要件を満たしている場合
}
