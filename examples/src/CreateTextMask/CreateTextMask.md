# Text Mask

The text mask is designed to be easily used in any kind of string formatted inputs, like telephone numbers, zip codes, credit card numbers and so on. You can build your own text mask with ease: the only required parameter is the `pattern`. It is also possible to customize the `placeholder` and specify `maskDefinitions`, if the `guide` should show or not and if the value stored should be stripped or not.

It is also possible to specify an `onChange` function (to be called every time the value changes) and `onCompletePattern` (to be called when the pattern is completely filled by the user).

**Note:** we recommend using `type="tel"` on only numeric fields, so that on mobile the keypad shows up instead of the regular keyboard.

## Config options

`createTextMask` accepts an `options` object with the keys described in this section.

```jsx
createTextMask({
  pattern, // required
  placeholder: '_',
  maskDefinitions: defaultMaskDefinitions, // see below
  guide: true,
  stripMask: true,
  onChange: value => {},
  onCompletePattern: value => {},
});
```

| Key               | Type       | Required | Default     | Description                                                                                                                                   |
| ----------------- | ---------- | -------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| pattern           | `string`   | yes      |             | The input's pattern. Example: `(999) 999-9999`, where the character `9` is specified in the `maskDefinitions`                                 |
| placeholder       | `string`   | no       | `'\_'`      | The placeholder to fill the guide. It should be a single character                                                                            |
| maskDefinitions   | see below  | no       | see below   | An object with the inputtable characters for the `pattern`. Check the section below for more info                                             |
| guide             | `boolean`  | no       | `true`      | If true, the non inputted part of the mask will be shown and the inputtable characters of the `pattern` will be replaced by the `placeholder` |
| stripMask         | `boolean`  | no       | `true`      | If true, the value on the store will not contain any characters that the user didn't input                                                    |
| onChange          | `function` | no       | `undefined` | You can pass a function which receives the updated value upon change. Example: `updatedValue => console.log(updatedValue)`                    |
| onCompletePattern | `function` | no       | `undefined` | You can pass a function which receives the updated value upon completing the `pattern`. Example: `updatedValue => validate(updatedValue)`     |

## Mask definitions

Mask definitions is simply an `object` which contains keys for any character that should be inputtable on the `pattern`. Every character has to specify an `regExp` key, containing a regular expression to determine wether a input should be allowed or not for this mask definition. You can go even further and define a `transform` for it, which is a hook that will modify the inputted character.

So, for example, if you are willing to build a custom mask, your code could look like this:

```jsx
const myCustomMaskDefinitions = {
  9: {
    regExp: /[0-9]/,
  },
  A: {
    regExp: /[A-Za-z]/,
    transform: char => char.toUpperCase(),
  },
};

const myTextMask = createTextMask({
  pattern: '999-AAA',
  maskDefinitions: myCustomMaskDefinitions,
});
```

This means that `myTextMask` would have the guide `\_\_\_-\_\_\_` and would accept:

* any numeric character (`/[0-9]/`) for the first three positions;
* any upper or lowercase letter from A to Z (`/[A-Za-z]/`), transforming it to uppercase for the three last positions.

Luckily, the `maskDefinitions` option is not required for `createTextMask` as it has a default value covering common use cases:

```jsx
const defaultMaskDefinitions = {
  // Accepts both uppercase and lowercase and transform to uppercase
  A: {
    regExp: /[A-Za-z]/,
    transform: char => char.toUpperCase(),
  },
  // Accepts both uppercase and lowercase and transform to lowercase
  a: {
    regExp: /[A-Za-z]/,
    transform: char => char.toLowerCase(),
  },
  // Accepts only uppercase
  U: {
    regExp: /[A-Z]/,
  },
  // Accepts only lowercase
  l: {
    regExp: /[a-z]/,
  },
  // Numbers
  9: {
    regExp: /[0-9]/,
  },
};
```

## Usage

Todo.
