import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { createNumberMask } from '../../../src/index';
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

const validation = value => value > 10 ? 'Maximum value is 10' : '';

let MoreExamples = () => {
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
      </form>
      <Values form="moreExamples" />
    </App>
  );
};

export default reduxForm({
  form: 'moreExamples',
})(MoreExamples);
