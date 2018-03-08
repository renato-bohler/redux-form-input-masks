import {
  applyMask,
  applyTransform,
  firstUnfilledPosition,
  inputReformat,
  isPatternComplete,
  maskStrip,
  validCaretPositions,
} from './utils';
import defaultMaskDefinitions from './defaultMaskDefinitions';

export default options => {
  const {
    pattern,
    placeholder = '_',
    maskDefinitions = defaultMaskDefinitions,
    guide = true,
    stripMask = true,
    onChange,
    onCompletePattern,
  } = options;

  const validPositions = validCaretPositions(pattern, maskDefinitions);
  const strippedPattern = maskStrip(
    pattern,
    pattern,
    placeholder,
    maskDefinitions,
  );

  const format = (storeValue, calledFromNormalize = false) => {
    if (!storeValue) {
      return applyMask('', pattern, placeholder, guide, maskDefinitions);
    }

    if (!stripMask && !calledFromNormalize) {
      // If we aren't stripping the mask, the value should be already formatted
      return storeValue;
    }

    // Format the mask according to pattern and maskDefinitions
    return applyMask(storeValue, pattern, placeholder, guide, maskDefinitions);
  };

  const normalize = (updatedValue, previousValue) => {
    const inputHandledValue = inputReformat(
      updatedValue,
      pattern,
      placeholder,
      guide,
      maskDefinitions,
    );

    // We need to strip the mask before working with it
    const strippedValue = maskStrip(
      inputHandledValue,
      pattern,
      placeholder,
      maskDefinitions,
    );

    // Apply the `transform` function on the inputted character
    const transformedValue = applyTransform(
      strippedValue,
      stripMask
        ? previousValue
        : maskStrip(previousValue, pattern, placeholder, maskDefinitions),
      strippedPattern,
      maskDefinitions,
    );
    const formattedValue = format(transformedValue, true);
    const newValue = stripMask ? transformedValue : formattedValue;
    const hasValueChanged =
      transformedValue !== previousValue && previousValue !== undefined;

    // We call `onChange` if it was set and if the value actually changed
    if (onChange && hasValueChanged) {
      onChange(newValue);
    }

    // We call `onCompletePattern` if it was set and the pattern is complete
    if (
      onCompletePattern &&
      isPatternComplete(formattedValue, pattern, maskDefinitions) &&
      hasValueChanged
    ) {
      onCompletePattern(newValue);
    }

    // We need to reformat the string before storing
    return newValue;
  };

  const goToFirstUnfilledPosition = target => {
    const caretPos = firstUnfilledPosition(
      target.value,
      pattern,
      placeholder,
      maskDefinitions,
    );

    target.setSelectionRange(caretPos, caretPos);
  };

  const goToNearestValidPosition = (target, position, direction) => {
    /* `validPositions` is ordered from least to greatest, so we find the first
    valid positon after `position` */
    const nearestIndexToTheRight = validPositions.findIndex(
      element => element > position,
    );

    let caretPos;
    if (direction === 'left') {
      /* The nearest valid position to the left will be the element that comes
      before it. */
      caretPos = validPositions[nearestIndexToTheRight - 1];
    } else {
      caretPos = validPositions[nearestIndexToTheRight];
    }

    /* If there are no valid position to the informed direction we fallback to
    the first valid position (left) or to the last valid position (right) */
    if (caretPos === undefined) {
      const fallbackIndex =
        direction === 'left' ? 0 : validPositions.length - 1;
      caretPos = validPositions[fallbackIndex];
    }
    target.setSelectionRange(caretPos, caretPos);
  };

  const manageCaretPosition = event => {
    if (event.target) {
      if (event.persist) {
        event.persist();
      }

      // We get these values before updating
      const previousSelection = event.target.selectionStart;
      const previousValue = event.target.value;

      // This timeout is needed to get updated values
      setTimeout(() => {
        const { target, type, key } = event;
        const { value, selectionStart, selectionEnd } = event.target;

        switch (type) {
          case 'change':
            /* Upon change, we need to determine if the user has pressed
            backspace to move the caret accordingly */
            if (
              value.length === previousValue.length + 1 &&
              value.charAt(previousSelection) !== placeholder
            ) {
              // Backspace was pressed at a pattern char
              goToNearestValidPosition(target, previousSelection, 'left');
              break;
            }
            goToFirstUnfilledPosition(
              target,
              pattern,
              placeholder,
              maskDefinitions,
            );
            break;
          case 'focus':
            // Upon focus, we move to the first unfilled position
            goToFirstUnfilledPosition(
              target,
              pattern,
              placeholder,
              maskDefinitions,
            );
            break;
          case 'click':
            /* Upon click, we first check if the caret is on a valid position.
            If it isn't, we move it to the first unfilled position */
            if (selectionStart === selectionEnd) {
              if (validPositions.includes(selectionStart)) {
                event.preventDefault();
              } else {
                goToFirstUnfilledPosition(
                  target,
                  pattern,
                  placeholder,
                  maskDefinitions,
                );
              }
            }
            break;
          case 'keydown':
            /* Upon left or right arrow, we need to move the caret to
            the next valid position to the right direction */
            if (key === 'ArrowLeft') {
              goToNearestValidPosition(target, selectionStart, 'left');
            } else if (key === 'ArrowRight') {
              goToNearestValidPosition(target, previousSelection, 'right');
            }
            break;
        }
      });
    }
  };

  return {
    format: storeValue => format(storeValue),
    normalize: (updatedValue, previousValue) =>
      normalize(updatedValue, previousValue),
    onKeyDown: event => manageCaretPosition(event),
    onChange: event => manageCaretPosition(event),
    onFocus: event => manageCaretPosition(event),
    onClick: event => manageCaretPosition(event),
    autoComplete: 'off',
  };
};
