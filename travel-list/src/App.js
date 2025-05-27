import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((curr) => [...curr, item]);
  }

  function handleDeleteItem(id) {
    setItems((curr) => curr.filter((item) => item.id !== id));
  }

  function handleUpdateItem(id) {
    setItems((curr) =>
      curr.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleClearList() {
    setItems([]);
  }
  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        items={items}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>Far Away</h1>;
}
function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = { description, quantity, packed: false, id: Date.now() };
    onAddItems(newItem);
    setDescription("");
    setQuantity(1);
  }
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}
function PackingList({ items, onDeleteItem, onUpdateItem, onClearList }) {
  const [sortBy, setSortBy] = useState("input");
  let sortedElements;

  if (sortBy === "description")
    sortedElements = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packed")
    sortedElements = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  if (sortBy === "input") sortedElements = items;

  if (sortBy === "quantity")
    sortedElements = items.slice().sort((a, b) => b.quantity - a.quantity);

  function confirmDelete() {
    const confirmation = window.confirm("Do you really want to delete?");
    if (confirmation) {
      onClearList();
    }
  }
  return (
    <div className="list">
      <ul className="">
        {sortedElements.map((item) => (
          <Item
            item={item}
            onUpdateItem={onUpdateItem}
            onDeleteItem={onDeleteItem}
            key={item.id}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by Input</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
          <option value="quantity">Sort by quantity</option>
        </select>
        <button onClick={confirmDelete}>Clear All</button>
      </div>
    </div>
  );
}
function Item({ item, onDeleteItem, onUpdateItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onUpdateItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}
function Stats({ items }) {
  if (!items.length) {
    return (
      <footer className="stats">
        <em>Start adding some items to your packing list 🎉</em>
      </footer>
    );
  }

  const numOfItems = items.length;
  const packed = items.filter((item) => item.packed).length;
  const percentage = Math.floor((packed / numOfItems) * 100);
  return (
    <footer className="stats">
      {percentage === 100 ? (
        <em>You have packed EVERYTHING 🎉</em>
      ) : (
        <em>
          You have {numOfItems} items on your list, and you already packed{" "}
          {packed} ({percentage}%)
        </em>
      )}
    </footer>
  );
}
