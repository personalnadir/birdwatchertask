import React from 'react';
import { connect } from 'react-redux';
import {getUserID} from '../redux/selectors';
import {downloadDataSet} from '../databasetocsvfile';

class EndPage extends React.Component {

	componentDidMount() {
		downloadDataSet(this.props.user);
	}

	render() {
		return (
			<div className = "InstructionPage">
				<span className="TextEmphasis">Please download the data file and e-mail it to: email@email.com</span>
			</div>
		);
	}
};

const mapStateToProps = (state, ownProps) => {
	return {
		user: getUserID(state)
	};
};

export default connect(
	mapStateToProps,
	null
)(EndPage);
