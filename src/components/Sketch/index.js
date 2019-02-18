import React from 'react';
import P5Wrapper from '../P5Wrapper';
import sketch from './sketch';

const Sketch = props => {
  const { background } = props;
  return (
    <P5Wrapper sketch={sketch} background={background} />
  );
}

export default Sketch;
