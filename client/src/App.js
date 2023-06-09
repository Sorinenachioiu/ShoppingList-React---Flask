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
    return groceries
      .filter(
        (item) =>
          (!selectedCategory || item.Category === selectedCategory) &&
          (!maxPrice || parseFloat(item.Price) <= parseFloat(maxPrice)) &&
          (!selectedShop || item.Shop === selectedShop) &&
          (!selectedName ||
            item.Name.toLowerCase().startsWith(selectedName.toLowerCase()))
      )
      .sort((a, b) => parseFloat(a.Price) - parseFloat(b.Price));
  };

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.ID === item.ID);
    if (existingItem) {
      const updatedCart = cart.map((cartItem) =>
        cartItem.ID === item.ID
          ? { ...cartItem, Quantity: cartItem.Quantity + 1 }
          : cartItem
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, Quantity: 1 }]);
    }
  };

  const cartTotal = () => {
    return cart
      .reduce((total, item) => total + parseFloat(item.Price) * item.Quantity, 0)
      .toFixed(2);
  };

  const reset = () => {
    setSelectedCategory('');
    setMaxPrice('');
    setCart([]);
  };

  const removeCartItem = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.ID === item.ID);
    if (existingItem.Quantity > 1) {
      const updatedCart = cart.map((cartItem) =>
        cartItem.ID === item.ID ? { ...cartItem, Quantity: cartItem.Quantity - 1 } : cartItem
      );
      setCart(updatedCart);
    } else {
      const updatedCart = cart.filter((cartItem) => cartItem.ID !== item.ID);
      setCart(updatedCart);
    }
  };

  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  const addItemAndShowMessage = (item) => {
    addToCart(item);
    
    // Cancel the previous timeout for the item, if any
    if (showMessage[item.ID]) {
      clearTimeout(showMessage[item.ID]);
    }
  
    // Set the message to be shown for the item
    setShowMessage({ ...showMessage, [item.ID]: true });
  
    // Set a new timeout to hide the message for the item
    const timeoutId = setTimeout(() => {
      setShowMessage((prevState) => {
        return { ...prevState, [item.ID]: false };
      });
    }, 550);
  
    // Update the timeoutId for the item
    setShowMessage((prevState) => {
      return { ...prevState, [item.ID]: timeoutId };
    });
  };
  

  //check
  const [selectedShop, setSelectedShop] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [showMessage, setShowMessage] = useState({});


  return (
    <div className="app">
      <h1>Grocery List</h1>
      <div className="filters">
        <label htmlFor="name-select">
          Product Name:
          <input type="text" value={selectedName} onChange={(e) => setSelectedName(e.target.value)} />
        </label>
        <label htmlFor="category-select">
          Category:
          <select className="category-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All</option>
            <option value="Fruit">Fruit</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Dairy">Dairy</option>
            <option value="Meat">Meat</option>
            <option value="Bakery">Bakery</option>
          </select>
        </label>
        <label htmlFor="Shop-select">
          Shop:
          <select className="Shop-select" value={selectedShop} onChange={(e) => setSelectedShop(e.target.value)}>
            <option value="">All</option>
            <option value="Gala">Gala</option>
            <option value="Jumbo">Jumbo</option>
            <option value="AH">AH</option>
            <option value="Flink">Flink</option>
          </select>
        </label>
        <label htmlFor="max-price-input">
          Max Price:
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </label>
        <button className="cart-toggle" onClick={toggleCartVisibility}>
          🛒
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Shop</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroceries().map((item) => (
            <tr key={item.ID}>
              <td>{item.ID}</td>
              <td>{item.Name}</td>
              <td>{item.Category}</td>
              <td>{item.Price}€</td>
              <td>{item.Shop}</td>
              <td>{item.Quantity}</td>
              <td>
                <div className="add-to-cart-container">
                  <button onClick={() => addItemAndShowMessage(item)}>Add to cart</button>
                  {showMessage[item.ID] && <span className="item-added-message">Item added!</span>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isCartVisible && (
        <div className="cart-popup">
          <button className="close-cart" onClick={() => setIsCartVisible(false)}>X</button>
          <h2>Shopping Cart</h2>
          <ul className="shopping-cart">
            {cart.map((item, index) => (
              <li key={index} className="shopping-cart-item">
                <div>
                  <h4>{item.Name}</h4>
                  <p className="shopping-cart-item-details">
                    {item.Quantity} x {item.Price}€
                  </p>
                </div>
                <button className="remove-from-cart" onClick={() => removeCartItem(item)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p className="shopping-cart-total">Total: €{cartTotal()}</p>
          <div className="shopping-cart-actions">
            <button onClick={reset} className="shopping-cart-reset">
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
