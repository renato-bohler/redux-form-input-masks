import { escapeRegExp, countOcurrences, numberToLocaleString } from './utils';

export default options => {
  const {
    prefix = '',
    suffix = '',
    decimalPlaces = 0,
    stringValue = false,
    allowEmpty = false,
    allowNegative = false,
    showPlusSign = false,
    spaceAfterSign = false,
    locale,
    onChange,
  } =
    options || {};

  if (decimalPlaces > 10) {
    throw new Error(
      "The maximum value for createNumberMask's option `decimalPlaces` is 10.",
    );
  }

  const format = storeValue => {
    let number = storeValue;
    if (number === undefined) {
      if (allowEmpty) {
        return '';
      }
      number = 0;
    } else if (typeof number !== 'number') {
      number = Number(number);
    }

    // Checks for the sign
    let sign = showPlusSign ? '+' : '';
    if (number < 0) {
      number *= -1;
      if (allowNegative) {
        sign = '-';
      }
    }
    if (sign && spaceAfterSign) {
      sign = `${sign} `;
    }

    // Reformat the number
    number = numberToLocaleString(number, locale, decimalPlaces);

    return `${sign}${prefix}${number}${suffix}`;
  };

  const normalize = (updatedValue, previousValue) => {
    const escapedPrefix = escapeRegExp(prefix);
    const escapedSuffix = escapeRegExp(suffix);

    const prefixRegex = new RegExp(`^[-|+]? ?${escapedPrefix}`);
    const suffixRegex = new RegExp(`${escapedSuffix}$`);

    // If the prefix or the suffix have been modified, do nothing
    if (
      previousValue &&
      (!prefixRegex.test(updatedValue) || !suffixRegex.test(updatedValue))
    ) {
      return previousValue;
    }

    // Checks if we need to negate the value
    let multiplier = 1;
    if (allowNegative) {
      const minusRegexp = /-/g;
      const power =
        countOcurrences(updatedValue, minusRegexp) -
        countOcurrences(prefix, minusRegexp) -
        countOcurrences(suffix, minusRegexp);
      multiplier = (-1) ** power % 2;
    }

    // Extracting the digits out of updatedValue
    let digits = updatedValue;
    // Removes the prefix
    if (prefix) {
      digits = digits.replace(prefixRegex, '');
    }
    // Removes the suffix
    if (suffix) {
      digits = digits.replace(suffixRegex, '');
    }
    // Removes non-digits
    digits = digits.replace(/\D/g, '');

    if (allowEmpty) {
      // input value has no digital values
      const emptyInput = digits === '';
      // input value contains zeroes only
      const zeroInput = digits.replace(/0+/g, '') === '';
      // one character was removed for sure
      const characterIsRemoved = digits.length <= decimalPlaces;
      // the value entered before is undefined
      const previousValueIsEmpty = previousValue === undefined;

      if (
        emptyInput ||
        (!previousValueIsEmpty && characterIsRemoved && zeroInput)
      ) {
        return '';
      }
    }

    // Get the number out of digits
    let number = Number(digits) / 10 ** decimalPlaces * multiplier;
    if (stringValue) {
      number = number.toString();
    }

    const hasValueChanged = number !== previousValue;

    if (onChange && hasValueChanged) {
      onChange(number);
    }

    return number;
  };

  const manageCaretPosition = event => {
    if (event.target) {
      if (event.persist) {
        event.persist();
      }

      // This timeout is needed to get updated values
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
    onChange: event => manageCaretPosition(event),
    onMouseDown: event => manageCaretPosition(event),
    onFocus: event => manageCaretPosition(event),
    onClick: event => manageCaretPosition(event),
    autoComplete: 'off',
  };
};
