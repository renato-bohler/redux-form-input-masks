const escapeRegExp = str =>
  str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

const countOcurrences = (str, regexp) => (str.match(regexp) || []).length;

export { escapeRegExp, countOcurrences };
