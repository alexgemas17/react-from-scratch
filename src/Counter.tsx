/** @jsx j */
import { CounterTitle } from "./CounterTitle";
import { j } from "./react";
import ReactDOM from "./react";

export function Counter ({ title }) {
  const [counter, setValue] = ReactDOM.useState(0);

  const add = () => {
    setValue((prev) => prev + 1);
  }

  const subtract = () => {
    setValue((prev) => prev - 1);
  }

  return (
    <div>
      <h2>{title}</h2>
      <CounterTitle text={counter} />
      <div className="buttons-container">
        <button onClick={add}>+</button>
        <button onClick={subtract}>-</button>
      </div>
    </div>
  );
};
