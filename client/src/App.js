// src/App.js
import React, { useState, useEffect } from 'react';
// import './index.css';

function App() {
  const [groceries, setGroceries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/groceries')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setGroceries(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const filteredGroceries = () => {
    return groceries.filter(item =>
      (!selectedCategory || item.Category === selectedCategory) &&
      (!maxPrice || parseFloat(item.Price) <= parseFloat(maxPrice))
    );
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const cartTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.Price), 0).toFixed(2);
  };

  return (
    <div>
      <h1>Grocery List</h1>
      <div>
        <label>
          Category:
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All</option>
          {/* Update the categories to match your data */}
          <option value="Fruit">Fruit</option>
          <option value="Vegetable">Vegetable</option>
        </select>
        </label>
        <label>
          Max Price:
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Brand</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroceries().map(item => (
            <tr key={item.ID}>
              <td>{item.ID}</td>
              <td>{item.Name}</td>
              <td>{item.Category}</td>
              <td>{item.Price}</td>
              <td>{item.Brand}</td>
              <td>{item.Quantity}</td>
              <td>
                <button onClick={() => addToCart(item)}>Add to cart</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Shopping Cart</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.Name} - {item.Price}
            </li>
          ))}
        </ul>
        <p>Total: ${cartTotal()}</p>
      </div>
    </div>
  );
}

export default App;
