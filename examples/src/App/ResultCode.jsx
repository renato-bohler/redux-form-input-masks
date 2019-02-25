import React from 'react';
import Package from '../../images/package.png';
import Rocket from '../../images/rocket.png';

export default props => (
  <h2 className="resultCode">
    Result code
    <img src={Package} alt="package" />
    <img src={Rocket} alt="rocket" />
  </h2>
);
