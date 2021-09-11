# Simple Console React Component

Simple Console (command window inside a page) React component allowing define custom callback for issued commands.

## Install

```
npm install react-simple-console
```

## Usage

```
import Console from "react-simple-console"

<Console
        width="450"
        height="200"
        background="#11FA88"
        fontColor="red"
        promptString="%"
        commandHandler={(cmd) => `Command '${cmd}' executed.`}
      />
```
All parameters can be omitted. Defaults will be used.

Parameter ```commandHandler``` should return object, simple type or promise