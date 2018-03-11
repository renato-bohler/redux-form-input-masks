import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { createTextMask } from '../../../src/index';
import { Code, Markdown, Values } from 'redux-form-website-template';
import { App, Demo, ResultCode } from '../App';
import documentation from './CreateTextMask.md';

const selector = formValueSelector('textMask');

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
  // createTextMask on try/catch to build custom mask
  let safeTextMask;
  let customizedCode;
  let error;
  try {
    safeTextMask = createTextMask({
      pattern: props.pattern,
      placeholder: props.placeholder,
      guide: props.guide,
      stripMask: props.stripMask,
    });

    customizedCode =
      "import { createTextMask } from 'redux-form-input-masks';\n\n" +
      'const myCustomTextMask = createTextMask({\n' +
      `    pattern: '${props.pattern}',\n` +
      (props.placeholder !== '_'
        ? `    placeholder: '${props.placeholder}',\n`
        : '') +
      (props.guide !== true ? `    guide: ${props.guide},\n` : '') +
      (props.stripMask !== true ? `    stripMask: ${props.stripMask},\n` : '') +
      '    // maskDefinitions: myCustomMaskDefinitions,\n' +
      '    // onChange: value => console.log(value),\n' +
      '    // onCompletePattern: value => console.log(value),\n' +
      '});';
  } catch (e) {
    customizedCode = '// Fix the errors above to generate the code';
    error = e.message;
  }

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
        <div>
          <Values form="textMask" />
        </div>
        <h2>Build your own</h2>
        {error && (
          <div className="buildError">
            <strong>Error: </strong>
            {error}
          </div>
        )}
        <div>
          <h3>Customized</h3>
          <Field
            name="customized"
            component="input"
            type="text"
            {...safeTextMask}
          />
        </div>
        <div>
          <h3>
            <small>
              using <strong>defaultMaskDefinitions</strong> (see above)
            </small>
          </h3>
          <Field
            name="pattern"
            component="input"
            type="text"
            placeholder="Pattern should not be empty"
            onChange={() => props.clearCustomValue()}
          />
        </div>
        <div>
          <div />
          <Field
            name="placeholder"
            component="input"
            type="text"
            placeholder="Placeholder should be a char"
            onChange={() => props.clearCustomValue()}
          />
        </div>
        <div>
          <div />
          <label>
            Show guide
            <Field
              name="guide"
              component="input"
              type="checkbox"
              onChange={() => props.clearCustomValue()}
            />
          </label>
        </div>
        <div>
          <div />
          <label>
            Strip mask
            <Field
              name="stripMask"
              component="input"
              type="checkbox"
              onChange={() => props.clearCustomValue()}
            />
          </label>
        </div>
      </form>
      <ResultCode />
      <Code source={customizedCode} />
    </App>
  );
};

const mapStateToProps = state =>
  selector(state, 'pattern', 'placeholder', 'guide', 'stripMask');

const mapDispatchToProps = dispatch => ({
  clearCustomValue: () => dispatch(change('textMask', 'customized', '')),
});

CreateTextMask = connect(mapStateToProps, mapDispatchToProps)(CreateTextMask);

export default reduxForm({
  form: 'textMask',
  initialValues: {
    pattern: '(999) 999-9999',
    placeholder: '_',
    guide: true,
    stripMask: true,
  },
})(CreateTextMask);
