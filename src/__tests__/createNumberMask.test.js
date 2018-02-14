import { createNumberMask } from '../index';

describe('Number mask', () => {
  it('should add the prefix to formatted input', () => {
    const prefix = 'prefix 1@,.';
    const number = 90;

    const mask = createNumberMask({ prefix });
    expect(mask.format(number)).toBe(`${prefix}${number.toLocaleString()}`);
  });

  it('should add the suffix to formatted input', () => {
    const suffix = '1@,. suffix';
    const number = 90;

    const mask = createNumberMask({ suffix });
    expect(mask.format(number)).toBe(`${number.toLocaleString()}${suffix}`);
  });

  it('should have the correct amount of decimal places', () => {
    const prefix = 'p';
    const suffix = 's';
    const decimalPlaces = 5;
    const number = 1234.56789;

    const mask = createNumberMask({ prefix, suffix, decimalPlaces });
    expect(mask.format(number)).toBe(
      `${prefix}${number.toLocaleString('browser', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })}${suffix}`,
    );
  });

  it('should be formatting the number according to the locale', () => {
    // The default node build includes only en-US locale.
    const locale = 'en-US';
    const decimalPlaces = 1;
    const number = 1000;

    const mask = createNumberMask({ decimalPlaces, locale });
    expect(mask.format(number)).toBe('1,000.0');
  });
});
