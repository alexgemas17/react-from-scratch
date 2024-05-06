/** @jsx j */
import { CounterTitle } from "./CounterTitle";
import { j } from "./react";
import ReactDOM from "./react";

export function Counter ({ title }) {
  const [counter, setValue] = ReactDOM.useState(0);

  ReactDOM.useEffect(() => {
    console.log('Counter changed!', counter);
  }, [counter])

  const add = () => {
    setValue((prev) => prev + 1);
  }

  const subtract = () => {
    setValue((prev) => prev - 1);
  }

  return (
    <div className="counter">
      <h2>{title}</h2>
      <CounterTitle text={counter} />
      <div className="buttons-container">
        <button onClick={add}>+</button>
        <button onClick={subtract}>-</button>
      </div>
    </div>
  );
};
