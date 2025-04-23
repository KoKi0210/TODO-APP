import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userIdFilter, setUserIdFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('none');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(data => {
        setTodos(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
        setLoading(false);
      });
  }, []);

  const handleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: true } : todo
    ));
  };

  const handleUncomplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: false } : todo
    ));
  };

  const filteredTodos = userIdFilter === 'all' 
    ? todos 
    : todos.filter(todo => todo.userId === parseInt(userIdFilter));

  const uncompletedTodos = filteredTodos.filter(todo => !todo.completed);
  const completedTodos = filteredTodos.filter(todo => todo.completed);

  const sortedUncompletedTodos = [...uncompletedTodos];
  if (sortOrder === 'asc') {
    sortedUncompletedTodos.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOrder === 'desc') {
    sortedUncompletedTodos.sort((a, b) => b.title.localeCompare(a.title));
  }

  if (loading) {
    return <div>Loading todos...</div>;
  }

  return (
    <div className="app">
      <div className="controls">
        <div className="filter">
          <label htmlFor="user-filter">Filter by User ID:</label>
          <select 
            id="user-filter" 
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
          >
            <option value="all">All Users</option>
            {[...new Set(todos.map(todo => todo.userId))].map(userId => (
              <option key={userId} value={userId}>User {userId}</option>
            ))}
          </select>
        </div>
        <div className="sort">
          <label htmlFor="sort-order">Sort Uncompleted Todos:</label>
          <select 
            id="sort-order" 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="none">None</option>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
      </div>

      <div className="todo-container">
        <div className="todo-column">
          <h2>Uncompleted Todos</h2>
          <ul>
            {sortedUncompletedTodos.map(todo => (
              <li key={todo.id}>
                <span>{todo.title} (User {todo.userId})</span>
                <button onClick={() => handleComplete(todo.id)}>Complete</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="todo-column">
          <h2>Completed Todos</h2>
          <ul>
            {completedTodos.map(todo => (
              <li key={todo.id}>
                <span>{todo.title} (User {todo.userId})</span>
                <button onClick={() => handleUncomplete(todo.id)}>Uncomplete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;