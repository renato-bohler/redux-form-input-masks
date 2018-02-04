import React from 'react';
import { Markdown } from 'redux-form-website-template';
import App from '../App/App';
import documentation from './GettingStarted.md';

export default () => (
  <App>
    <Markdown content={documentation} />
  </App>
);
