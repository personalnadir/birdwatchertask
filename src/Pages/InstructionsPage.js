import React from 'react';
import { connect } from 'react-redux';
import { goToNextApplicationState } from '../redux/applicationactions';

const pages = [
	{page: <p>Hello</p>, progressToNextApplicationState: true}
];

class InstructionsPage extends React.Component{
	componentDidUpdate() {
		window.scrollTo(0, 0);
	}

	render() {
		const {page, nextPage} = this.props;
		const instructionPage = pages[page];
		const buttonClick = () => {
			if (instructionPage.endTask) {
				window.confirm("You can close the window, thanks!");
				return;
			}
			nextPage(instructionPage.progressToNextApplicationState);
		};
		return (
			<div>
				{instructionPage.page}
				<button onClick={buttonClick} className="ContinueButton">Continue</button>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		page: 0
	};
};

const mapDispatchToProps = dispatch => {
	return {
		nextPage: (goToNextAppState) => {
			if (goToNextAppState) {
				dispatch(goToNextApplicationState());
			}
			// dispatch(nextPage());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(InstructionsPage);
