import { escapeRegExp, countOcurrences } from './utils';

export default options => {
  const {
    prefix = '',
    suffix = '',
    decimalPlaces = 0,
    stringValue = false,
    allowNegative = false,
    showPlusSign = false,
    locale = 'browser',
    onChange,
  } =
    options || {};

  const numberToLocaleString = number =>
    number.toLocaleString(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });

  const format = storeValue => {
    let number = storeValue;
    if (!number) {
      number = 0;
    } else if (typeof number !== 'number') {
      number = Number(number);
    }

    // checks for the sign
    let sign = showPlusSign ? '+' : '';
    if (number < 0) {
      number *= -1;
      if (allowNegative) {
        sign = '-';
      }
    }

    // reformat the number
    number = numberToLocaleString(number);

    return `${sign}${prefix}${number}${suffix}`;
  };

  const normalize = (updatedValue, previousValue) => {
    const escapedPrefix = escapeRegExp(prefix);
    const escapedSuffix = escapeRegExp(suffix);

    const prefixRegex = new RegExp(`^[-|+]?${escapedPrefix}`);
    const suffixRegex = new RegExp(`${escapedSuffix}$`);

    // if the prefix or the suffix have been modified, do nothing
    if (!prefixRegex.test(updatedValue) || !suffixRegex.test(updatedValue)) {
      return previousValue;
    }

    // checks if we need to negate the value
    let multiplier = 1;
    if (allowNegative) {
      const minusRegexp = /-/g;
      const power =
        countOcurrences(updatedValue, minusRegexp) -
        countOcurrences(prefix, minusRegexp) -
        countOcurrences(suffix, minusRegexp);
      multiplier = (-1) ** power % 2;
    }

    // extracting the digits out of updatedValue
    let digits = updatedValue;
    // removes the prefix
    if (prefix) {
      digits = digits.replace(prefixRegex, '');
    }
    // removes the suffix
    if (suffix) {
      digits = digits.replace(suffixRegex, '');
    }
    // removes non-digits and leading zeros
    digits = digits.replace(/\D/g, '').replace(/\b0+/g, '');

    // get the number out of digits
    let number = Number(digits) / 10 ** decimalPlaces * multiplier;
    if (stringValue) {
      number = number.toString();
    }

    if (onChange) {
      onChange(number);
    }

    return number;
  };

  const manageCaretPosition = event => {
    if (event.target) {
      if (event.persist) {
        event.persist();
      }
      // this timeout is needed to manage the caret position after onKeyDown
      setTimeout(() => {
        const caretPos = event.target.value.length - suffix.length;
        event.target.setSelectionRange(caretPos, caretPos);
      });
    }
  };

  return {
    format: storeValue => format(storeValue),
    normalize: (updatedValue, previousValue) =>
      normalize(updatedValue, previousValue),
    onKeyDown: event => manageCaretPosition(event),
    onMouseDown: event => manageCaretPosition(event),
    onFocus: event => manageCaretPosition(event),
    onClick: event => manageCaretPosition(event),
    autoComplete: 'off',
  };
};
