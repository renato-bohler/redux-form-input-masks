// general use
/**
 * This function should escape every special RegExp characters
 */
const escapeRegExp = string =>
  string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

// createNumberMask.js
/**
 * This function should return the amount of occurrences of a given RegExp on a
 * given string
 */
const countOcurrences = (string, regexp) => (string.match(regexp) || []).length;

// createStringMask.js
/**
 * This function should simply return the mask definition for a given pattern
 * char
 */
const getMaskDefinition = (char, maskDefinitions) => maskDefinitions[char];

/**
 * This function should take any masked value and remove all the non-pattern
 * characters that it contains. It should return `false` when the given
 * maskedValue is incorrect.
 */
const maskStrip = (maskedValue, pattern, placeholder, maskDefinitions) => {
  let stripped = '';

  const value = !maskedValue ? '' : maskedValue;

  // This is used to check if there's a valid char after the first placeholder
  let foundPlaceholder = false;

  // For every char in value...
  for (let index = 0; index < value.length; index += 1) {
    const valueChar = value.charAt(index);
    const patternChar = pattern.charAt(index);
    const maskDefinition = getMaskDefinition(patternChar, maskDefinitions);

    if (maskDefinition) {
      if (maskDefinition.regExp.test(valueChar)) {
        if (foundPlaceholder) {
          // After the first placeholder, we shouldn't have found any valid char
          return false;
        }
        stripped = stripped.concat(valueChar);
      } else if (valueChar !== placeholder) {
        // `valueChar` is neither a valid char for this pattern or a placeholder
        return false;
      } else {
        // We found the first placeholder
        foundPlaceholder = true;
      }
    }
  }
  return stripped;
};

/**
 * This function should take any stripped value and format it according to the
 * given pattern.
 */
const applyMask = (
  strippedValue,
  pattern,
  placeholder,
  guide,
  maskDefinitions,
) => {
  let applied = '';

  let value = !strippedValue ? '' : strippedValue;

  // There are two indexes we need to control: value and pattern
  let valueIndex = 0;

  // For every char in the pattern...
  for (let patternIndex = 0; patternIndex < pattern.length; patternIndex += 1) {
    // Take the current value char
    const valueChar = value.charAt(valueIndex);
    // Take the current pattern char
    const patternChar = pattern.charAt(patternIndex);
    // Take the mask definition for the current pattern char
    const maskDefinition = getMaskDefinition(patternChar, maskDefinitions);

    if (maskDefinition) {
      // If the current pattern char have a mask definition
      if (valueChar) {
        // If the current value char is defined
        if (maskDefinition.regExp.test(valueChar)) {
          // If the current value char is valid, we concatenate it
          applied = applied.concat(valueChar);
          valueIndex += 1;
        } else if (guide) {
          /* If the current value char isn't valid and the mask is guided, we
          concatenate a placeholder */
          applied = applied.concat(placeholder);
          value = '';
        } else {
          /* If the current value isn't valid and the mask isn't guided, we are
          finished */
          return applied;
        }
      } else if (guide) {
        /* If the current pattern char doesn't have a mask definition and the
        mask is guided, we concatenate a placeholder */
        applied = applied.concat(placeholder);
      } else {
        /* If the current pattern char doesn't have a mask definition and the
        mask isn't guided, we are done */
        return applied;
      }
    } else {
      /* If the current pattern char doesn't have a mask definition, we
      concatenate it */
      applied = applied.concat(patternChar);
    }
  }
  return applied;
};

/**
 * This function should handle the user input, reformatting it according to the
 * pattern
 */
const inputReformat = (
  inputString,
  pattern,
  placeholder,
  guide,
  maskDefinitions,
) => {
  let string = !inputString ? '' : inputString;

  // Removes all chars that doesn't have mask definition on the pattern
  for (let index = 0; index < pattern.length; index += 1) {
    const patternChar = pattern.charAt(index);
    const maskDefinition = getMaskDefinition(patternChar, maskDefinitions);

    if (!maskDefinition) {
      const escapedPatternChar = escapeRegExp(patternChar);
      string = string.replace(new RegExp(escapedPatternChar), '');
    }
  }

  // Removes placeholders
  const placeholderRegExp = escapeRegExp(placeholder);
  string = string.replace(placeholderRegExp, '');

  return applyMask(string, pattern, placeholder, guide, maskDefinitions);
};

/**
 * This function should return wether a given value completely fills the given
 * pattern
 */
const isPatternComplete = (formattedValue, pattern, maskDefinitions) => {
  // Trivial case
  if (formattedValue.length !== pattern.length) {
    return false;
  }

  // For every char in the formatted value
  for (let index = 0; index < formattedValue.length; index += 1) {
    // Take the current value char
    const valueChar = formattedValue.charAt(index);
    // Take the current pattern char
    const patternChar = pattern.charAt(index);
    // Take the mask definition for the current pattern char
    const maskDefinition = getMaskDefinition(patternChar, maskDefinitions);

    if (maskDefinition) {
      // If the current pattern char have a mask definition
      if (!maskDefinition.regExp.test(valueChar)) {
        // If the current value char isn't according to the mask definition
        return false;
      }
    } else if (valueChar !== patternChar) {
      /* If the current pattern char doesn't have a mask definition and the
      current value char is not equal to the current pattern char */
      return false;
    }
  }

  /* If we passed the above loop without returning false, then formattedValue
  completely fills the given pattern */
  return true;
};

/**
 * This function should return an array with all the positions on which the
 * caret can be, ordered from least to greatest
 */
const validCaretPositions = (pattern, maskDefinitions) => {
  const validPositions = [];

  // Trivial case
  if (!pattern || typeof pattern !== 'string' || pattern.length === 0) {
    return validPositions;
  }

  // Caret position 0 is valid iff the first char is inputtable
  if (getMaskDefinition(pattern.charAt(0), maskDefinitions)) {
    validPositions.push(0);
  }

  // The middle caret positions are valid iff any adjacent char is inputtable
  for (let index = 1; index < pattern.length; index += 1) {
    // Take the char before the current caret position
    const charBefore = pattern.charAt(index - 1);
    // Take the char after the current caret position
    const charAfter = pattern.charAt(index);

    if (
      getMaskDefinition(charBefore, maskDefinitions) ||
      getMaskDefinition(charAfter, maskDefinitions)
    ) {
      validPositions.push(index);
    }
  }

  // Last caret position is valid iff the last char is inputtable
  if (getMaskDefinition(pattern.charAt(pattern.length - 1), maskDefinitions)) {
    validPositions.push(pattern.length);
  }

  return validPositions;
};

/**
 * This function should return the index of the first unfilled position for any
 * value
 */
const firstUnfilledPosition = (
  value,
  pattern,
  placeholder,
  maskDefinitions,
) => {
  // Trivial case
  if (value === '') {
    return 0;
  }

  /* The first unfilled positon can be determined by finding the first char that
  is a placeholder and isn't a pattern char */
  for (let index = 0; index < value.length; index += 1) {
    const valueChar = value.charAt(index);
    const patternChar = pattern.charAt(index);

    if (valueChar === placeholder && valueChar !== patternChar) {
      return index;
    }
  }

  // In case everyone is filled, return the last inputtable position
  if (value.length === pattern.length) {
    // We need to check if the pattern doesn't end with pattern chars like
    for (let index = pattern.length - 1; index >= 0; index -= 1) {
      const patternChar = pattern.charAt(index);

      if (getMaskDefinition(patternChar, maskDefinitions)) {
        /* The last char in the pattern to have a mask definition will be the
        last inputtable position */
        return index + 1;
      }
    }
  }
  // In case everyone is filled and there's no pattern chars at the end
  return value.length;
};

/**
 * This function should apply the transform function on any new character, based
 * on the current value and the previous one
 */
const applyTransform = (
  strippedValue,
  strippedPreviousValue,
  strippedPattern,
  maskDefinitions,
) => {
  const value = !strippedValue ? '' : strippedValue;
  const previousValue = !strippedPreviousValue ? '' : strippedPreviousValue;

  /* We run the current value string, comparing it to the previous value to
  determine what characters have been added and we use pattern and
  maskDefinitions to get the correct transform function to apply */
  let transformed = '';
  for (let index = 0; index < value.length; index += 1) {
    const valueChar = value.charAt(index);
    const previousValueChar = previousValue.charAt(index);

    if (valueChar !== previousValueChar) {
      const patternChar = strippedPattern.charAt(index);
      const maskDefinition = getMaskDefinition(patternChar, maskDefinitions);
      if (maskDefinition && maskDefinition.transform) {
        // If it has changed and it have transform defined, apply it
        transformed = transformed.concat(maskDefinition.transform(valueChar));
      } else {
        // No transform function is defined
        transformed = transformed.concat(valueChar);
      }
    } else {
      // Transform was already applied, do not apply again
      transformed = transformed.concat(valueChar);
    }
  }

  return transformed;
};

export {
  applyMask,
  applyTransform,
  countOcurrences,
  escapeRegExp,
  firstUnfilledPosition,
  getMaskDefinition,
  inputReformat,
  isPatternComplete,
  maskStrip,
  validCaretPositions,
};
