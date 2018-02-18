import { escapeRegExp, countOcurrences } from '../utils';

describe('escapeRegExp', () => {
  it('should add escape to all RegExp special characters', () => {
    const special = '-[]/{}()*+?.^$|';
    const escapedSpecial = '\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\^\\$\\|';

    expect(escapeRegExp(special)).toBe(escapedSpecial);
  });
});

describe('countOcurrences', () => {
  it('should count ocurrences of substrings correctly', () => {
    const string = 'abc---';

    expect(countOcurrences(string, /a/g)).toBe(1);
    expect(countOcurrences(string, /b/g)).toBe(1);
    expect(countOcurrences(string, /c/g)).toBe(1);
    expect(countOcurrences(string, /d/g)).toBe(0);
    expect(countOcurrences(string, /-/g)).toBe(3);
  });
});
