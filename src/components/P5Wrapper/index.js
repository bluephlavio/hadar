import React, { Component } from 'react';
import PropTypes from 'prop-types';
import p5 from 'p5';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class P5Wrapper extends Component {
  componentDidMount() {
    const { sketch } = this.props;
    this.canvas = new p5(sketch, this.wrapper);
  }

  componentWillUnmount() {
    this.canvas.remove();
  }

  render() {
    const { background, classes } = this.props;
    return (
      <div
        className={background ? classes.background : classes.foreground}
        ref={wrapper => this.wrapper = wrapper}
      />
    );
  }
}

P5Wrapper.propTypes = {
  sketch: PropTypes.func.isRequired,
};

export default withStyles(styles)(P5Wrapper);
