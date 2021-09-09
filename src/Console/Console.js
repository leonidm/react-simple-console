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

  componentDidMount() {
    this.ref.current.addEventListener("keyup", this.ensureValidCaretPosition.bind(this));
    this.ref.current.addEventListener("click", this.ensureValidCaretPosition.bind(this));
  }

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
    if (e.ctrlKey && !e.altKey && !e.shiftKey) {
      switch (e.key) {
        case "c":
          this.copySelectionToClipboard();
          break;
        case "v":
          //console.log(e.target.selectionStart, e.target.selectionEnd);
          this.pasteSelectionFromClipboard();
          break;
        default:
          break;
      }
    }
  };

  copySelectionToClipboard() {
    const { selectionStart, selectionEnd, value } = this.ref.current;
    if (selectionStart < selectionEnd) {
      const selectedText = value.slice(selectionStart, selectionEnd);
      navigator.clipboard.writeText(selectedText);
    }
  }

  pasteSelectionFromClipboard() {
    const { selectionStart, selectionEnd } = this.ref.current;
    navigator.clipboard.readText().then((textFromClipboard) => {
      textFromClipboard = textFromClipboard.replace(/\r/g, "");
      const { command } = this.state;
      let { start, end } = this.getSelectionInCommand(selectionStart, selectionEnd);
      if (end < 0) return;
      if (start < 0) start = 0;
      const newCommand = command.substring(0, start) + textFromClipboard + command.substring(end);

      this.setState({ command: newCommand }, () => {
        this.ref.current.selectionStart = this.ref.current.selectionEnd =
          this.getStaticTextLength() + start + textFromClipboard.length;
      });
    });
  }

  ensureValidCaretPosition(e) {
    // check if there is no selection and caret position is too small set it to minimal valid
    const { selectionStart, selectionEnd } = e.target;
    const noSelection = selectionEnd === selectionStart;
    if (noSelection) {
      const minimalValidPosition = this.getStaticTextLength();
      if (selectionStart < minimalValidPosition) {
        e.target.selectionStart = e.target.selectionEnd = minimalValidPosition;
      }
    }
  }

  getStaticTextLength() {
    return this.state.enteredText.length + this.props.promptString.length;
  }

  getSelectionInCommand(selectionStart, selectionEnd) {
    const staticTextLength = this.getStaticTextLength();
    const start = selectionStart - staticTextLength;
    const end = selectionEnd - staticTextLength;
    return { start, end };
  }

  handleDeleteKey(e) {
    e.preventDefault();
    const { selectionStart, selectionEnd } = e.target;
    const { command } = this.state;

    // calculate start and end in the command string
    const staticTextLength = this.getStaticTextLength();
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
    let newSelectionStart = selectionStart < staticTextLength ? staticTextLength : selectionStart;

    this.setState({ command: newCommand }, () => {
      this.ref.current.selectionStart = this.ref.current.selectionEnd = newSelectionStart;
    });
  }

  handleBackspaceKey(e) {
    e.preventDefault();
    const { selectionStart, selectionEnd } = e.target;
    const { command } = this.state;

    // calculate start and end in the command string
    const staticTextLength = this.getStaticTextLength();
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
    let newSelectionStart =
      start < end
        ? selectionStart < staticTextLength
          ? staticTextLength
          : selectionStart
        : selectionStart - 1;

    this.setState({ command: newCommand }, () => {
      this.ref.current.selectionStart = this.ref.current.selectionEnd = newSelectionStart;
    });
  }

  handleEnterKey() {
    function setCommandOutput(commandOutput) {
      _this.setState({
        enteredText:
          enteredText + _this.props.promptString + command + "\n" + commandOutput + "\n\n",
        command: "",
      });
    }
    const { command, enteredText } = this.state;
    const _this = this;
    if (this.props.commandHandler) {
      const promiseOrValue = this.props.commandHandler(command);
      Promise.resolve(promiseOrValue)
        .then(function (value) {
          setCommandOutput(value);
        })
        .catch(function (err) {
          setCommandOutput(err);
        });
    }
  }

  isPromise(v) {
    return typeof v === "object" && typeof v.then === "function";
  }

  render() {
    const { command, enteredText } = this.state;
    const { height, width, background, fontColor, promptString } = this.props;
    return (
      <textarea
        spellCheck="false"
        ref={this.ref}
        style={{
          width: width + "px",
          height: height + "px",
          backgroundColor: background,
          color: fontColor,
        }}
        value={enteredText + promptString + command}
        onKeyPress={this.onKeyPress}
        onKeyDown={this.onKeyDown}
        onChange={() => {}}
      />
    );
  }
}

Console.propTypes = {
  promptString: PropTypes.string,
  commandHandler: PropTypes.func,
  background: PropTypes.string,
  fontColor: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

Console.defaultProps = {
  promptString: ">",
  commandHandler: (cmd) => "Command executed.",
  background: "black",
  fontColor: "white",
  width: 600,
  height: 300,
};
