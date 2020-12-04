import React from 'react';
import cross from '../images/iti/fixation.png';
import {startTimeout} from '../redux/timeactions';
import {showStimulus} from '../redux/trialactions';
import { connect } from 'react-redux';

class ITIPage extends React.Component {
  componentDidMount() {
    this.props.startTimeout();
  }

  render() {
    return (
      <img
          alt="Fixation Cross"
          src={cross}
        />
    );
  }
}

const mapDispathToProps = dispatch => {
  return {
    startTimeout: () => dispatch(startTimeout(dispatch => dispatch(showStimulus()),1000))
  };
};

export default connect(
  null,
  mapDispathToProps
)(ITIPage);
