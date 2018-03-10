# Getting started

This page contains the documentation and some working examples of `redux-form-input-masks`, which is a library that works with [`redux-form`](https://github.com/erikras/redux-form) to easily add masking to `Field`s.

## Motivation

Redux is awesome and so are input masks: they help standardizing inputs and improves the UX of the application. `redux-form` has support for input formatting, parseing and normalizing, but it can get pretty tricky to implement a mask with these functions. `redux-form-input-masks` offer simple APIs to create these masks so you don't need to worry about it!

## Under the hood

`redux-form-input-masks` returns objects implementing `redux-form`'s [Value Lifecycle Hooks](https://redux-form.com/7.2.3/docs/valuelifecycle.md/) and also some [Global Event Handlers](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers) to manage the caret position.

## Installation

```
npm install --save redux-form-input-masks
```

or

```
yarn add redux-form-input-masks
```

## Features

* **simple to setup:** works with `redux-form` out of the box, you just need to install `redux-form-input-masks` and you're good to go;
* **simple to use:** import a mask creator and apply it... and that's it. There's no need to change the component you're already using;
* **flexible:** it lets you choose how you want the input mask to behave;
* **lightweight:** not a single dependency is added to `redux-form-input-masks`;
* compatible with component libraries like `material-ui` and `redux-form-material-ui`'s wrappers, for both v0-stable and v1-beta versions.

## Available masks

| Name        | Description                                                                                                                                                                                                 | API Reference                                                                            | Demo                                                  |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Number Mask | Ideal for currency, percentage or any other numeric input. Supports prefix, suffix, locale number formatting and even more options. You can also choose wether the value is stored as `number` or `string`. | [createNumberMask](https://renato-bohler.github.io/redux-form-input-masks/#/number-mask) | [codesandbox.io](https://codesandbox.io/s/k0op1kwywr) |
| Text Mask   | Flexible string mask. Lets you specify the pattern, inputtable characters and much more.                                                                                                                    | [createTextMask](https://renato-bohler.github.io/redux-form-input-masks/#/text-mask)     | [codesandbox.io](https://codesandbox.io/s/9o5vyqxn84) |

## Usage

It's super simple to apply a mask using this library. You just need to import your mask creator from `react-form-input-masks`, specify the parameters and pass it to the `Field` using [spread attributes](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes). Yep, it's that easy.

The following is a use case for [`createNumberMask`](#/number-mask). It consists of two inputs that convert bitcoins to euros and vice versa. Check the demo below the code. You can also check it on [codesandbox.io](https://codesandbox.io/s/v0rj4p6y0). Please note that this conversion does not reflect real conversion rates.

```jsx
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';
import { createNumberMask } from 'redux-form-input-masks';

const conversionRate = 6800;

let GettingStarted = props => {
  const btcChange = btc => {
    props.change('gettingStarted', 'EUR', btc * conversionRate);
  };

  const eurChange = eur => {
    props.change('gettingStarted', 'BTC', eur / conversionRate);
  };

  const btcMask = createNumberMask({
    prefix: 'BTC ',
    decimalPlaces: 5,
    locale: 'en-US',
    onChange: btcChange,
  });

  const eurMask = createNumberMask({
    suffix: ' €',
    decimalPlaces: 2,
    locale: 'de',
    onChange: eurChange,
  });

  return (
    <form>
      <div>
        <Field name="BTC" component="input" type="tel" {...btcMask} />
        <Field name="EUR" component="input" type="tel" {...eurMask} />
      </div>
    </form>
  );
};

const mapStateToProps = undefined;

const mapDispatchToProps = dispatch => ({
  change: (form, field, value) => dispatch(change(form, field, value)),
});

GettingStarted = connect(mapStateToProps, mapDispatchToProps)(GettingStarted);

export default reduxForm({
  form: 'gettingStarted',
})(GettingStarted);
```
