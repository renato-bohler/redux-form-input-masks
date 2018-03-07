// general
const escapeRegExp = str =>
  str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

// createNumberMask.js
const countOcurrences = (str, regexp) => (str.match(regexp) || []).length;

// createStringMask.js
/**
 * This function should simply return the mask definition for a given pattern
 * char
 */
const getMaskDefinition = (char, maskDefinitions) => maskDefinitions[char];

/**
 * This function should take any masked value and remove all the non-pattern
 * characters that it contains.
 */
const maskStrip = (maskedValue, pattern, placeholder, maskDefinitions) => {
  let stripped = '';

  const value = !maskedValue ? '' : maskedValue;
  let foundPlaceholder = false;

  for (let index = 0; index < value.length; index += 1) {
    const valueChar = value.charAt(index);
    const patternChar = pattern.charAt(index);
    const maskDefinition = getMaskDefinition(patternChar, maskDefinitions);

    if (maskDefinition) {
      if (maskDefinition.regExp.test(valueChar)) {
        if (foundPlaceholder) {
          return false;
        }
        stripped = stripped.concat(valueChar);
      } else if (valueChar !== placeholder) {
        return false;
      } else {
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
  let valueIndex = 0;

  for (let patternIndex = 0; patternIndex < pattern.length; patternIndex += 1) {
    const valueChar = value.charAt(valueIndex);
    const patternChar = pattern.charAt(patternIndex);
    const maskDefinition = getMaskDefinition(patternChar, maskDefinitions);

    if (maskDefinition) {
      if (valueChar) {
        if (maskDefinition.regExp.test(valueChar)) {
          applied = applied.concat(valueChar);
          valueIndex += 1;
        } else if (guide) {
          applied = applied.concat(placeholder);
          value = '';
        } else {
          return applied;
        }
      } else if (guide) {
        applied = applied.concat(placeholder);
      } else {
        return applied;
      }
    } else {
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

  // Removes placeholder
  const placeholderRegExp = escapeRegExp(placeholder);
  string = string.replace(placeholderRegExp, '');

  return applyMask(string, pattern, placeholder, guide, maskDefinitions);
};

/**
 * This function should simply return wether a given value completely fills the
 * given pattern
 */
const isPatternComplete = (formattedValue, pattern, maskDefinitions) => {
  if (formattedValue.length !== pattern.length) {
    return false;
  }

  for (let index = 0; index < formattedValue.length; index += 1) {
    const valueChar = formattedValue.charAt(index);
    const patternChar = pattern.charAt(index);
    const maskDefinition = getMaskDefinition(patternChar, maskDefinitions);

    if (maskDefinition) {
      if (!maskDefinition.regExp.test(valueChar)) {
        return false;
      }
    } else if (valueChar !== patternChar) {
      return false;
    }
  }

  return true;
};

/**
 * This function should return an array with all the positions on which the
 * caret can be, ordered from least to greatest
 */
const validCaretPositions = (pattern, maskDefinitions) => {
  const validPositions = [];

  if (!pattern || typeof pattern !== 'string' || pattern.length === 0) {
    return validPositions;
  }

  // Caret position 0 is valid iff the first char is inputtable
  if (getMaskDefinition(pattern.charAt(0), maskDefinitions)) {
    validPositions.push(0);
  }

  // The middle caret positions are valid iff any adjacent char is inputtable
  for (let index = 1; index < pattern.length; index += 1) {
    const charBefore = pattern.charAt(index - 1);
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
  // trivial case
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
        // if it has changed and it have transform defined, apply it
        transformed = transformed.concat(maskDefinition.transform(valueChar));
      } else {
        transformed = transformed.concat(valueChar);
      }
    } else {
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
