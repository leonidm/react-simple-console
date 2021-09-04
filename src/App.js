import Console from "./Console/Console";

function App() {
  function commandHandler(cmd) {
    return `Command '${cmd}' executed`;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ margin: "auto" }}>Console</h3>
      <Console background="grey" fontColor="yellow" commandHandler={commandHandler} />
    </div>
  );
}

export default App;
