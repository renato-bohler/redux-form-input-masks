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
          <div className="buttons">
            <a
              class="github-button"
              href="https://github.com/renato-bohler/redux-form-input-masks"
              data-icon="octicon-star"
              data-size="large"
              data-show-count="true"
              aria-label="Star renato-bohler/redux-form-input-masks on GitHub"
            >
              Star
            </a>
            <a
              class="github-button"
              href="https://github.com/renato-bohler/redux-form-input-masks/subscription"
              data-icon="octicon-eye"
              data-size="large"
              data-show-count="true"
              aria-label="Watch renato-bohler/redux-form-input-masks on GitHub"
            >
              Watch
            </a>
          </div>
          <div className="menu">
            <Link to="/">Getting started</Link>
            {' | '}
            <Link to="/number-mask">Number mask</Link>
            {' | '}
            <Link to="/text-mask">Text mask</Link>
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
