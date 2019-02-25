import React from 'react';
import { Markdown } from 'redux-form-website-template';
import { App } from '../App';
import migrating from '../../../MIGRATING.md';

const Migrating = () => (
  <App>
    <div className="path">
      <a href="https://github.com/renato-bohler/redux-form-input-masks">
        redux-form-input-masks
      </a>
      <a href="https://github.com/renato-bohler/redux-form-input-masks/blob/master/MIGRATING.md">
        MIGRATING
      </a>
    </div>
    <Markdown content={migrating} />
  </App>
);

export default Migrating;
