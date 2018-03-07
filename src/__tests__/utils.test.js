import * as utils from '../utils';

const maskDefinitions = {
  A: {
    regExp: /[A-Za-z]/,
    transform: char => char.toUpperCase(),
  },
  a: {
    regExp: /[a-z]/,
    transform: char => char.toUpperCase(),
  },
  9: {
    regExp: /[0-9]/,
  },
  0: {
    regExp: /[0-9]/,
    transform: char => (Number(char) === 9 ? 0 : Number(char) + 1),
  },
};

const codePattern = 'AAA-9999';
const phonePattern = '(999) 999-9999';
const crazyPattern = 'AA-=-=-99==';
const transformPattern = 'AAA-00009';
const placeholder = '_';

describe('escapeRegExp', () => {
  it('should add escape to all RegExp special characters', () => {
    const special = '-[]/{}()*+?.^$|';
    const escapedSpecial = '\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\^\\$\\|';

    expect(utils.escapeRegExp(special)).toBe(escapedSpecial);
  });
});

describe('countOcurrences', () => {
  it('should count ocurrences of substrings correctly', () => {
    const string = 'abc---';

    expect(utils.countOcurrences(string, /a/g)).toBe(1);
    expect(utils.countOcurrences(string, /b/g)).toBe(1);
    expect(utils.countOcurrences(string, /c/g)).toBe(1);
    expect(utils.countOcurrences(string, /d/g)).toBe(0);
    expect(utils.countOcurrences(string, /-/g)).toBe(3);
  });
});

describe('getMaskDefinition', () => {
  it('should return the mask definition for a given char', () => {
    expect(utils.getMaskDefinition('A', maskDefinitions)).toBe(
      maskDefinitions['A'],
    );
    expect(utils.getMaskDefinition('a', maskDefinitions)).toBe(
      maskDefinitions['a'],
    );
    expect(utils.getMaskDefinition('9', maskDefinitions)).toBe(
      maskDefinitions['9'],
    );
  });
});

describe('applyMask', () => {
  it('should apply mask to complete and correct stripped values', () => {
    expect(
      utils.applyMask(
        'ABC0123',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-0123');
    expect(
      utils.applyMask(
        'ABC0123',
        codePattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('ABC-0123');

    expect(
      utils.applyMask(
        '0123456789',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6789');
    expect(
      utils.applyMask(
        '0123456789',
        phonePattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6789');
  });

  it('should apply mask to incomplete and correct stripped values', () => {
    expect(
      utils.applyMask('', codePattern, placeholder, true, maskDefinitions),
    ).toBe('___-____');
    expect(
      utils.applyMask('A', codePattern, placeholder, true, maskDefinitions),
    ).toBe('A__-____');
    expect(
      utils.applyMask('ABC1', codePattern, placeholder, true, maskDefinitions),
    ).toBe('ABC-1___');

    expect(
      utils.applyMask('', codePattern, placeholder, false, maskDefinitions),
    ).toBe('');
    expect(
      utils.applyMask('A', codePattern, placeholder, false, maskDefinitions),
    ).toBe('A');
    expect(
      utils.applyMask('ABC1', codePattern, placeholder, false, maskDefinitions),
    ).toBe('ABC-1');

    expect(
      utils.applyMask('', phonePattern, placeholder, true, maskDefinitions),
    ).toBe('(___) ___-____');
    expect(
      utils.applyMask('9', phonePattern, placeholder, true, maskDefinitions),
    ).toBe('(9__) ___-____');
    expect(
      utils.applyMask('9876', phonePattern, placeholder, true, maskDefinitions),
    ).toBe('(987) 6__-____');
    expect(
      utils.applyMask(
        '9876543',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(987) 654-3___');

    expect(
      utils.applyMask('', phonePattern, placeholder, false, maskDefinitions),
    ).toBe('(');
    expect(
      utils.applyMask('9', phonePattern, placeholder, false, maskDefinitions),
    ).toBe('(9');
    expect(
      utils.applyMask(
        '9876',
        phonePattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(987) 6');
    expect(
      utils.applyMask(
        '9876543',
        phonePattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(987) 654-3');
  });

  it('should apply mask to incorrect stripped values', () => {
    expect(
      utils.applyMask('1', codePattern, placeholder, true, maskDefinitions),
    ).toBe('___-____');
    expect(
      utils.applyMask(
        '$234567',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('___-____');
    expect(
      utils.applyMask(
        'ABC$?45',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-____');

    expect(
      utils.applyMask('1', codePattern, placeholder, false, maskDefinitions),
    ).toBe('');
    expect(
      utils.applyMask(
        '$234567',
        codePattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('');
    expect(
      utils.applyMask(
        'ABC$?45',
        codePattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('ABC-');

    expect(
      utils.applyMask('a', phonePattern, placeholder, true, maskDefinitions),
    ).toBe('(___) ___-____');
    expect(
      utils.applyMask(
        '012345$678',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 345-____');

    expect(
      utils.applyMask('a', phonePattern, placeholder, false, maskDefinitions),
    ).toBe('(');
    expect(
      utils.applyMask(
        '012345$678',
        phonePattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 345-');
  });

  it('should apply mask to overflowing stripped values', () => {
    expect(
      utils.applyMask(
        'ABC12345',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-1234');
    expect(
      utils.applyMask(
        'ABC1234*',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-1234');

    expect(
      utils.applyMask(
        '01234567891',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6789');
    expect(
      utils.applyMask(
        '0123456789+',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6789');
  });
});

describe('maskStrip', () => {
  it('should strip complete and correct formatted values', () => {
    expect(
      utils.maskStrip('ABC-1234', codePattern, placeholder, maskDefinitions),
    ).toBe('ABC1234');

    expect(
      utils.maskStrip(
        '(012) 345-6789',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe('0123456789');
  });

  it('should strip incomplete and correct formatted values', () => {
    expect(utils.maskStrip('', codePattern, placeholder, maskDefinitions)).toBe(
      '',
    );
    expect(
      utils.maskStrip('___-____', codePattern, placeholder, maskDefinitions),
    ).toBe('');
    expect(
      utils.maskStrip('ABC-12__', codePattern, placeholder, maskDefinitions),
    ).toBe('ABC12');
    expect(
      utils.maskStrip('ABC-12', codePattern, placeholder, maskDefinitions),
    ).toBe('ABC12');

    expect(
      utils.maskStrip('', phonePattern, placeholder, maskDefinitions),
    ).toBe('');
    expect(
      utils.maskStrip(
        '(___) ___-____',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe('');
    expect(
      utils.maskStrip('(012) 345-', phonePattern, placeholder, maskDefinitions),
    ).toBe('012345');
    expect(
      utils.maskStrip(
        '(012) 345-____',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe('012345');
  });

  it('should return false for incorrect formatted values', () => {
    expect(
      utils.maskStrip('1', codePattern, placeholder, maskDefinitions),
    ).toBe(false);
    expect(
      utils.maskStrip('___-1___', codePattern, placeholder, maskDefinitions),
    ).toBe(false);
    expect(
      utils.maskStrip('AB,-____', codePattern, placeholder, maskDefinitions),
    ).toBe(false);
    expect(
      utils.maskStrip('ABC-<234', codePattern, placeholder, maskDefinitions),
    ).toBe(false);
    expect(
      utils.maskStrip('ABC-12>4', codePattern, placeholder, maskDefinitions),
    ).toBe(false);

    expect(
      utils.maskStrip('(a', phonePattern, placeholder, maskDefinitions),
    ).toBe(false);
    expect(
      utils.maskStrip(
        '(___) 1__-____',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(false);
    expect(
      utils.maskStrip(
        '(01_) 1__-____',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(false);
    expect(
      utils.maskStrip(
        '(012) 3!5-6789',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(false);
  });

  it('should strip overflowing formatted values', () => {
    expect(
      utils.maskStrip('ABC-12345', codePattern, placeholder, maskDefinitions),
    ).toBe('ABC1234');

    expect(
      utils.maskStrip(
        '(012) 345-67890',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe('0123456789');
  });
});

describe('inputReformat', () => {
  it('should handle user input', () => {
    expect(
      utils.inputReformat(
        '___-____',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('___-____');
    expect(
      utils.inputReformat(
        'A___-____',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('A__-____');
    expect(
      utils.inputReformat(
        'AB__-____',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('AB_-____');
    expect(
      utils.inputReformat(
        'ABC_-____',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-____');
    expect(
      utils.inputReformat(
        'ABC1-____',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-1___');
    expect(
      utils.inputReformat(
        'ABC-1____',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-1___');
    expect(
      utils.inputReformat(
        'ABC-12___',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-12__');
    expect(
      utils.inputReformat(
        'ABC-123__',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-123_');
    expect(
      utils.inputReformat(
        'ABC-1234_',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-1234');

    expect(
      utils.inputReformat('', codePattern, placeholder, false, maskDefinitions),
    ).toBe('');
    expect(
      utils.inputReformat(
        'A',
        codePattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('A');
    expect(
      utils.inputReformat(
        'AB',
        codePattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('AB');
    expect(
      utils.inputReformat(
        'ABC',
        codePattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('ABC-');
    expect(
      utils.inputReformat(
        'ABC1-',
        codePattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('ABC-1');
    expect(
      utils.inputReformat(
        'ABC-1',
        codePattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('ABC-1');
    expect(
      utils.inputReformat(
        'ABC-12',
        codePattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('ABC-12');
    expect(
      utils.inputReformat(
        'ABC-123',
        codePattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('ABC-123');
    expect(
      utils.inputReformat(
        'ABC-1234',
        codePattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('ABC-1234');

    expect(
      utils.inputReformat('', codePattern, placeholder, true, maskDefinitions),
    ).toBe('___-____');
    expect(
      utils.inputReformat('A', codePattern, placeholder, true, maskDefinitions),
    ).toBe('A__-____');
    expect(
      utils.inputReformat(
        'ABC-1',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-1___');
    expect(
      utils.inputReformat(
        'ABC-1234_',
        codePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-1234');

    expect(
      utils.inputReformat(
        '(___) ___-____',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(___) ___-____');
    expect(
      utils.inputReformat(
        '0(___) ___-____',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(0__) ___-____');
    expect(
      utils.inputReformat(
        '(0___) ___-____',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(0__) ___-____');
    expect(
      utils.inputReformat(
        '(01__) ___-____',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(01_) ___-____');
    expect(
      utils.inputReformat(
        '(012_) ___-____',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) ___-____');
    expect(
      utils.inputReformat(
        '(0123) ___-____',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 3__-____');
    expect(
      utils.inputReformat(
        '(012)3 ___-____',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 3__-____');
    expect(
      utils.inputReformat(
        '(012) 3___-____',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 3__-____');
    expect(
      utils.inputReformat(
        '(012) 34__-____',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 34_-____');
    expect(
      utils.inputReformat(
        '(012) 345_-____',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 345-____');
    expect(
      utils.inputReformat(
        '(012) 3456-____',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6___');
    expect(
      utils.inputReformat(
        '(012) 345-67___',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 345-67__');
    expect(
      utils.inputReformat(
        '(012) 345-678__',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 345-678_');
    expect(
      utils.inputReformat(
        '(012) 345-6789_',
        phonePattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6789');
  });

  expect(
    utils.inputReformat('(', phonePattern, placeholder, false, maskDefinitions),
  ).toBe('(');
  expect(
    utils.inputReformat(
      '0(',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(0');
  expect(
    utils.inputReformat(
      '(0',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(0');
  expect(
    utils.inputReformat(
      '(01',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(01');
  expect(
    utils.inputReformat(
      '(012',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) ');
  expect(
    utils.inputReformat(
      '(0123',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) 3');
  expect(
    utils.inputReformat(
      '(012)3',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) 3');
  expect(
    utils.inputReformat(
      '(012) 3',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) 3');
  expect(
    utils.inputReformat(
      '(012) 34',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) 34');
  expect(
    utils.inputReformat(
      '(012) 345',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) 345-');
  expect(
    utils.inputReformat(
      '(012) 3456-',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) 345-6');
  expect(
    utils.inputReformat(
      '(012) 345-6',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) 345-6');
  expect(
    utils.inputReformat(
      '(012) 345-67',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) 345-67');
  expect(
    utils.inputReformat(
      '(012) 345-678',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) 345-678');
  expect(
    utils.inputReformat(
      '(012) 345-6789',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) 345-6789');

  expect(
    utils.inputReformat('', phonePattern, placeholder, true, maskDefinitions),
  ).toBe('(___) ___-____');
  expect(
    utils.inputReformat('(0', phonePattern, placeholder, true, maskDefinitions),
  ).toBe('(0__) ___-____');
  expect(
    utils.inputReformat(
      '(0123) ___-____',
      phonePattern,
      placeholder,
      true,
      maskDefinitions,
    ),
  ).toBe('(012) 3__-____');
  expect(
    utils.inputReformat(
      '(012)3 ___-____',
      phonePattern,
      placeholder,
      true,
      maskDefinitions,
    ),
  ).toBe('(012) 3__-____');
  expect(
    utils.inputReformat(
      '(012) 3___-____',
      phonePattern,
      placeholder,
      true,
      maskDefinitions,
    ),
  ).toBe('(012) 3__-____');

  expect(
    utils.inputReformat('', phonePattern, placeholder, false, maskDefinitions),
  ).toBe('(');
  expect(
    utils.inputReformat(
      '(0',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(0');
  expect(
    utils.inputReformat(
      '(0123)',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) 3');
  expect(
    utils.inputReformat(
      '(012)3',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) 3');
  expect(
    utils.inputReformat(
      '(012) 3',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) 3');
  expect(
    utils.inputReformat(
      '(012) 3456-',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) 345-6');
  expect(
    utils.inputReformat(
      '(012) 345-6',
      phonePattern,
      placeholder,
      false,
      maskDefinitions,
    ),
  ).toBe('(012) 345-6');
});

describe('isPatternComplete', () => {
  it('should return true when a pattern is completely and correctly filled', () => {
    expect(
      utils.isPatternComplete('ABC-1234', codePattern, maskDefinitions),
    ).toBe(true);
    expect(
      utils.isPatternComplete('(012) 345-6789', phonePattern, maskDefinitions),
    ).toBe(true);
  });

  it('should return false when a pattern is not completely and correctly filled', () => {
    expect(utils.isPatternComplete('', codePattern, maskDefinitions)).toBe(
      false,
    );
    expect(
      utils.isPatternComplete('___-____', codePattern, maskDefinitions),
    ).toBe(false);
    expect(utils.isPatternComplete('ABC-', codePattern, maskDefinitions)).toBe(
      false,
    );
    expect(
      utils.isPatternComplete('ABC-____', codePattern, maskDefinitions),
    ).toBe(false);
    expect(
      utils.isPatternComplete('ABC-123', codePattern, maskDefinitions),
    ).toBe(false);
    expect(
      utils.isPatternComplete('ABC!1234', codePattern, maskDefinitions),
    ).toBe(false);

    expect(
      utils.isPatternComplete('(0__) ___-____', phonePattern, maskDefinitions),
    ).toBe(false);
    expect(utils.isPatternComplete('(0', phonePattern, maskDefinitions)).toBe(
      false,
    );
    expect(
      utils.isPatternComplete('(012] 345-6789', phonePattern, maskDefinitions),
    ).toBe(false);
  });
});

describe('validCaretPositions', () => {
  it('should return all valid caret positions', () => {
    // AAA-9999: all positions are valid
    expect(utils.validCaretPositions(codePattern, maskDefinitions)).toEqual([
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
    ]);

    // |(999)| 999-9999: positions marked with pipe should be invalid
    expect(utils.validCaretPositions(phonePattern, maskDefinitions)).toEqual([
      1,
      2,
      3,
      4,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
    ]);

    // AA-|=|-|=|-99: positions marked with pipe should be invalid
    expect(utils.validCaretPositions(crazyPattern, maskDefinitions)).toEqual([
      0,
      1,
      2,
      7,
      8,
      9,
    ]);

    expect(utils.validCaretPositions()).toEqual([]);
    expect(utils.validCaretPositions('')).toEqual([]);
    expect(utils.validCaretPositions({})).toEqual([]);
  });
});

describe('firstUnfilledPosition', () => {
  it('should return the first unfilled position for any value', () => {
    expect(
      utils.firstUnfilledPosition(
        '',
        codePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(0);
    expect(
      utils.firstUnfilledPosition(
        '___-____',
        codePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(0);
    expect(
      utils.firstUnfilledPosition(
        'A__-____',
        codePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(1);
    expect(
      utils.firstUnfilledPosition(
        'ABC-____',
        codePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(4);
    expect(
      utils.firstUnfilledPosition(
        'ABC-1234',
        codePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(8);

    expect(
      utils.firstUnfilledPosition(
        'A',
        codePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(1);
    expect(
      utils.firstUnfilledPosition(
        'ABC-',
        codePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(4);

    expect(
      utils.firstUnfilledPosition(
        '(___) ___-____',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(1);
    expect(
      utils.firstUnfilledPosition(
        '(0__) ___-____',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(2);
    expect(
      utils.firstUnfilledPosition(
        '(012) ___-____',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(6);
    expect(
      utils.firstUnfilledPosition(
        '(012) 345-____',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(10);
    expect(
      utils.firstUnfilledPosition(
        '(012) 345-6789',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(14);

    expect(
      utils.firstUnfilledPosition(
        '(012)',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(5);
    expect(
      utils.firstUnfilledPosition(
        '(012) ',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(6);
    expect(
      utils.firstUnfilledPosition(
        '(012) 345',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(9);
    expect(
      utils.firstUnfilledPosition(
        '(012) 345-',
        phonePattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(10);

    expect(
      utils.firstUnfilledPosition(
        '',
        crazyPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(0);
    expect(
      utils.firstUnfilledPosition(
        'A_-=-=-__==',
        crazyPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(1);
    expect(
      utils.firstUnfilledPosition(
        'AA-=-=-__==',
        crazyPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(7);
    expect(
      utils.firstUnfilledPosition(
        'AA-=-=-99==',
        crazyPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(9);

    expect(
      utils.firstUnfilledPosition(
        'A',
        crazyPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(1);
    expect(
      utils.firstUnfilledPosition(
        'AA',
        crazyPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(2);
  });
});

describe('applyTransform', () => {
  it('should apply transform to the inputted characters', () => {
    const strippedTransformPattern = utils.maskStrip(
      transformPattern,
      transformPattern,
      placeholder,
      maskDefinitions,
    );

    expect(
      utils.applyTransform('', '', strippedTransformPattern, maskDefinitions),
    ).toBe('');
    expect(
      utils.applyTransform('a', '', strippedTransformPattern, maskDefinitions),
    ).toBe('A');
    expect(
      utils.applyTransform(
        'a',
        undefined,
        strippedTransformPattern,
        maskDefinitions,
      ),
    ).toBe('A');
    expect(
      utils.applyTransform(
        'A',
        null,
        strippedTransformPattern,
        maskDefinitions,
      ),
    ).toBe('A');

    expect(
      utils.applyTransform(
        'ABc',
        'AB',
        strippedTransformPattern,
        maskDefinitions,
      ),
    ).toBe('ABC');
    expect(
      utils.applyTransform(
        'ABC0',
        'ABC',
        strippedTransformPattern,
        maskDefinitions,
      ),
    ).toBe('ABC1');
    expect(
      utils.applyTransform(
        'ABC1233',
        'ABC123',
        strippedTransformPattern,
        maskDefinitions,
      ),
    ).toBe('ABC1234');
    expect(
      utils.applyTransform(
        'ABC12344',
        'ABC1234',
        strippedTransformPattern,
        maskDefinitions,
      ),
    ).toBe('ABC12344');
  });
});
