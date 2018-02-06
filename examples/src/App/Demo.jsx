import React from 'react';

export default props => (
  <h2 className="demoHeading">
    Demo
    {props.codesandbox && (
      <a href={`https://codesandbox.io/s/${props.codesandbox}`} target="_blank">
        <img
          alt="Edit on CodeSandbox"
          src="https://codesandbox.io/static/img/play-codesandbox.svg"
        />
      </a>
    )}
  </h2>
);
