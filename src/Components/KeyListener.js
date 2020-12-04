import React from 'react';

export default class KeyListener extends React.Component {

  constructor(props) {
    super(props);
    this.state = {keyPressed : null};
    this.handleKeyEvent = this.handleKeyEvent.bind(this);
    this.allowKeyPress = false;
  }

  handleKeyEvent(event) {
    if (!this.allowKeyPress) {
      return;
    }
    // We don't want to mess with the browser's shortcuts
    if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
      return;
    }

    const done = this.props.onKeyEvent(event.code);
    if (done) {
      this.cleanUp();
    }
  }

  cleanUp() {
    this.allowKeyPress = false;
    window.removeEventListener('keydown', this.handleKeyEvent);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyEvent);
    this.allowKeyPress = true;
  }

  componentWillUnmount() {
    this.cleanUp();
  }

  render() {
    return (
      <div className="Hidden">
        {this.state.keyPressed}
      </div>
    );
  }
}