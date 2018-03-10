import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';
import { createNumberMask, createTextMask } from '../../../src/index';
import { Markdown, Values } from 'redux-form-website-template';
import { App, Demo } from '../App';
import documentation from './MoreExamples.md';
/** material-ui@next */
import { TextField } from 'redux-form-material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import { orange } from 'material-ui/colors';
import createPalette from 'material-ui/styles/createPalette';
/** semantic-ui-react */
import { Input } from 'semantic-ui-react';

const muiTheme = createMuiTheme({
  palette: createPalette({
    primary: orange,
    type: 'light',
  }),
});

const basic = createNumberMask({
  prefix: 'US$ ',
  suffix: ' per item',
  decimalPlaces: 2,
  locale: 'en-US',
});

// Luhn algorithm. Adapted from https://stackoverflow.com/a/23222600
const validateCardNumber = number => {
  const regex = new RegExp('^[0-9]{16}$');
  if (!regex.test(number)) return false;

  let sum = 0;
  for (let i = 0; i < number.length; i += 1) {
    var intVal = parseInt(number.substr(i, 1), 10);
    if (i % 2 === 0) {
      intVal *= 2;
      if (intVal > 9) {
        intVal = 1 + intVal % 10;
      }
    }
    sum += intVal;
  }
  return sum % 10 === 0;
};

const creditCard = createTextMask({
  pattern: '9999 - 9999 - 9999 - 9999',
  placeholder: '_',
  onCompletePattern: value => {
    if (validateCardNumber(value)) {
      window.alert('This credit card number is valid!');
    } else {
      window.alert("This credit card number isn't valid!");
    }
  },
});

const conversionRate = 6800;

let MoreExamples = props => {
  const btcChange = btc => {
    props.change('EUR', btc * conversionRate);
  };

  const eurChange = eur => {
    props.change('BTC', eur / conversionRate);
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
    <App>
      <div className="path">
        <a href="https://github.com/renato-bohler/redux-form-input-masks">
          redux-form-input-masks
        </a>
      </div>
      <Markdown content={documentation} />
      <Demo codesandbox="4l3m2z97p0" />

      <form>
        <h2>Integration with component libraries</h2>
        <div>
          <h3>material-ui@1-beta</h3>
          <MuiThemeProvider theme={muiTheme}>
            <Field
              name="material-ui@1-beta"
              component={TextField}
              type="tel"
              {...basic}
            />
          </MuiThemeProvider>
        </div>
        <div>
          <h3>semantic-ui-react</h3>
          <Field
            name="semantic-ui-react"
            component={Input}
            type="tel"
            label={{ icon: 'dollar' }}
            labelPosition="left corner"
            {...basic}
          />
        </div>
        <h2>Conversion EUR {'<=>'} BTC</h2>
        <div>
          <Field name="BTC" component="input" type="tel" {...btcMask} />
          <Field name="EUR" component="input" type="tel" {...eurMask} />
        </div>
        <h2>Credit card (16 digits) with validation</h2>
        <div>
          <h3>
            <small>
              this is valid: <strong>3530 1113 3330 0000</strong>
            </small>
          </h3>
          <Field
            name="creditCard"
            component="input"
            type="tel"
            {...creditCard}
          />
        </div>
      </form>
      <Values form="moreExamples" />
    </App>
  );
};

const mapStateToProps = undefined;

const mapDispatchToProps = dispatch => ({
  change: (field, value) => dispatch(change('moreExamples', field, value)),
});

MoreExamples = connect(mapStateToProps, mapDispatchToProps)(MoreExamples);

export default reduxForm({
  form: 'moreExamples',
})(MoreExamples);
