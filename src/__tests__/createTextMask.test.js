import { createTextMask } from '../index';
import defaultMaskDefinitions from '../defaultMaskDefinitions';

const complexPattern = '---AAA.aaa---Ul-9--';

describe('Text mask', () => {
  it('should be able to format non guided and non stripped masks', () => {
    const mask = createTextMask({
      pattern: complexPattern,
      guide: false,
      stripMask: false,
    });

    expect(mask.format('')).toBe('---');
    expect(mask.format('---A')).toBe('---A');
    expect(mask.format('---ABC.xyz---Ul-1--')).toBe('---ABC.xyz---Ul-1--');
  });

  it('should be able to format non guided and stripped masks', () => {
    const mask = createTextMask({
      pattern: complexPattern,
      guide: false,
      // stripMask: true is default
    });

    expect(mask.format('')).toBe('---');
    expect(mask.format('A')).toBe('---A');
    expect(mask.format('ABCxyzUl1')).toBe('---ABC.xyz---Ul-1--');
  });

  it('should be able to format guided and non stripped masks', () => {
    const mask = createTextMask({
      pattern: complexPattern,
      // guide: true is default
      stripMask: false,
    });

    expect(mask.format('')).toBe('---___.___---__-_--');
    expect(mask.format('---A__.___---__-_--')).toBe('---A__.___---__-_--');
    expect(mask.format('---ABC.xyz---Ul-1--')).toBe('---ABC.xyz---Ul-1--');
  });

  it('should be able to format guided and stripped masks', () => {
    const mask = createTextMask({
      pattern: complexPattern,
      // guide: true is default
      // stripMask: true is default
    });

    expect(mask.format('')).toBe('---___.___---__-_--');
    expect(mask.format('A')).toBe('---A__.___---__-_--');
    expect(mask.format('ABCxyzUl1')).toBe('---ABC.xyz---Ul-1--');
  });

  it('should be able to handle input for non guided and non stripped masks', () => {
    const mask = createTextMask({
      pattern: complexPattern,
      guide: false,
      stripMask: false,
    });

    // Insertions
    expect(mask.normalize('', '')).toBe('---');
    expect(mask.normalize('---A', '---')).toBe('---A');
    expect(mask.normalize('---ABC', '---AB')).toBe('---ABC.');
    expect(mask.normalize('---ABCx.', '---ABC.')).toBe('---ABC.x');
    expect(mask.normalize('---ABC.xyz', '---ABC.xy')).toBe('---ABC.xyz---');
    expect(mask.normalize('---ABC.xyz---Ul-1', '---ABC.xyz---Ul-')).toBe(
      '---ABC.xyz---Ul-1--',
    );

    // Remotions
    expect(mask.normalize('---ABC.xyz---Ul---', '---ABC.xyz---Ul-1--')).toBe(
      '---ABC.xyz---Ul-',
    );
    expect(mask.normalize('---ABC.xz---Ul-1--', '---ABC.xyz---Ul-1--')).toBe(
      '---ABC.xzu---',
    );
  });

  it('should be able to handle input for non guided and stripped masks', () => {
    const mask = createTextMask({
      pattern: complexPattern,
      guide: false,
      // stripMask: true is default
    });

    // Insertions
    expect(mask.normalize('', '')).toBe('');
    expect(mask.normalize('---A', '---')).toBe('A');
    expect(mask.normalize('---ABC', 'AB')).toBe('ABC');
    expect(mask.normalize('---ABCx.', 'ABC')).toBe('ABCx');
    expect(mask.normalize('---ABC.xyz', 'ABCxy')).toBe('ABCxyz');
    expect(mask.normalize('---ABC.xyz---Ul-1', 'ABCxyzUl')).toBe('ABCxyzUl1');

    // Remotions
    expect(mask.normalize('---ABC.xyz---Ul---', 'ABCxyzUl1')).toBe('ABCxyzUl');
    expect(mask.normalize('---ABC.xz---Ul-1--', 'ABCxyzUl1')).toBe('ABCxzu');
  });

  it('should be able to handle input for guided and non stripped masks', () => {
    const mask = createTextMask({
      pattern: complexPattern,
      // guide: true is default
      stripMask: false,
    });

    // Insertions
    expect(mask.normalize('', '')).toBe('---___.___---__-_--');
    expect(mask.normalize('---A___.___---__-_--', '---___.___---__-_--')).toBe(
      '---A__.___---__-_--',
    );
    expect(mask.normalize('---ABC_.___---__-_--', '---AB_.___---__-_--')).toBe(
      '---ABC.___---__-_--',
    );
    expect(mask.normalize('---ABCx.___---__-_--', '---ABC.___---__-_--')).toBe(
      '---ABC.x__---__-_--',
    );
    expect(mask.normalize('---ABC.x___---__-_--', '---ABC.___---__-_--')).toBe(
      '---ABC.x__---__-_--',
    );
    expect(mask.normalize('---ABC.xyz_---__-_--', '---ABC.xy_---__-_--')).toBe(
      '---ABC.xyz---__-_--',
    );
    expect(mask.normalize('---ABC.xy_z---__-_--', '---ABC.xy_---__-_--')).toBe(
      '---ABC.xyz---__-_--',
    );
    expect(mask.normalize('---ABC.xyz---Ul-1--', '---ABC.xyz---Ul-1--')).toBe(
      '---ABC.xyz---Ul-1--',
    );

    // Remotions
    expect(mask.normalize('---ABC.xyz---Ul---', '---ABC.xyz---Ul-1--')).toBe(
      '---ABC.xyz---Ul-_--',
    );
    expect(mask.normalize('---ABC.xz---Ul-1--', '---ABC.xyz---Ul-1--')).toBe(
      '---ABC.xzu---__-_--',
    );
  });

  it('should be able to handle input for guided and stripped masks', () => {
    const mask = createTextMask({
      pattern: complexPattern,
      // guide: true is default
      // stripMask: true is default
    });

    // Insertions
    expect(mask.normalize('', '')).toBe('');
    expect(mask.normalize('---A___.___---__-_--', '---___.___---__-_--')).toBe(
      'A',
    );
    expect(mask.normalize('---ABC_.___---__-_--', '---AB_.___---__-_--')).toBe(
      'ABC',
    );
    expect(mask.normalize('---ABCx.___---__-_--', '---ABC.___---__-_--')).toBe(
      'ABCx',
    );
    expect(mask.normalize('---ABC.x___---__-_--', '---ABC.___---__-_--')).toBe(
      'ABCx',
    );
    expect(mask.normalize('---ABC.xyz_---__-_--', '---ABC.xy_---__-_--')).toBe(
      'ABCxyz',
    );
    expect(mask.normalize('---ABC.xy_z---__-_--', '---ABC.xy_---__-_--')).toBe(
      'ABCxyz',
    );
    expect(mask.normalize('---ABC.xyz---Ul-1--', '---ABC.xyz---Ul-1--')).toBe(
      'ABCxyzUl1',
    );

    // Remotions
    expect(mask.normalize('---ABC.xyz---Ul---', '---ABC.xyz---Ul-1--')).toBe(
      'ABCxyzUl',
    );
    expect(mask.normalize('---ABC.xz---Ul-1--', '---ABC.xyz---Ul-1--')).toBe(
      'ABCxzu',
    );
  });

  it('should not update the stored value if the input is invalid', () => {
    const mask = createTextMask({
      pattern: complexPattern,
    });

    const notStrippedMask = createTextMask({
      pattern: complexPattern,
      stripMask: false,
    });

    // Invalid insertions
    expect(mask.normalize('---ABC.___---__-_--', 'ABC')).toBe('ABC');
    expect(mask.normalize('---ABC,x__---__-_--', 'ABC')).toBe('ABC');
    expect(mask.normalize('---ABC.___---__-1--', 'ABC')).toBe('ABC');
    expect(
      notStrippedMask.normalize('---___.___---__-_--', '---9__.___---__-_--'),
    ).toBe('---___.___---__-_--');

    // Mask remotions
    expect(mask.normalize('--ABC.1__---__-_--', 'ABC')).toBe('ABC');
    expect(mask.normalize('---ABC1__---__-_--', 'ABC')).toBe('ABC');
  });

  it('should call onChange when there is a change on the value', () => {
    const onChange = jest.fn();

    const mask = createTextMask({
      pattern: complexPattern,
      onChange,
    });

    const updatedValue = mask.normalize('---A___.___---__-_--', '');

    expect(onChange).toBeCalledWith(updatedValue);
  });

  it('should not call onChange when there is not a change on the value', () => {
    const onChange = jest.fn();

    const mask = createTextMask({
      pattern: complexPattern,
      onChange,
    });

    const notStrippedMask = createTextMask({
      pattern: complexPattern,
      stripMask: false,
      onChange,
    });

    mask.normalize('---ABC.xyz---Ul-1_--', 'ABCxyzUl1');
    mask.normalize('---A__.___---__-_--', 'A');
    mask.normalize('---___.___---__-_--', undefined);

    notStrippedMask.normalize('---ABC.xyz---Ul-1_--', '---ABC.xyz---Ul-1--');
    notStrippedMask.normalize('---A___.___---__-_--', '---A__.___---__-_--');
    notStrippedMask.normalize('---___.___---__-_--', '---___.___---__-_--');

    expect(onChange).not.toBeCalled();
  });

  it('should call onCompletePattern when the mask is filled', () => {
    // Needed because we use setTimeout on onCompletePattern
    jest.useFakeTimers();

    const onCompletePattern = jest.fn();

    const mask = createTextMask({
      pattern: complexPattern,
      onCompletePattern,
    });

    const updatedValue = mask.normalize('---ABC.xyz---Ul-1_--', 'ABCxyzUl');

    jest.runAllTimers();

    expect(onCompletePattern).toBeCalledWith(updatedValue);
  });

  it('should not call onCompletePattern when there is not a change on the value', () => {
    // Needed because we use setTimeout on onCompletePattern
    jest.useFakeTimers();

    const onCompletePattern = jest.fn();

    const mask = createTextMask({
      pattern: complexPattern,
      onCompletePattern,
    });

    const notStrippedMask = createTextMask({
      pattern: complexPattern,
      stripMask: false,
      onCompletePattern,
    });

    mask.normalize('---ABC.xyz---Ul-1_--', 'ABCxyzUl1');

    notStrippedMask.normalize('---ABC.xyz---Ul-1_--', '---ABC.xyz---Ul-1--');

    jest.runAllTimers();

    expect(onCompletePattern).not.toBeCalled();
  });

  it('should apply transform to the inputted characters', () => {
    // Only the first three digits should be incremented
    const mask = createTextMask({
      pattern: '000-999',
      maskDefinitions: {
        9: {
          regExp: /[0-9]/,
        },
        0: {
          regExp: /[0-9]/,
          transform: char => (Number(char) === 9 ? 0 : Number(char) + 1),
        },
      },
    });

    // User inputs 7 and it is transformed to 8
    expect(mask.normalize('7___-___', '___-___')).toBe('8');
    // User inputs 8 and it is transformed to 9
    expect(mask.normalize('88__-___', '8__-___')).toBe('89');
    // User inputs 9 and it is transformed to 0
    expect(mask.normalize('899_-___', '89_-___')).toBe('890');
    // After the dash, transform shouldn't be applied
    expect(mask.normalize('890-1___', '890-___')).toBe('8901');
    expect(mask.normalize('890-12__', '890-1__')).toBe('89012');
    expect(mask.normalize('890-123_', '890-12_')).toBe('890123');
  });

  it('should be able to handle custom placeholders', () => {
    const mask = createTextMask({
      pattern: 'AA (999) 999-9999',
      placeholder: '?',
      stripMask: false,
    });

    expect(mask.format('')).toBe('?? (???) ???-????');
    expect(mask.normalize('', '')).toBe('?? (???) ???-????');
  });

  describe('Validations', () => {
    it('should validate if the pattern was informed', () => {
      expect(() => createTextMask({})).toThrowError(
        'The key `pattern` is required for createTextMask. You probably forgot to add it to your options.',
      );
    });

    it('should validate if the pattern is valid', () => {
      expect(() => createTextMask({ pattern: '---' })).toThrowError(
        'The pattern `---` passed for createTextMask is not valid.',
      );
    });

    it("should validate the placeholder's length", () => {
      expect(() =>
        createTextMask({ pattern: complexPattern, placeholder: '' }),
      ).toThrowError(
        'The key `placeholder` should have a single character as a value.',
      );

      expect(() =>
        createTextMask({ pattern: complexPattern, placeholder: '--' }),
      ).toThrowError(
        'The key `placeholder` should have a single character as a value.',
      );
    });

    it('should validate if the placeholder matches any mask definition', () => {
      expect(() =>
        createTextMask({ pattern: 'AAA', placeholder: 'B' }),
      ).toThrowError(
        `The placeholder \`B\` matches the mask definition` +
          `\`A\`. The mask created using \`createTextMask\`` +
          'is therefore invalid.',
      );

      expect(() =>
        createTextMask({ pattern: 'AAA', placeholder: 'b' }),
      ).toThrowError(
        `The placeholder \`b\` matches the mask definition` +
          `\`A\`. The mask created using \`createTextMask\`` +
          'is therefore invalid.',
      );

      expect(() =>
        createTextMask({ pattern: '999', placeholder: '8' }),
      ).toThrowError(
        `The placeholder \`8\` matches the mask definition` +
          `\`9\`. The mask created using \`createTextMask\`` +
          'is therefore invalid.',
      );
    });
  });

  describe('Event handlers', () => {
    it('should handle the caret position upon insertion', () => {
      // Needed because we use setTimeout on our manageCaretPosition function
      jest.useFakeTimers();

      const valueBefore = '---ABC.xyz_---__-_--';
      const valueAfter = '---ABC.xyz---__-_--';
      const correctCaretPosition = 13;

      // Mocked events
      const event = {
        type: 'change',
        persist: jest.fn(),
        target: {
          value: valueBefore,
          setSelectionRange: jest.fn(),
        },
      };

      const mask = createTextMask({ pattern: complexPattern });

      // Simulate change event
      mask.onChange(event);

      // Simulate value updating
      event.target.value = valueAfter;

      jest.runAllTimers();

      expect(event.target.setSelectionRange).toHaveBeenLastCalledWith(
        correctCaretPosition,
        correctCaretPosition,
      );

      expect(event.target.setSelectionRange).toHaveBeenCalledTimes(1);
      expect(event.persist).toHaveBeenCalledTimes(1);
    });

    it('should handle the caret position upon remotion', () => {
      // Needed because we use setTimeout on our manageCaretPosition function
      jest.useFakeTimers();

      const valueBefore = '---ABC.xyz---U_-_--';
      const valueAfter = '---ABC.xyz---__-_--';
      const correctCaretPosition = 13;

      // Mocked events
      const event = {
        type: 'change',
        persist: jest.fn(),
        target: {
          value: valueBefore,
          setSelectionRange: jest.fn(),
        },
      };

      const mask = createTextMask({ pattern: complexPattern });

      // Simulate change event
      mask.onChange(event);

      // Simulate value updating
      event.target.value = valueAfter;

      jest.runAllTimers();

      expect(event.target.setSelectionRange).toHaveBeenLastCalledWith(
        correctCaretPosition,
        correctCaretPosition,
      );

      expect(event.target.setSelectionRange).toHaveBeenCalledTimes(1);
      expect(event.persist).toHaveBeenCalledTimes(1);
    });

    it('should handle the caret position upon mask remotion', () => {
      /** Example (pipe represents the caret position):
       * ---ABC.xyz---|__-_--
       * [user presses backspace]
       * ---ABC.xyz|---__-_--
       */

      // Needed because we use setTimeout on our manageCaretPosition function
      jest.useFakeTimers();

      const valueBefore = '---ABC.xyz--__-_--';
      const caretPositionBefore = 12;
      const valueAfter = '---ABC.xyz---__-_--';
      const correctCaretPosition = 10;

      // Mocked events
      const event = {
        type: 'change',
        persist: jest.fn(),
        target: {
          value: valueBefore,
          selectionStart: caretPositionBefore,
          selectionEnd: caretPositionBefore,
          setSelectionRange: jest.fn(),
        },
      };

      const mask = createTextMask({ pattern: complexPattern });

      // Simulate change event
      mask.onChange(event);

      // Simulate value and caret position updating
      event.target.value = valueAfter;

      jest.runAllTimers();

      expect(event.target.setSelectionRange).toHaveBeenLastCalledWith(
        correctCaretPosition,
        correctCaretPosition,
      );

      expect(event.target.setSelectionRange).toHaveBeenCalledTimes(1);
      expect(event.persist).toHaveBeenCalledTimes(1);
    });

    it('should handle the caret position upon focus', () => {
      // Needed because we use setTimeout on our manageCaretPosition function
      jest.useFakeTimers();

      const value = '---ABC.xyz---Ul-_--';
      const correctCaretPosition = 16;

      // Mocked events
      const event = {
        type: 'focus',
        persist: jest.fn(),
        target: {
          value,
          setSelectionRange: jest.fn(),
        },
      };

      const mask = createTextMask({ pattern: complexPattern });

      // Simulate focus event
      mask.onFocus(event);

      jest.runAllTimers();

      expect(event.target.setSelectionRange).toHaveBeenLastCalledWith(
        correctCaretPosition,
        correctCaretPosition,
      );

      expect(event.target.setSelectionRange).toHaveBeenCalledTimes(1);
      expect(event.persist).toHaveBeenCalledTimes(1);
    });

    it('should handle the caret position upon valid click', () => {
      // Needed because we use setTimeout on our manageCaretPosition function
      jest.useFakeTimers();

      const value = '---ABC.xyz---Ul-_--';
      const clickPosition = 5;

      // Mocked events
      const event = {
        type: 'click',
        persist: jest.fn(),
        preventDefault: jest.fn(),
        target: {
          value,
          selectionStart: clickPosition,
          selectionEnd: clickPosition,
        },
      };

      const mask = createTextMask({ pattern: complexPattern });

      // Simulate click event
      mask.onClick(event);

      jest.runAllTimers();

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(event.persist).toHaveBeenCalledTimes(1);
    });

    it('should handle the caret position upon invalid click', () => {
      // Needed because we use setTimeout on our manageCaretPosition function
      jest.useFakeTimers();

      const value = '---ABC.xyz---Ul-_--';
      const clickPosition = 1;
      const correctCaretPosition = 16;

      // Mocked events
      const event = {
        type: 'click',
        persist: jest.fn(),
        target: {
          value,
          selectionStart: clickPosition,
          selectionEnd: clickPosition,
          setSelectionRange: jest.fn(),
        },
      };

      const mask = createTextMask({ pattern: complexPattern });

      // Simulate click event
      mask.onClick(event);

      jest.runAllTimers();

      expect(event.target.setSelectionRange).toHaveBeenLastCalledWith(
        correctCaretPosition,
        correctCaretPosition,
      );

      expect(event.target.setSelectionRange).toHaveBeenCalledTimes(1);
      expect(event.persist).toHaveBeenCalledTimes(1);
    });

    it('should not handle the caret position upon selection', () => {
      // Needed because we use setTimeout on our manageCaretPosition function
      jest.useFakeTimers();

      const value = '---ABC.xyz---Ul-_--';
      const selectionStart = 0;
      const selectionEnd = 19;

      // Mocked events
      const event = {
        type: 'click',
        preventDefault: jest.fn(),
        persist: jest.fn(),
        target: {
          value,
          selectionStart,
          selectionEnd,
          setSelectionRange: jest.fn(),
        },
      };

      const mask = createTextMask({ pattern: complexPattern });

      // Simulate click (selection) event
      mask.onClick(event);

      jest.runAllTimers();

      expect(event.target.setSelectionRange).not.toBeCalled();
      expect(event.preventDefault).not.toBeCalled();

      expect(event.persist).toHaveBeenCalledTimes(1);
    });

    it('should handle the caret position upon arrow left keypress', () => {
      // Needed because we use setTimeout on our manageCaretPosition function
      jest.useFakeTimers();

      const value = '---ABC.xyz---Ul-1--';
      const caretPositionBefore = 13;
      const caretPositionAfter = 12;
      const correctCaretPosition = 10;

      // Mocked events
      const event = {
        type: 'keydown',
        key: 'ArrowLeft',
        persist: jest.fn(),
        target: {
          value,
          selectionStart: caretPositionBefore,
          selectionEnd: caretPositionBefore,
          setSelectionRange: jest.fn(),
        },
      };

      const mask = createTextMask({ pattern: complexPattern });

      // Simulate keydown event
      mask.onKeyDown(event);

      // Simulate caret position updating
      event.target.selectionStart = caretPositionAfter;
      event.target.selectionEnd = caretPositionAfter;

      jest.runAllTimers();

      expect(event.target.setSelectionRange).toHaveBeenLastCalledWith(
        correctCaretPosition,
        correctCaretPosition,
      );

      expect(event.target.setSelectionRange).toHaveBeenCalledTimes(1);
      expect(event.persist).toHaveBeenCalledTimes(1);
    });

    it('should handle the caret position upon arrow right keypress', () => {
      // Needed because we use setTimeout on our manageCaretPosition function
      jest.useFakeTimers();

      const value = '---ABC.xyz---Ul-1--';
      const caretPositionBefore = 10;
      const caretPositionAfter = 11;
      const correctCaretPosition = 13;

      // Mocked events
      const event = {
        type: 'keydown',
        key: 'ArrowRight',
        persist: jest.fn(),
        target: {
          value,
          selectionStart: caretPositionBefore,
          selectionEnd: caretPositionBefore,
          setSelectionRange: jest.fn(),
        },
      };

      const mask = createTextMask({ pattern: complexPattern });

      // Simulate keydown event
      mask.onKeyDown(event);

      // Simulate caret position updating
      event.target.selectionStart = caretPositionAfter;
      event.target.selectionEnd = caretPositionAfter;

      jest.runAllTimers();

      expect(event.target.setSelectionRange).toHaveBeenLastCalledWith(
        correctCaretPosition,
        correctCaretPosition,
      );

      expect(event.target.setSelectionRange).toHaveBeenCalledTimes(1);
      expect(event.persist).toHaveBeenCalledTimes(1);
    });

    it('should handle the caret position upon arrow left keypress at the first inputtable position', () => {
      // Needed because we use setTimeout on our manageCaretPosition function
      jest.useFakeTimers();

      const value = '---ABC.xyz---Ul-1--';
      const caretPositionBefore = 3;
      const caretPositionAfter = 2;
      const correctCaretPosition = 3;

      // Mocked events
      const event = {
        type: 'keydown',
        key: 'ArrowLeft',
        persist: jest.fn(),
        target: {
          value,
          selectionStart: caretPositionBefore,
          selectionEnd: caretPositionBefore,
          setSelectionRange: jest.fn(),
        },
      };

      const mask = createTextMask({ pattern: complexPattern });

      // Simulate keydown event
      mask.onKeyDown(event);

      // Simulate caret position updating
      event.target.selectionStart = caretPositionAfter;
      event.target.selectionEnd = caretPositionAfter;

      jest.runAllTimers();

      expect(event.target.setSelectionRange).toHaveBeenLastCalledWith(
        correctCaretPosition,
        correctCaretPosition,
      );

      expect(event.target.setSelectionRange).toHaveBeenCalledTimes(1);
      expect(event.persist).toHaveBeenCalledTimes(1);
    });

    it('should not control any keypress other than ArrowLeft and ArrowRight', () => {
      // Needed because we use setTimeout on our manageCaretPosition function
      jest.useFakeTimers();

      const value = '---ABC.xyz---Ul-1--';

      // Mocked events
      const event = {
        type: 'keydown',
        key: 'any',
        target: {
          value,
          setSelectionRange: jest.fn(),
        },
      };

      const mask = createTextMask({ pattern: complexPattern });

      // Simulate keydown event
      mask.onKeyDown(event);

      expect(event.target.setSelectionRange).not.toBeCalled();
    });

    it('should handle the caret position upon arrow right keypress at the last inputtable position', () => {
      // Needed because we use setTimeout on our manageCaretPosition function
      jest.useFakeTimers();

      const value = '---ABC.xyz---Ul-1--';
      const caretPositionBefore = 17;
      const caretPositionAfter = 18;
      const correctCaretPosition = 17;

      // Mocked events
      const event = {
        type: 'keydown',
        key: 'ArrowRight',
        persist: jest.fn(),
        target: {
          value,
          selectionStart: caretPositionBefore,
          selectionEnd: caretPositionBefore,
          setSelectionRange: jest.fn(),
        },
      };

      const mask = createTextMask({ pattern: complexPattern });

      // Simulate keydown event
      mask.onKeyDown(event);

      // Simulate caret position updating
      event.target.selectionStart = caretPositionAfter;
      event.target.selectionEnd = caretPositionAfter;

      jest.runAllTimers();

      expect(event.target.setSelectionRange).toHaveBeenLastCalledWith(
        correctCaretPosition,
        correctCaretPosition,
      );

      expect(event.target.setSelectionRange).toHaveBeenCalledTimes(1);
      expect(event.persist).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if the event does not have a target', () => {
      const mask = createTextMask({ pattern: complexPattern });

      // These are used just to cover the else statements
      mask.onChange({});
    });
  });
});
