# Number Mask

This mask is ideal for currency, percentage or any other number format you may come across. It is possible to add a prefix, suffix, choose the amount of decimal places, choose if it should allow negative values, the locale to format the number and the data type to store the value (`number` or `string`).

It is also possible to use this mask to use on more elaborated cases. Check an euro to bitcoin conversion example at [`more examples`](#/more).

**Note:** we recommend using `type="tel"` on the formatted field so that on mobile the keypad shows up instead of the regular keyboard.

## Config options

`createNumberMask` accepts an `options` object with the keys described in this section.

```jsx
createNumberMask({
  prefix: '',
  suffix: '',
  decimalPlaces: 0,
  allowEmpty: false,
  allowNegative: false,
  showPlusSign: false,
  spaceAfterSign: false,
  stringValue: false,
  locale, // defaults to browser's locale when undefined
  onChange: updatedValue => {},
});
```

| Key            | Type       | Required | Default     | Description                                                                                                                             |
| -------------- | ---------- | -------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| prefix         | `string`   | no       | `''`        | The input's prefix.                                                                                                                     |
| suffix         | `string`   | no       | `''`        | The input's suffix.                                                                                                                     |
| decimalPlaces  | `number`   | no       | `0`         | The amount of numbers following the decimal point. **Maximum value is 10.**                                                             |
| allowEmpty     | `boolean`  | no       | `false`     | If true, the empty value will be stored as undefined and formated as empty string.                                                      |
| allowNegative  | `boolean`  | no       | `false`     | If true, the value will be negated when the user types `-`.                                                                             |
| showPlusSign   | `boolean`  | no       | `false`     | If true, a plus sign (`+`) will be put before the prefix when the value is positive.                                                    |
| spaceAfterSign | `boolean`  | no       | `false`     | If true, a space will be put after the sign if the sign is visible.                                                                     |
| stringValue    | `boolean`  | no       | `false`     | If true, the value on the store will be converted to string.                                                                            |
| locale         | `string`   | no       | `undefined` | The locale to format the number in the input. `undefined` will take the browser's locale. Examples: `en-US`, `fr`, `de`, `pt-BR`, `jp`. |
| onChange       | `function` | no       | `undefined` | You can pass a function which receives the updated value to do your stuff. Example: `updatedValue => console.log(updatedValue)`         |

## Usage

You just need to import `createNumberMask` from `redux-form-input-masks`, specify the parameters and pass it to the `Field` using [spread attributes](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes), just like that:

```jsx
import { Field } from 'redux-form';
import { createNumberMask } from 'redux-form-input-masks';

const currencyMask = createNumberMask({
  prefix: 'US$ ',
  suffix: ' per item',
  decimalPlaces: 2,
  locale: 'en-US',
});

const inputUSDPerItem = () => (
  <Field name="amount" component="input" type="tel" {...currencyMask} />
);
```

You could also call the function direcly inside the `Field`, if you need dynamically change the mask.

```jsx
<Field
  name="dynamic"
  component="input"
  type="tel"
  {...createNumberMask({
    prefix: props.prefix,
    suffix: props.suffix,
    decimalPlaces: props.decimalPlaces,
    allowEmpty: props.allowEmpty,
    allowNegative: props.allowNegative,
    showPlusSign: props.showPlusSign,
    spaceAfterSign: props.spaceAfterSign,
    stringValue: props.stringValue,
    locale: props.locale,
    onChange: props.onChange,
  })}
/>
```

## Validation

It is easy to create `redux-form`'s validations to any `Field` formatted with `createNumberMask`. Validation functions can be as simple as

```jsx
const validation = value => value > 10 ? 'Maximum value is 10' : '';

(...)

<Field
  name="my-numeric-field"
  component={TextField}
  type="tel"
  validate={validation}
  {...createNumberMask()}
/>
```
