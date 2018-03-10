# redux-form-input-masks

<p align="center">
    <span>
        <img alt="travis ci build status" src="https://img.shields.io/travis/renato-bohler/redux-form-input-masks/master.svg?style=flat-square">
    </span>
    <span>
        <img alt="percentage of code coverage by tests" src="https://img.shields.io/codecov/c/github/renato-bohler/redux-form-input-masks/master.svg?style=flat-square">
    </span>
    <span>
        <img alt="latest release" src="https://img.shields.io/github/release/renato-bohler/redux-form-input-masks/all.svg?style=flat-square">
    </span>
    <span>
        <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
    </span>
    <span>
        <img alt="commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square">
    </span>
    <span>
        <img alt="semantic release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square">
    </span>
    <span>
        <img alt="license MIT" src="https://img.shields.io/github/license/renato-bohler/redux-form-input-masks.svg?style=flat-square">
    </span>
</p>

## [Documentation and examples](https://renato-bohler.github.io/redux-form-input-masks)

## Getting started

`redux-form-input-masks` is a library that works with [`redux-form`](https://github.com/erikras/redux-form) to easily add masking to `Field`s.

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

The following is a use case for [`createNumberMask`](https://renato-bohler.github.io/redux-form-input-masks/#/number-mask). It consists of two inputs that convert bitcoins to euros and vice versa. You can see it running on [codesandbox.io](https://codesandbox.io/s/v0rj4p6y0). Please note that this convertion does not reflect real conversion rates.

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

## Warning

This project is still under development, I'm still setting all up for the first official release (v1.0.0). Until then, some breaking changes in v0 may occur.

### Milestones to v1.0.0

* [x] create repo basic structure;
* [x] create multi purpose dev server (gh-pages documentation and live demos);
* [x] create codesandbox.io demos;
* [x] specify an API for `createNumberMask`;
* [x] implement `createNumberMask`;
* [x] add tests and code coverage structure to the project;
* [x] implement `createNumberMask` tests;
* [x] `createNumberMask` bugfixes;
* [x] add repo workflow (Travis CI, danger, codecov, commitizen, semantic release);
* [x] add fancy badges ([#4](https://github.com/renato-bohler/redux-form-input-masks/issues/4));
* [x] add issue template ([#2](https://github.com/renato-bohler/redux-form-input-masks/issues/2));
* [x] add code of conduct ([#3](https://github.com/renato-bohler/redux-form-input-masks/issues/3));
* [x] add build process;
* [x] add contributing ([#5](https://github.com/renato-bohler/redux-form-input-masks/issues/5));
* [x] fix [#14](https://github.com/renato-bohler/redux-form-input-masks/issues/14)
* [x] specify an API for `createStringMask`, an easy and flexible string mask creator;
* [ ] implement `createStringMask` and its tests.
