import React from 'react';
import { Link } from 'react-router-dom';
import { version } from '../../../package.json';

export default props => (
  <div>
    <div className="header">
      <div className="title">
        redux-form-<span class="ourselves">input-masks</span>
        <span class="version">@{version}</span>
      </div>
      <div className="subtitle">Input masking with redux-form made easy</div>
      <div className="menu">
        <Link to="/">Getting started</Link>
        {' | '}
        <Link to="/number-mask">Number mask</Link>
      </div>
    </div>
    <div className="contentContainer">
      <div className="content">{props.children}</div>
      <div className="footer">
        Created by <a href="https://github.com/renato-bohler">Renato Böhler</a>
      </div>
    </div>
  </div>
);
