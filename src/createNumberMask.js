import { escapeRegExp } from './utils';

export default (
  prefix = '',
  suffix = '',
  decimalPlaces = 2,
  stringValue = false,
  locale = 'browser',
  onChange,
) => {
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
      number = parseInt(number.replace(/\D/g, ''), 10) / 10 ** decimalPlaces;
    }

    // reformat the number
    number = numberToLocaleString(number);

    return `${prefix}${number}${suffix}`;
  };

  const normalize = updatedValue => {
    const escapedPrefix = escapeRegExp(prefix);
    const escapedSuffix = escapeRegExp(suffix);

    const prefixRegex = new RegExp(`^${escapedPrefix}`);
    const suffixRegex = new RegExp(`${escapedSuffix}$`);

    if (!prefixRegex.test(updatedValue) || !suffixRegex.test(updatedValue)) {
      return;
    }

    // extract the digits out of updatedValue
    let digits = updatedValue.replace(prefixRegex, '');
    if (suffix) {
      digits = digits.replace(suffixRegex, '');
    }
    // removes non-digits and leading zeros
    digits = digits.replace(/\D/g, '').replace(/\b0+/g, '');

    // get the number out of digits
    let number = Number(digits) / 10 ** decimalPlaces;
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
      setTimeout(() => {
        const caretPos = event.target.value.length - suffix.length;
        event.target.setSelectionRange(caretPos, caretPos);
      });
    }
  };

  return {
    format: v => format(v),
    normalize: v => normalize(v),
    onKeyDown: event => manageCaretPosition(event),
    onMouseDown: event => manageCaretPosition(event),
    onFocus: event => manageCaretPosition(event),
    onClick: event => manageCaretPosition(event),
  };
};
