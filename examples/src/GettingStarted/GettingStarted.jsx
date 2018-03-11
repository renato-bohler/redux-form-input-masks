import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';
import { createNumberMask, createTextMask } from '../../../src/index';
import { Markdown } from 'redux-form-website-template';
import { App, Demo } from '../App';
import documentation from './GettingStarted.md';

const currencyMask = createNumberMask({
  prefix: 'US$ ',
  suffix: ' per item',
  decimalPlaces: 2,
  locale: 'en-US',
});

const phoneMask = createTextMask({
  pattern: '(999) 999-9999',
});

let GettingStarted = props => {
  return (
    <App>
      <div className="path">
        <a href="https://github.com/renato-bohler/redux-form-input-masks">
          redux-form-input-masks
        </a>
      </div>
      <Markdown content={documentation} />
      <Demo codesandbox="v0rj4p6y0" />
      <form>
        <div>
          <h3>Amount</h3>
          <Field name="amount" component="input" type="tel" {...currencyMask} />
        </div>
        <div>
          <h3>Phone number</h3>
          <Field name="phone" component="input" type="tel" {...phoneMask} />
        </div>
      </form>
    </App>
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
