import { customAlphabet } from 'nanoid';
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const alphabetLetters = 'abcdefghijklmnopqrstuvwxyz';
export const randomString = customAlphabet(alphabet, 10);
export const randomLetters = customAlphabet(alphabetLetters, 10);
export const randomId = () => {
  const firstChar = randomLetters(1);
  const restChars = randomString(21);
  return firstChar + restChars;
};
