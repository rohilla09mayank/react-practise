import { use, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selected, setSelected] = useState("");

  function handleAddFriend(item) {
    setFriends((curr) => [...curr, item]);
  }

  function handleSelect(friend) {
    setSelected(friend);
  }

  function handleBillSettle(updatedPerson) {
    setFriends((curr) =>
      curr.map((item) => (item.id === updatedPerson.id ? updatedPerson : item))
    );
    setSelected("");
  }

  return (
    <div className="app">
      <Sidebar
        onAddFriend={handleAddFriend}
        friends={friends}
        onSelect={handleSelect}
      />
      <BillSplitForm selected={selected} onBillSettle={handleBillSettle} />
    </div>
  );
}

function Sidebar({ friends, onAddFriend, onSelect }) {
  return (
    <div className="sidebar">
      <ul>
        {friends.map((friend) => (
          <Person friend={friend} key={friend.id} onSelect={onSelect} />
        ))}
      </ul>
      <AddFriend onAddFriend={onAddFriend} />
    </div>
  );
}

function BillSplitForm({ selected, onBillSettle }) {
  const [billValue, setBillValue] = useState(0);
  const [yourExpense, setYourExpense] = useState(0);
  const [whoPaid, setWhoPaid] = useState(0);

  function calculateBill(e) {
    e.preventDefault();

    if (whoPaid) selected.balance -= Number(yourExpense);
    if (!whoPaid)
      selected.balance =
        selected.balance + Number(billValue) - Number(yourExpense);

    setBillValue(0);
    setYourExpense(0);

    onBillSettle(selected);
  }

  if (selected === "") return;
  return (
    <form className="form-split-bill" onSubmit={calculateBill}>
      <h2>Split bill with {selected.name}</h2>
      <label>💰 Bill Value</label>
      <input
        type="number"
        value={billValue}
        onChange={(e) => setBillValue(e.target.value)}
      />
      <label>🙋🏻 Your Expense</label>
      <input
        type="number"
        value={yourExpense}
        onChange={(e) => setYourExpense(e.target.value)}
      />
      <label>🧟 {selected.name}'s Expense</label>
      <input type="number" value={billValue - yourExpense} disabled={true} />
      <label>💳 Who is paying the bill?</label>
      <select value={whoPaid} onChange={(e) => setWhoPaid(e.target.value)}>
        <option value={0}>You</option>
        <option value={1}>{selected.name}</option>
      </select>
      <button className="button">Split Bill</button>
    </form>
  );
}

function Person({ friend, onSelect }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you {friend.balance}
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      <button className="button" onClick={() => onSelect(friend)}>
        Select
      </button>
    </li>
  );
}

function AddFriend({ onAddFriend }) {
  const random = Math.floor(Math.random() * 900000) + 100000;
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [img, setImg] = useState(`https://i.pravatar.cc/48?u=${random}`);

  function AddingFriend(e) {
    e.preventDefault();
    const newFriend = { id: Date.now(), name, image: img, balance: 0 };
    setName("");

    setImg(
      `https://i.pravatar.cc/48?u=${
        Math.floor(Math.random() * 900000) + 100000
      }`
    );
    onAddFriend(newFriend);
  }

  return (
    <>
      {isOpen && (
        <form className="form-add-friend" onSubmit={AddingFriend}>
          <label>👯 Friend Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>📸 Image Url</label>
          <input
            type="text"
            value={img}
            onChange={(e) => setImg(e.target.value)}
          />
          <button className="button">Add</button>
        </form>
      )}
      <button className="button" onClick={() => setIsOpen((o) => !o)}>
        {isOpen ? "Close" : "Add Friend"}
      </button>
    </>
  );
}
