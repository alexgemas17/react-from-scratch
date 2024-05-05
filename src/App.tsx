/** @jsx j */
import { j } from "./react";
import { Counter } from "./Counter";
import { List } from "./List";

export default function App() {
  return (
    <main>
      <h1 className="title-header">Hello world!</h1>

      <div className="container">
        <div>
          <Counter title='First'/>
          <Counter title='second'/>
        </div>

        <List />
      </div>
    </main>
  );
}
