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
        style={{width: '500px', color: 'red', background: '#11FA88'}}
        promptString="%"
        commandHandler={(cmd) => `Command '${cmd}' executed.`}
      />
```
All parameters can be omitted. Defaults will be used.

Parameter ```commandHandler``` should return object, simple type or promise