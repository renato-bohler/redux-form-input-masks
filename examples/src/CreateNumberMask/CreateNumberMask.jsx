import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { createNumberMask } from '../../../src/index';
import { Markdown, Values } from 'redux-form-website-template';
import { App, Demo } from '../App';
import documentation from './CreateNumberMask.md';

const selector = formValueSelector('numberMask');

const basic = createNumberMask({
  prefix: 'US$ ',
  suffix: ' per item',
  decimalPlaces: 2,
  locale: 'en-US',
});

const converted = createNumberMask({
  suffix: '%',
  decimalPlaces: 4,
  stringValue: true,
});

const frLocale = createNumberMask({
  prefix: '€ ',
  decimalPlaces: 2,
  locale: 'fr',
});

const negative = createNumberMask({
  decimalPlaces: 3,
  allowNegative: true,
});

let CreateNumberMask = props => {
  return (
    <App>
      <div className="path">
        <a href="https://github.com/renato-bohler/redux-form-input-masks">
          redux-form-input-masks
        </a>
        <a href="https://github.com/renato-bohler/redux-form-input-masks/tree/master/src">
          src
        </a>
        <a href="https://github.com/renato-bohler/redux-form-input-masks/blob/master/src/createNumberMask.js">
          createNumberMask
        </a>
      </div>
      <Markdown content={documentation} />
      <Demo codesandbox="k0op1kwywr" />

      <form>
        <div>
          <h3>Basic</h3>
          <Field name="basic" component="input" type="tel" {...basic} />
        </div>
        <div>
          <h3>Value converted to string</h3>
          <Field name="converted" component="input" type="tel" {...converted} />
        </div>
        <div>
          <h3>French number formatting</h3>
          <Field name="frLocale" component="input" type="tel" {...frLocale} />
        </div>
        <div>
          <h3>Allow negative</h3>
          <Field name="negative" component="input" type="tel" {...negative} />
        </div>
        <div>
          <h3>Dynamic</h3>
          <Field
            name="dynamic"
            component="input"
            type="tel"
            {...createNumberMask({
              prefix: props.prefix,
              suffix: props.suffix,
              decimalPlaces: props.decimalPlaces,
              stringValue: props.stringValue,
              allowNegative: props.allowNegative,
              locale: props.locale,
            })}
          />
        </div>
        <div>
          <div />
          <Field
            name="prefix"
            component="input"
            type="text"
            placeholder="Choose your prefix"
          />
        </div>
        <div>
          <div />
          <Field
            name="suffix"
            component="input"
            type="text"
            placeholder="Choose your suffix"
          />
        </div>
        <div>
          <div />
          <Field
            name="decimalPlaces"
            component="input"
            type="number"
            min="0"
            max="10"
            placeholder="Choose the amount of decimal places"
          />
        </div>
        <div>
          <div />
          <Field name="locale" component="select">
            <option>browser</option>
            <option>en-US</option>
            <option>fr</option>
            <option>de</option>
            <option>pt-BR</option>
          </Field>
        </div>
        <div>
          <div />
          <label>
            Convert to string
            <Field name="stringValue" component="input" type="checkbox" />{' '}
          </label>
        </div>
        <div>
          <div />
          <label>
            Allow negative values
            <Field
              name="allowNegative"
              component="input"
              type="checkbox"
            />{' '}
          </label>
        </div>
      </form>
      <Values form="numberMask" />
    </App>
  );
};

const mapStateToProps = state =>
  selector(
    state,
    'prefix',
    'suffix',
    'decimalPlaces',
    'stringValue',
    'allowNegative',
    'locale',
  );

CreateNumberMask = connect(mapStateToProps)(CreateNumberMask);

export default reduxForm({
  form: 'numberMask',
  initialValues: {
    negative: -1.234,
    decimalPlaces: 2,
  },
})(CreateNumberMask);
