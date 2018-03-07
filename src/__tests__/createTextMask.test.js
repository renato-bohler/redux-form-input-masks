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

    // Invalid insertions
    expect(mask.normalize('---ABC.___---__-_--', 'ABC')).toBe('ABC');
    expect(mask.normalize('---ABC,x__---__-_--', 'ABC')).toBe('ABC');
    expect(mask.normalize('---ABC.___---__-1--', 'ABC')).toBe('ABC');

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

    const updatedValue = mask.normalize('---A__.___---__-_--', 'A');

    expect(onChange).not.toBeCalled();
  });

  it('should call onCompletePattern when there the mask is filled', () => {
    const onCompletePattern = jest.fn();

    const mask = createTextMask({
      pattern: complexPattern,
      onCompletePattern,
    });

    const updatedValue = mask.normalize('---ABC.xyz---Ul-1_--', 'ABCxyzUl');

    expect(onCompletePattern).toBeCalledWith(updatedValue);
  });

  it('should not call onCompletePattern when there is not a change on the value', () => {
    const onCompletePattern = jest.fn();

    const mask = createTextMask({
      pattern: complexPattern,
      onCompletePattern,
    });

    const updatedValue = mask.normalize('---ABC.xyz---Ul-1_--', 'ABCxyzUl1');

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
});
