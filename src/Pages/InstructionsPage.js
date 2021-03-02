import React from 'react';
import { connect } from 'react-redux';
import {
	goToNextApplicationState,
	nextInstructionPage,
 } from '../redux/applicationactions';
 import {
	getInstructionsPage
 } from '../redux/selectors';

const pages = [
	{page: <p>A scientist is looking for patterns in the migration of birds. Your job is to help him. Birds will appear one after another, and he wants you to take a pictures when you spot a particular pattern in their sequence (for example: a red on followed by a green one.)</p>},
	{page: <p>We will always tell you what pattern to look for. Every few birds, there will be a new pattern to watch for. When you spot the pattern, press your photograph button to take a picture! Otherwise press the appropriate button to skip that bird. We'll tell you which button is which on each trial. The birds can appear in any order, including several of the same colour in a row. A new bird will appear every two seconds or so.</p>, progressToNextApplicationState: true},
	{page: <p>Text for the start of the randomised trials</p>, progressToNextApplicationState: true},
	{page: <p>Text for the start of the non randomised trials</p>, progressToNextApplicationState: true}
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
		page: getInstructionsPage(state)
	};
};

const mapDispatchToProps = dispatch => {
	return {
		nextPage: (goToNextAppState) => {
			if (goToNextAppState) {
				dispatch(goToNextApplicationState());
			}
			dispatch(nextInstructionPage());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(InstructionsPage);
