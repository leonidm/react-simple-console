import React, { Component, createRef } from "react";
import PropTypes from "prop-types";

export default class Console extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enteredText: "",
      command: "",
    };
    this.ref = createRef();
  }

  static propTypes = {
    promptString: PropTypes.string,
    commandHandler: PropTypes.func,
  };

  static defaultProps = {
    promptString: ">",
    commandHandler: (cmd) => "executed",
  };

  componentDidMount() {}

  onKeyPress = (e) => {
    if (e.key === "Enter") {
      this.handleEnterKey();
    } else {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const cmd = this.state.command;
      let { start, end } = this.getSelectionInCommand(selectionStart, selectionEnd);
      if (end < 0) return;
      if (start < 0) start = 0;
      const newCommand = cmd.substring(0, start) + e.key + cmd.substring(end);
      this.setState({ command: newCommand }, () => {
        this.ref.current.selectionStart = this.ref.current.selectionEnd = selectionStart + 1;
      });
    }
  };

  onKeyDown = (e) => {
    console.log(e.keyCode);
    switch (e.keyCode) {
      case 8: //backspace
        this.handleBackspaceKey(e);
        break;
      case 9: //tab
        break;
      case 46: //delete
        this.handleDeleteKey(e);
        break;
      default:
        break;
    }
  };

  getSelectionInCommand(selectionStart, selectionEnd) {
    const staticTextLength = this.state.enteredText.length + this.props.promptString.length;
    const start = selectionStart - staticTextLength;
    const end = selectionEnd - staticTextLength;
    return { start, end };
  }

  handleDeleteKey(e) {
    e.preventDefault();
    const { selectionStart, selectionEnd } = e.target;
    const { command, enteredText } = this.state;

    // calculate start and end in the command string
    const staticTextLength = enteredText.length + this.props.promptString.length;
    let { start, end } = this.getSelectionInCommand(selectionStart, selectionEnd);
    if (end < 0) return;
    if (start < 0) start = 0;

    let newCommand; // after delete
    if (end > start) {
      newCommand = command.substring(0, start) + command.substring(end);
    } else {
      //start == end
      newCommand = command.substring(0, start) + command.substring(end + 1);
    }
    let newSelectionStart =
      selectionStart < staticTextLength ? staticTextLength : selectionStart;

    this.setState({ command: newCommand }, () => {
      this.ref.current.selectionStart = this.ref.current.selectionEnd = newSelectionStart;
    });
  }

  handleBackspaceKey(e) {
    e.preventDefault();
    const { selectionStart, selectionEnd } = e.target;
    const { command } = this.state;

    // calculate start and end in the command string
    let { start, end } = this.getSelectionInCommand(selectionStart, selectionEnd);
    if (end < 0) return;
    if (start < 0) start = 0;

    let newCommand; // after backspace
    if (end > start) {
      newCommand = command.substring(0, start) + command.substring(end);
    } else if (start > 0) {
      //start == end
      newCommand = command.substring(0, start - 1) + command.substring(end);
    } else {
      return;
    }
    let newSelectionStart = start < end ? selectionStart : selectionStart - 1;

    this.setState({ command: newCommand }, () => {
      this.ref.current.selectionStart = this.ref.current.selectionEnd = newSelectionStart;
    });
  }

  handleEnterKey() {
    const { command, enteredText } = this.state;
    let commandOutput = "";
    if (this.props.commandHandler) {
      commandOutput = this.props.commandHandler(command);
    }
    this.setState({
      enteredText:
        enteredText + this.props.promptString + command + "\n" + commandOutput + "\n",
      command: "",
    });
  }

  render() {
    const { command, enteredText } = this.state;
    return (
      <div>
        <textarea
          ref={this.ref}
          style={{
            width: "800px",
            height: "400px",
          }}
          value={enteredText + this.props.promptString + command}
          onKeyPress={this.onKeyPress}
          onKeyDown={this.onKeyDown}
        />
      </div>
    );
  }
}
