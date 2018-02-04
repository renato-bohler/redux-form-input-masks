import React from 'react';

export default props => (
  <h2 class="demoHeading">
    Demo
    {props.codesandbox && (
      <a href={`https://codesandbox.io/s/${props.codesandbox}`}>
        <img
          alt="Edit on CodeSandbox"
          src="https://codesandbox.io/static/img/play-codesandbox.svg"
        />
      </a>
    )}
  </h2>
);
