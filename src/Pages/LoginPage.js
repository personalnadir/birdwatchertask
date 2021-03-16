import React from 'react';
import { connect } from 'react-redux';
import { setUserID } from '../redux/dataactions';
import {counterBalanceTrials} from '../redux/taskactions';
import {goToNextApplicationState} from '../redux/applicationactions';
import Url from 'url-parse';
import qs from 'querystringify';

class LoginPage extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			showButton: false
		};

		this.handleInput = this.handleInput.bind(this);
		this.handleButtonPress = this.handleButtonPress.bind(this);
	}

	componentDidMount() {
		const url = new Url(window.location.href);
		if (url.query) {
			const query = qs.parse(url.query);
			if (query.PROLIFIC_PID) {
				this.props.handleLoginRequest(query.PROLIFIC_PID);
			}
		}
	}

	handleInput(event) {
		this.setState({
			showButton: !event.target.validity.patternMismatch,
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
					    size="16"
					    pattern="[0-9a-fA-F]+"
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
			dispatch(setUserID(id));
			const parsed = Number.parseInt(id, 16);
			dispatch(counterBalanceTrials(parsed));
			dispatch(goToNextApplicationState());
		}
	};
};

export default connect(
	null,
	mapDispatchToProps
)(LoginPage);;