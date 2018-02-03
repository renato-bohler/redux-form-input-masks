# Getting started

This page contains the documentation and some working examples of `redux-form-input-masks`, which is a library that works with [`redux-form`](https://github.com/erikras/redux-form) to easily add masking to `Field`s.

## Motivation

Redux is awesome and so are input masks: they help standardizing inputs and improves the UX of the application. `redux-form` has support for input formatting, parseing and normalizing, but it can get pretty tricky to implement a mask with these functions. `redux-form-input-masks` offer simple APIs to create these masks so you don't need to worry about it!

## Example

```jsx
import { Field } from 'redux-form';
import { createNumberMask } from 'redux-form-input-masks';

const currencyMask = createNumberMask('US$ ', ' per item', 2, false, 'en-US');
const inputUSDPerItem = () => (
  <Field name="amount" component="input" type="tel" {...currencyMask} />
);
```

## Under the hood

`redux-form-input-masks` returns objects implementing `redux-form`'s [Value Lifecycle](https://redux-form.com/7.2.3/docs/valuelifecycle.md/) functions and also some [Global Event Handlers](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers) to manage the caret position.
