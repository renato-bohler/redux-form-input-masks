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

## Usage

It's super simple to apply a mask using this library. You just need to import your mask creator from `react-form-input-masks`, specify the parameters and pass it to the `Field` using [spread attributes](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes). Yep, it's that easy.

The following is a use case for [`createNumberMask`](#/number-mask). It consists of two inputs that convert bitcoins to euros and vice versa. Check the demo below the code. You can also check it on [codesandbox.io](https://codesandbox.io/s/v0rj4p6y0). Please note that this convertion does not reflect real conversion rates.

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

  const btcMask = createNumberMask('BTC ', '', 5, false, 'en-US', btcChange);
  const eurMask = createNumberMask('', ' €', 2, false, 'de', eurChange);

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