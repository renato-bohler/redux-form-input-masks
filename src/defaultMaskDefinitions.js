export default {
  // Accepts both uppercase and lowercase and transform to uppercase
  A: {
    regExp: /[A-Za-z]/,
    transform: char => char.toUpperCase(),
  },
  // Accepts both uppercase and lowercase and transform to lowercase
  a: {
    regExp: /[A-Za-z]/,
    transform: char => char.toLowerCase(),
  },
  // Accepts only uppercase
  U: {
    regExp: /[A-Z]/,
  },
  // Accepts only lowercase
  l: {
    regExp: /[a-z]/,
  },
  // Numbers
  9: {
    regExp: /[0-9]/,
  },
};
