import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { createNumberMask } from '../../../src/index';
import { Code, Markdown, Values } from 'redux-form-website-template';
import { App, Demo, ResultCode } from '../App';
import documentation from './CreateNumberMask.md';
/** material-ui@next */
import { TextField } from 'redux-form-material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import { orange } from 'material-ui/colors';
import createPalette from 'material-ui/styles/createPalette';

const muiTheme = createMuiTheme({
  palette: createPalette({
    primary: orange,
    type: 'light',
  }),
});

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

const validation = value => (value > 10 ? 'Maximum value is 10' : '');

let CreateNumberMask = props => {
  // createNumberMask on try/catch to build custom mask
  let safeNumberMask;
  let customizedCode;
  let error;
  try {
    safeNumberMask = createNumberMask({
      prefix: props.prefix,
      suffix: props.suffix,
      decimalPlaces: props.decimalPlaces,
      stringValue: props.stringValue,
      allowNegative: props.allowNegative,
      showPlusSign: props.showPlusSign,
      spaceAfterSign: props.spaceAfterSign,
      locale: props.locale,
    });

    customizedCode =
      "import { createNumberMask } from 'redux-form-input-masks';\n\n" +
      'const myCustomNumberMask = createNumberMask({\n' +
      (props.prefix !== '' ? `    prefix: '${props.prefix}',\n` : '') +
      (props.suffix !== '' ? `    suffix: '${props.suffix}',\n` : '') +
      (props.decimalPlaces !== '0'
        ? `    decimalPlaces: ${props.decimalPlaces},\n`
        : '') +
      (props.stringValue !== false
        ? `    stringValue: ${props.stringValue},\n`
        : '') +
      (props.allowNegative !== false
        ? `    allowNegative: ${props.allowNegative},\n`
        : '') +
      (props.showPlusSign !== false
        ? `    showPlusSign: ${props.showPlusSign},\n`
        : '') +
      (props.spaceAfterSign !== false
        ? `    spaceAfterSign: ${props.spaceAfterSign},\n`
        : '') +
      (props.locale !== undefined ? `    locale: '${props.locale}',\n` : '') +
      '    // onChange: value => console.log(value),\n' +
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
        <h2>Validation</h2>
        <div>
          <h3>Maximum value is 10</h3>
          <MuiThemeProvider theme={muiTheme}>
            <Field
              name="material-ui-validation"
              component={TextField}
              type="tel"
              validate={validation}
              {...basic}
            />
          </MuiThemeProvider>
        </div>
        <div>
          <Values form="numberMask" />
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
            type="tel"
            {...safeNumberMask}
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
            <option value="">browser</option>
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
            <Field name="stringValue" component="input" type="checkbox" />
          </label>
        </div>
        <div>
          <div />
          <label>
            Allow negative values
            <Field name="allowNegative" component="input" type="checkbox" />
          </label>
        </div>
        <div>
          <div />
          <label>
            Show plus sign
            <Field name="showPlusSign" component="input" type="checkbox" />
          </label>
        </div>
        <div>
          <div />
          <label>
            Place a space after the sign
            <Field name="spaceAfterSign" component="input" type="checkbox" />
          </label>
        </div>
      </form>
      <ResultCode />
      <Code source={customizedCode} />
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
    prefix: '',
    suffix: '',
    stringValue: false,
    allowNegative: false,
    showPlusSign: false,
    spaceAfterSign: false,
  },
})(CreateNumberMask);
