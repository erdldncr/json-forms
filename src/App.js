import logo from "./logo.svg";
import "./App.css";
import { Route, Router, Switch } from "react-router-dom";
import Home from "./Home";
import Dynamic from "./Dynamic";
function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact={true} component={Home} />
        <Route path="/dynamic" component={Dynamic} />
      </Switch>
    </div>
  );
}

export default App;
