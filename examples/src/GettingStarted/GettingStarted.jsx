import React from 'react';
import { App, Markdown } from '../App';
import documentation from './GettingStarted.md';

export default () => (
  <App>
    <Markdown content={documentation} />
  </App>
);
