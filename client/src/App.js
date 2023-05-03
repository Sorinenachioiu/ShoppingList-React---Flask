import React, { useState, useEffect } from 'react';

function App() {
  const [groceries, setGroceries] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/groceries')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setGroceries(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

return (
  <div>
    <h1>Grocery List</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Brand</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {groceries.map(item => (
          <tr key={item.ID}>
            <td>{item.ID}</td>
            <td>{item.Name}</td>
            <td>{item.Category}</td>
            <td>{item.Price}</td>
            <td>{item.Brand}</td>
            <td>{item.Quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}

export default App;