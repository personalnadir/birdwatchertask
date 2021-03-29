import React from 'react';
import cross from '../images/iti/fixation.png';
import {startTimeout} from '../redux/timeactions';
import {showStimulus} from '../redux/trialactions';
import { connect } from 'react-redux';
import {
  getITI
} from '../redux/selectors';

class ITIPage extends React.Component {
  componentDidMount() {
    this.props.startTimeout(this.props.iti);
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

const mapStateToProps = state => ({
  iti: getITI(state)
});

const mapDispathToProps = dispatch => {
  return {
    startTimeout: iti => dispatch(startTimeout(dispatch => dispatch(showStimulus()),iti))
  };
};

export default connect(
  mapStateToProps,
  mapDispathToProps
)(ITIPage);
