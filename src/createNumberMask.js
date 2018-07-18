import { escapeRegExp, countOcurrences, numberToLocaleString } from './utils';

export default options => {
  const {
    prefix = '',
    suffix = '',
    decimalPlaces = 0,
    multiplier = 1,
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

    if (number === undefined || number === '') {
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

    // Apply the multiplier
    number *= 1 / multiplier;

    // Reformat the number
    number = numberToLocaleString(number, locale, decimalPlaces);

    return `${sign}${prefix}${number}${suffix}`;
  };

  const normalize = (updatedValue, previousValue) => {
    const escapedPrefix = escapeRegExp(prefix);
    const escapedSuffix = escapeRegExp(suffix);

    const prefixRegex = new RegExp(`^[-|+]? ?${escapedPrefix}`);
    const suffixRegex = new RegExp(`${escapedSuffix}$`);

    // Checks if we need to negate the value
    let negateMultiplier = 1;
    if (allowNegative) {
      const minusRegexp = /-/g;
      const power =
        countOcurrences(updatedValue, minusRegexp) -
        countOcurrences(prefix, minusRegexp) -
        countOcurrences(suffix, minusRegexp);
      negateMultiplier = (-1) ** power % 2;
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
      // Input value has no digits
      const emptyInput = digits === '';
      // Input value contains zeroes only
      const zeroInput = digits.replace(/0+/g, '') === '';
      // One character was removed for sure
      const characterIsRemoved = digits.length <= decimalPlaces;
      // The value entered before is undefined
      const previousValueIsEmpty = previousValue === undefined;

      if (
        emptyInput ||
        (!previousValueIsEmpty && characterIsRemoved && zeroInput)
      ) {
        return '';
      }
    }

    // Get the number out of digits
    let number = Number(digits) / 10 ** decimalPlaces * negateMultiplier;

    // Apply the multiplier
    number = Number((number * multiplier).toPrecision(10));

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
    const { target } = event;

    if (target) {
      if (event.persist) {
        event.persist();
      }

      // This timeout is needed to get updated values
      setTimeout(() => {
        const caretPos = target.value.length - suffix.length;
        event.target.setSelectionRange(caretPos, caretPos);
      });
    }
  };

  return {
    format: storeValue => format(storeValue),
    normalize: (updatedValue, previousValue) =>
      normalize(updatedValue, previousValue),
    onChange: event => manageCaretPosition(event),
    onFocus: event => manageCaretPosition(event),
    autoComplete: 'off',
  };
};
