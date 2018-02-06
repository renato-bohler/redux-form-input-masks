import React from 'react';
import { Link } from 'react-router-dom';
import { version } from '../../../package.json';
import Prism from './prism';

export default class App extends React.Component {
  componentDidMount() {
    // we need this in order to work with routers
    Prism.highlightAll();
  }

  render() {
    return (
      <div>
        <div className="header">
          <div className="title">
            redux-form-<span className="ourselves">input-masks</span>
            <span className="version">@{version}</span>
          </div>
          <div className="subtitle">
            Input masking with redux-form made easy
          </div>
          <div className="menu">
            <Link to="/">Getting started</Link>
            {' | '}
            <Link to="/number-mask">Number mask</Link>
            {' | '}
            <Link to="/more">More examples</Link>
          </div>
        </div>
        <div className="contentContainer">
          <div className="content">{this.props.children}</div>
          <div className="footer">
            Created by{' '}
            <a href="https://github.com/renato-bohler">Renato Böhler</a>
          </div>
        </div>
      </div>
    );
  }
}
