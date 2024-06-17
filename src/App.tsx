/** @jsx j */
import { j } from "./react";
import { Counter } from "./Counter";
import { List } from "./List";
import { FetchExample } from "./FetchExample";

export default function App() {
  return (
    <main>
      <h1 className="title-header">Hello world!</h1>

      <div className="container">
        <Counter title="Counter" />
        <FetchExample />
        <List />
      </div>
    </main>
  );
}
