import React from 'react';
import P5Wrapper from '../P5Wrapper';
import sketch from './sketch';

const Background = () => {
  return (
    <P5Wrapper sketch={sketch} background />
  );
}

export default Background;
