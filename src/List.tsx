/** @jsx j */
import ReactDOM, { j } from "./react";

function ListItem({text, callback}) {
  return <li><span>{text}</span>  <button onClick={() => callback(text)}>X</button></li>
}

export function List() {
  const [list, setState] = ReactDOM.useState(['Item 1', 'Item 2','Item 3','Item 4'])

  function addItem() {
    setState(prev => [...prev, `item ${list.length + 1}`])
  }

  function removeItem(item) {
    setState(prev => prev.filter(p => p !== item))
  }

  return (
    <div className="list-container">
      <button onClick={addItem}>Add item</button>
      {
        list && 
        list.map((l) => {
          return <ListItem text={l} callback={removeItem} />
        })
      }
    </div>
  )
}
