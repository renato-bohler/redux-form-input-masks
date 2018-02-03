# Number Mask

This mask is ideal for currency, percentage or any other number format you may come across. It is possible to add a prefix, suffix, choose the amount of decimal places, the locale to format the number and the data type to store the value (`number` or `string`).

**Note:** we recommend using `type="tel"` on the formatted field so that on mobile the keypad shows up instead of the regular keyboard.

## Code example

You just need to import `createNumberMask` from `react-form-input-masks`, specify the parameters and pass it to the `Field` using [spread attributes](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes), just like that:

```jsx
import { Field } from 'redux-form';
import { createNumberMask } from 'redux-form-input-masks';

const currencyMask = createNumberMask('US$ ', ' per item', 2, false, 'en-US');
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
  {...createNumberMask(prefix, suffix, decimalPlaces, convertToString, locale)}
/>
```

## Config properties

```jsx
createNumberMask(prefix, suffix, decimalPlaces, stringValue, locale);
```

| Name          | Type    | Required | Default           | Description                                                                          |
| ------------- | ------- | -------- | ----------------- | ------------------------------------------------------------------------------------ |
| prefix        | string  | no       | ''                | The input's prefix                                                                   |
| suffix        | string  | no       | ''                | The input's suffix                                                                   |
| decimalPlaces | number  | no       | 0                 | The amount of numbers following the decimal point. Maximum value is 10               |
| stringValue   | boolean | no       | false             | If true, the value on the store will be converted to string                          |
| locale        | string  | no       | browser's default | The locale to format the number in the input. Examples: `en-US`, `fr`, `de`, `pt-BR` |
