import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Console extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enteredText: "",
      newText: "",
    };
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
      const { newText, enteredText } = this.state;
      let commandOutput = "";
      if (this.props.commandHandler) {
        commandOutput = this.props.commandHandler(newText);
      }
      this.setState({
        enteredText:
          enteredText +
          this.props.promptString +
          newText +
          "\n" +
          commandOutput +
          "\n",
        newText: "",
      });
    } else {
      this.setState({ newText: this.state.newText + e.key });
    }
  };

  render() {
    const { newText, enteredText } = this.state;
    return (
      <div>
        <textarea
          style={{
            width: "800px",
            height: "400px",
          }}
          value={enteredText + this.props.promptString + newText}
          onKeyPress={this.onKeyPress}
        />
      </div>
    );
  }
}
