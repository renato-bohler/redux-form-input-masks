import React from 'react';
import { Markdown } from 'redux-form-website-template';
import { App } from '../App';
import changelog from '../../../CHANGELOG.md';

const Changelog = () => (
  <App>
    <div className="path">
      <a href="https://github.com/renato-bohler/redux-form-input-masks">
        redux-form-input-masks
      </a>
      <a href="https://github.com/renato-bohler/redux-form-input-masks/blob/master/CHANGELOG.md">
        CHANGELOG
      </a>
    </div>
    <h1>Changelog</h1>
    <Markdown content={changelog} />
  </App>
);

export default Changelog;
