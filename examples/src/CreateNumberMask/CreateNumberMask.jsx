import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { createNumberMask } from '../../../src/index';
import { Markdown, Values } from 'redux-form-website-template';
import App from '../App/App';
import documentation from './CreateNumberMask.md';

const selector = formValueSelector('numberMask');

const basic = createNumberMask('US$ ', ' per item', 2, false, 'en-US');
const converted = createNumberMask('', '%', 4, true);
const frLocale = createNumberMask('€ ', '', 2, true, 'fr');

const CreateNumberMask = props => {
  return (
    <App>
      <Markdown content={documentation} />
      <h2>Demo</h2>
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
          <h3>Dynamic</h3>
          <Field
            name="dynamic"
            component="input"
            type="tel"
            {...createNumberMask(
              props.prefix,
              props.suffix,
              props.decimalPlaces,
              props.convertToString,
              props.locale,
            )}
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
            <Field
              name="convertToString"
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

export default connect(state => {
  return selector(
    state,
    'prefix',
    'suffix',
    'decimalPlaces',
    'convertToString',
    'locale',
  );
})(
  reduxForm({
    form: 'numberMask',
    initialValues: {
      decimalPlaces: 2,
    },
  })(CreateNumberMask),
);
