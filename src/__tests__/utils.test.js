import * as utils from '../utils';
import defaultMaskDefinitions from '../defaultMaskDefinitions';

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

const numericPattern = '(999) 999-9999';
const mixedPattern = 'AAA-9999';
const positionsPattern = '--AA-=-=-99==';
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
        mixedPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-0123');
    expect(
      utils.applyMask(
        'ABC0123',
        mixedPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('ABC-0123');

    expect(
      utils.applyMask(
        '0123456789',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6789');
    expect(
      utils.applyMask(
        '0123456789',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6789');
  });

  it('should apply mask to incomplete and correct stripped values', () => {
    expect(
      utils.applyMask('', mixedPattern, placeholder, false, maskDefinitions),
    ).toBe('');

    expect(
      utils.applyMask('', numericPattern, placeholder, true, maskDefinitions),
    ).toBe('(___) ___-____');
    expect(
      utils.applyMask('9', numericPattern, placeholder, true, maskDefinitions),
    ).toBe('(9__) ___-____');
    expect(
      utils.applyMask(
        '9876',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(987) 6__-____');
    expect(
      utils.applyMask(
        '9876543',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(987) 654-3___');

    expect(
      utils.applyMask('', numericPattern, placeholder, false, maskDefinitions),
    ).toBe('(');
    expect(
      utils.applyMask('9', numericPattern, placeholder, false, maskDefinitions),
    ).toBe('(9');
    expect(
      utils.applyMask(
        '9876',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(987) 6');
    expect(
      utils.applyMask(
        '9876543',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(987) 654-3');
  });

  it('should apply mask to incorrect stripped values', () => {
    mixedPattern;
    expect(
      utils.applyMask('1', mixedPattern, placeholder, true, maskDefinitions),
    ).toBe('___-____');
    expect(
      utils.applyMask(
        '$234567',
        mixedPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('___-____');
    expect(
      utils.applyMask(
        'ABC$?45',
        mixedPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-____');

    expect(
      utils.applyMask('1', mixedPattern, placeholder, false, maskDefinitions),
    ).toBe('');
    expect(
      utils.applyMask(
        '$234567',
        mixedPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('');
    expect(
      utils.applyMask(
        'ABC$?45',
        mixedPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('ABC-');

    expect(
      utils.applyMask('a', numericPattern, placeholder, true, maskDefinitions),
    ).toBe('(___) ___-____');
    expect(
      utils.applyMask(
        '012345$678',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 345-____');

    expect(
      utils.applyMask('a', numericPattern, placeholder, false, maskDefinitions),
    ).toBe('(');
    expect(
      utils.applyMask(
        '012345$678',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 345-');
  });

  it('should apply mask to overflowing stripped values', () => {
    mixedPattern;
    expect(
      utils.applyMask(
        'ABC12345',
        mixedPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-1234');
    expect(
      utils.applyMask(
        'ABC1234*',
        mixedPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-1234');

    expect(
      utils.applyMask(
        '01234567891',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6789');
    expect(
      utils.applyMask(
        '0123456789+',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6789');
  });
});

describe('maskStrip', () => {
  it('should strip complete and correct formatted values', () => {
    mixedPattern;
    expect(
      utils.maskStrip('ABC-1234', mixedPattern, placeholder, maskDefinitions),
    ).toBe('ABC1234');

    expect(
      utils.maskStrip(
        '(012) 345-6789',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe('0123456789');
  });

  it('should strip incomplete and correct formatted values', () => {
    mixedPattern;
    expect(
      utils.maskStrip('', mixedPattern, placeholder, maskDefinitions),
    ).toBe('');
    expect(
      utils.maskStrip('___-____', mixedPattern, placeholder, maskDefinitions),
    ).toBe('');
    expect(
      utils.maskStrip('1__-____', mixedPattern, placeholder, maskDefinitions),
    ).toBe('');
    expect(
      utils.maskStrip('___-__1_', mixedPattern, placeholder, maskDefinitions),
    ).toBe('');
    expect(
      utils.maskStrip('ABC-12__', mixedPattern, placeholder, maskDefinitions),
    ).toBe('ABC12');
    expect(
      utils.maskStrip('ABC-12', mixedPattern, placeholder, maskDefinitions),
    ).toBe('ABC12');

    expect(
      utils.maskStrip('', numericPattern, placeholder, maskDefinitions),
    ).toBe('');
    expect(
      utils.maskStrip(
        '(___) ___-____',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe('');
    expect(
      utils.maskStrip(
        '(___) ___-__1_',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe('');
    expect(
      utils.maskStrip(
        '(A__) ___-____',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe('');
    expect(
      utils.maskStrip(
        '(012) 345-',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe('012345');
    expect(
      utils.maskStrip(
        '(012) 345-____',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe('012345');
  });

  it('should strip overflowing formatted values', () => {
    mixedPattern;
    expect(
      utils.maskStrip('ABC-12345', mixedPattern, placeholder, maskDefinitions),
    ).toBe('ABC1234');

    expect(
      utils.maskStrip(
        '(012) 345-67890',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe('0123456789');
  });
});

describe('inputReformat', () => {
  it('should handle user input for guided masks', () => {
    mixedPattern;
    expect(
      utils.inputReformat(
        '___-____',
        mixedPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('___-____');
    expect(
      utils.inputReformat(
        'A___-____',
        mixedPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('A__-____');
    expect(
      utils.inputReformat(
        'ABC1-____',
        mixedPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-1___');
    expect(
      utils.inputReformat(
        'ABC-1____',
        mixedPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-1___');
    expect(
      utils.inputReformat(
        'ABC-1234_',
        mixedPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-1234');

    expect(
      utils.inputReformat('', mixedPattern, placeholder, true, maskDefinitions),
    ).toBe('___-____');
    expect(
      utils.inputReformat(
        'A',
        mixedPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('A__-____');
    expect(
      utils.inputReformat(
        'ABC-1',
        mixedPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-1___');
    expect(
      utils.inputReformat(
        'ABC-1234_',
        mixedPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('ABC-1234');

    expect(
      utils.inputReformat(
        '(___) ___-____',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(___) ___-____');
    expect(
      utils.inputReformat(
        '0(___) ___-____',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(0__) ___-____');
    expect(
      utils.inputReformat(
        '(0___) ___-____',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(0__) ___-____');
    expect(
      utils.inputReformat(
        '(01__) ___-____',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(01_) ___-____');
    expect(
      utils.inputReformat(
        '(012_) ___-____',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) ___-____');
    expect(
      utils.inputReformat(
        '(0123) ___-____',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 3__-____');
    expect(
      utils.inputReformat(
        '(012)3 ___-____',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 3__-____');
    expect(
      utils.inputReformat(
        '(012) 3___-____',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 3__-____');
    expect(
      utils.inputReformat(
        '(012) 3456-____',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6___');
    expect(
      utils.inputReformat(
        '(012) 345-6789_',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6789');

    expect(
      utils.inputReformat(
        '',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(___) ___-____');
    expect(
      utils.inputReformat(
        '(0',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(0__) ___-____');
    expect(
      utils.inputReformat(
        '(0123) ___-____',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 3__-____');
    expect(
      utils.inputReformat(
        '(012)3 ___-____',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 3__-____');
    expect(
      utils.inputReformat(
        '(012) 3___-____',
        numericPattern,
        placeholder,
        true,
        maskDefinitions,
      ),
    ).toBe('(012) 3__-____');
  });

  it('should handle user input for non guided masks', () => {
    mixedPattern;
    expect(
      utils.inputReformat(
        '',
        mixedPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('');
    expect(
      utils.inputReformat(
        'A',
        mixedPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('A');
    expect(
      utils.inputReformat(
        'ABC',
        mixedPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('ABC-');
    expect(
      utils.inputReformat(
        'ABC1-',
        mixedPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('ABC-1');
    expect(
      utils.inputReformat(
        'ABC-1',
        mixedPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('ABC-1');
    expect(
      utils.inputReformat(
        'ABC-1234',
        mixedPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('ABC-1234');

    expect(
      utils.inputReformat(
        '(',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(');
    expect(
      utils.inputReformat(
        '0(',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(0');
    expect(
      utils.inputReformat(
        '(0',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(0');
    expect(
      utils.inputReformat(
        '(01',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(01');
    expect(
      utils.inputReformat(
        '(012',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) ');
    expect(
      utils.inputReformat(
        '(0123',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 3');
    expect(
      utils.inputReformat(
        '(012)3',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 3');
    expect(
      utils.inputReformat(
        '(012) 3',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 3');
    expect(
      utils.inputReformat(
        '(012) 345',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 345-');
    expect(
      utils.inputReformat(
        '(012) 3456-',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6');
    expect(
      utils.inputReformat(
        '(012) 345-6',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6');
    expect(
      utils.inputReformat(
        '(012) 345-6789',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6789');

    expect(
      utils.inputReformat(
        '',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(');
    expect(
      utils.inputReformat(
        '(0',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(0');
    expect(
      utils.inputReformat(
        '(0123)',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 3');
    expect(
      utils.inputReformat(
        '(012)3',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 3');
    expect(
      utils.inputReformat(
        '(012) 3',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 3');
    expect(
      utils.inputReformat(
        '(012) 3456-',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6');
    expect(
      utils.inputReformat(
        '(012) 345-6',
        numericPattern,
        placeholder,
        false,
        maskDefinitions,
      ),
    ).toBe('(012) 345-6');
  });
});

describe('isPatternComplete', () => {
  it('should return true when a pattern is completely and correctly filled', () => {
    mixedPattern;
    expect(
      utils.isPatternComplete('ABC-1234', mixedPattern, maskDefinitions),
    ).toBe(true);
    expect(
      utils.isPatternComplete(
        '(012) 345-6789',
        numericPattern,
        maskDefinitions,
      ),
    ).toBe(true);
  });

  it('should return false when a pattern is not completely and correctly filled', () => {
    mixedPattern;
    expect(utils.isPatternComplete('', mixedPattern, maskDefinitions)).toBe(
      false,
    );
    expect(
      utils.isPatternComplete('___-____', mixedPattern, maskDefinitions),
    ).toBe(false);
    expect(utils.isPatternComplete('ABC-', mixedPattern, maskDefinitions)).toBe(
      false,
    );
    expect(
      utils.isPatternComplete('ABC-____', mixedPattern, maskDefinitions),
    ).toBe(false);
    expect(
      utils.isPatternComplete('ABC-123', mixedPattern, maskDefinitions),
    ).toBe(false);
    expect(
      utils.isPatternComplete('ABC!1234', mixedPattern, maskDefinitions),
    ).toBe(false);

    expect(
      utils.isPatternComplete(
        '(0__) ___-____',
        numericPattern,
        maskDefinitions,
      ),
    ).toBe(false);
    expect(utils.isPatternComplete('(0', numericPattern, maskDefinitions)).toBe(
      false,
    );
    expect(
      utils.isPatternComplete(
        '(012] 345-6789',
        numericPattern,
        maskDefinitions,
      ),
    ).toBe(false);
  });
});

describe('validCaretPositions', () => {
  it('should return all valid caret positions for any pattern', () => {
    mixedPattern;
    // AAA-9999: all positions are valid
    expect(utils.validCaretPositions(mixedPattern, maskDefinitions)).toEqual([
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
    expect(utils.validCaretPositions(numericPattern, maskDefinitions)).toEqual([
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

    // |-|-AA-|=|-|=|-99=|=|: positions marked with pipe should be invalid
    // --AA-=-=-99==
    expect(
      utils.validCaretPositions(positionsPattern, maskDefinitions),
    ).toEqual([2, 3, 4, 9, 10, 11]);

    expect(utils.validCaretPositions()).toEqual([]);
    expect(utils.validCaretPositions('')).toEqual([]);
    expect(utils.validCaretPositions({})).toEqual([]);
  });
});

describe('firstUnfilledPosition', () => {
  it('should return the first unfilled position for any value', () => {
    mixedPattern;
    expect(
      utils.firstUnfilledPosition(
        '',
        mixedPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(0);
    expect(
      utils.firstUnfilledPosition(
        '___-____',
        mixedPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(0);
    expect(
      utils.firstUnfilledPosition(
        'A__-____',
        mixedPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(1);
    expect(
      utils.firstUnfilledPosition(
        'ABC-____',
        mixedPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(4);
    expect(
      utils.firstUnfilledPosition(
        'ABC-1234',
        mixedPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(8);

    expect(
      utils.firstUnfilledPosition(
        'A',
        mixedPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(1);
    expect(
      utils.firstUnfilledPosition(
        'ABC-',
        mixedPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(4);

    expect(
      utils.firstUnfilledPosition(
        '(___) ___-____',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(1);
    expect(
      utils.firstUnfilledPosition(
        '(0__) ___-____',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(2);
    expect(
      utils.firstUnfilledPosition(
        '(012) ___-____',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(6);
    expect(
      utils.firstUnfilledPosition(
        '(012) 345-____',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(10);
    expect(
      utils.firstUnfilledPosition(
        '(012) 345-6789',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(14);

    expect(
      utils.firstUnfilledPosition(
        '(012)',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(5);
    expect(
      utils.firstUnfilledPosition(
        '(012) ',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(6);
    expect(
      utils.firstUnfilledPosition(
        '(012) 345',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(9);
    expect(
      utils.firstUnfilledPosition(
        '(012) 345-',
        numericPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(10);

    expect(
      utils.firstUnfilledPosition(
        '',
        positionsPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(0);
    expect(
      utils.firstUnfilledPosition(
        'A_-=-=-__==',
        positionsPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(1);
    expect(
      utils.firstUnfilledPosition(
        'AA-=-=-__==',
        positionsPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(7);
    expect(
      utils.firstUnfilledPosition(
        '--AA-=-=-99==',
        positionsPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(11);

    expect(
      utils.firstUnfilledPosition(
        'A',
        positionsPattern,
        placeholder,
        maskDefinitions,
      ),
    ).toBe(1);
    expect(
      utils.firstUnfilledPosition(
        'AA',
        positionsPattern,
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

  describe('charMatchTest', () => {
    it('should return the RegExp that matches the char on mask definitions', () => {
      expect(utils.charMatchTest('B', defaultMaskDefinitions)).toBe('A');
      expect(utils.charMatchTest('b', defaultMaskDefinitions)).toBe('A');
      expect(utils.charMatchTest('0', defaultMaskDefinitions)).toBe('9');
    });

    it('should return undefined if char does not match any mask definition', () => {
      expect(utils.charMatchTest('_', defaultMaskDefinitions)).toBe(undefined);
      expect(utils.charMatchTest('-', defaultMaskDefinitions)).toBe(undefined);
      expect(utils.charMatchTest('?', defaultMaskDefinitions)).toBe(undefined);
      expect(utils.charMatchTest(' ', defaultMaskDefinitions)).toBe(undefined);
    });
  });
});
