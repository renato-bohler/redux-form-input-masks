import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { createTextMask } from '../../../src/index';
import { Markdown, Values } from 'redux-form-website-template';
import { App, Demo } from '../App';
import documentation from './CreateTextMask.md';

const selector = formValueSelector('numberMask');

const basic = createTextMask({
  pattern: '---AA---999---000---',
  placeholder: '_',
  maskDefinitions: {
    A: {
      regExp: /[A-Za-z]/,
      transform: char => char.toUpperCase(),
    },
    9: {
      regExp: /[0-9]/,
    },
    0: {
      regExp: /[0-9]/,
      transform: char => (Number(char) === 9 ? 0 : Number(char) + 1),
    },
  },
  stripMask: true,
  guide: false,
  onChange: v => console.warn('Value change', v),
  onCompletePattern: v => console.warn('Patern complete', v),
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
        <a href="https://github.com/renato-bohler/redux-form-input-masks/blob/master/src/createTextMask.js">
          createTextMask
        </a>
      </div>
      <Markdown content={documentation} />
      <Demo codesandbox="k0op1kwywr" />

      <form>
        <div>
          <h3>Basic</h3>
          <Field name="basic" component="input" type="text" {...basic} />
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
    'showPlusSign',
    'spaceAfterSign',
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
