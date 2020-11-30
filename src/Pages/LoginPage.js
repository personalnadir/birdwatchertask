import React from 'react';
import { connect } from 'react-redux';
// import { setLoginID } from './redux/dataactions';
// import checkLoginID from './serverlogin';
import {goToNextApplicationState} from '../redux/applicationactions';

class LoginPage extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			showButton: false
		};

		this.handleInput = this.handleInput.bind(this);
		this.handleButtonPress = this.handleButtonPress.bind(this);
	}

	handleInput(event) {
		this.setState({
			showButton: true,
			id: event.target.value
		});
	}

	handleButtonPress(event) {
		event.persist();
		this.props.handleLoginRequest(this.state.id);
	}

	render() {
		const button = this.state.showButton? <button onClick={this.handleButtonPress} className="ContinueButton">Continue</button>: null;

		return (
			<div className = "InstructionPage">
				<span className="TextEmphasis">Please enter the ID you have been given:</span>
				<br />
				<br />
				<br />
				<br />
				<div>
					<label htmlFor="name"><span className="TextSuperLarge">ID: </span></label>
					<input
						type="text"
						id="name"
						name="name"
						required
					    minLength="4"
					    maxLength="8"
					    size="10"
					    onInput = {this.handleInput}
					/>
				</div>
				<br />
				<br />
				{button}
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		handleLoginRequest: (id) => {
			// checkLoginID(id).then(ab => {
				// dispatch(setLoginID(id));
				dispatch(goToNextApplicationState());
			// }).catch(error => {
			// 	console.log(error);
			// });
		}
	};
};

export default connect(
	null,
	mapDispatchToProps
)(LoginPage);;