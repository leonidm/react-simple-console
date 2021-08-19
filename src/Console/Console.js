import React, { Component } from "react";

export default class Console extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allText: ">",
    };
  }

  componentDidMount() {}

  onChange = (e) => {
    const newText = e.target.value;
    this.setState({ allText: newText });
  };

  render() {
    return (
      <div>
        <textarea value={this.state.allText} onChange={this.onChange} />
      </div>
    );
  }
}
