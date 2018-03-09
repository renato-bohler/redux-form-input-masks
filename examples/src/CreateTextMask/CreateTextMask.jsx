import React from 'react';
import { connect } from 'react-redux';
// import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Field, reduxForm } from 'redux-form';
import { createTextMask } from '../../../src/index';
import { Markdown, Values } from 'redux-form-website-template';
import { App, Demo } from '../App';
import documentation from './CreateTextMask.md';

// const selector = formValueSelector('textMask');

const guidedStripped = createTextMask({
  pattern: '(999) 999-9999',
});

const notGuided = createTextMask({
  pattern: '(999) 999-9999',
  guide: false,
});

const notStripped = createTextMask({
  pattern: '(999) 999-9999',
  stripMask: false,
});

const norGuidedOrStripped = createTextMask({
  pattern: '(999) 999-9999',
  guide: false,
  stripMask: false,
});

let CreateTextMask = props => {
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
          <h3>
            Phone number <small>(guided and stripped)</small>
          </h3>
          <Field
            name="guidedStripped"
            component="input"
            type="tel"
            {...guidedStripped}
          />
        </div>
        <div>
          <h3>
            Phone number <small>(not guided)</small>
          </h3>
          <Field name="notGuided" component="input" type="tel" {...notGuided} />
        </div>
        <div>
          <h3>
            Phone number <small>(not stripped)</small>
          </h3>
          <Field
            name="notStripped"
            component="input"
            type="tel"
            {...notStripped}
          />
        </div>
        <div>
          <h3>
            Phone number <small>(nor guided or stripped)</small>
          </h3>
          <Field
            name="norGuidedOrStripped"
            component="input"
            type="tel"
            {...norGuidedOrStripped}
          />
        </div>
        <div>
          <h3>
            Transform to random <small>(AAA-999)</small>
          </h3>
          <Field
            name="transform"
            component="input"
            type="text"
            {...createTextMask({
              pattern: 'AAA-999',
              maskDefinitions: {
                A: {
                  regExp: /[A-Za-z]/,
                  transform: char => {
                    const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    const randomIndex = Math.floor(
                      Math.random() * possibleChars.length,
                    );
                    return possibleChars.charAt(randomIndex);
                  },
                },
                9: {
                  regExp: /[0-9]/,
                  transform: () => Math.floor(Math.random() * 9),
                },
              },
            })}
          />
        </div>
      </form>
      <Values form="textMask" />
    </App>
  );
};

// const mapStateToProps = state => selector(state, 'basic');
const mapStateToProps = () => ({});

CreateTextMask = connect(mapStateToProps)(CreateTextMask);

export default reduxForm({
  form: 'textMask',
  initialValues: {},
})(CreateTextMask);
