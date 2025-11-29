import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// Import Redux actions
import { addTodo, updateTodo, deleteTodo, fetchTodos } from "../features/todos/todosSlice";
import "../main.css";
import "../corner.css";

// --- 1. CUSTOM HOOK for Local Storage (Kept for Theme State ONLY) ---
// This is used ONLY for the theme preference, not for the todo list.
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key “" + key + "”: ", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error setting localStorage key “" + key + "”: ", error);
    }
  };
  return [storedValue, setValue];
};

// --- 2. HELPER COMPONENT for <head> Content ---
const HeadContent = () => (
  <head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#062e3f" />
    <meta name="Description" content="A dynamic and aesthetic To-Do List WebApp." />
    <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300&display=swap" rel="stylesheet" />
    <link 
      rel="stylesheet" 
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css" 
      integrity="sha256-46r060N2LrChLLb5zowXQ72/iKKNiw/lAmygmHExk/o=" 
      crossOrigin="anonymous" 
    />
    <link rel="shortcut icon" type="image/png" href="assets/favicon.png" />
    <link rel="stylesheet" href="CSS/main.css" />
    <link rel="stylesheet" href="CSS/corner.css" />
    <title>JUST DO IT</title>
  </head>
);

// --- 3. MAIN APPLICATION COMPONENT (ToDoApp) ---
const ToDoApp = () => {
  // --- REDUX SETUP ---
  const dispatch = useDispatch();
  // SELECT todos from the Redux store based on your slice structure { items: [] }
  const todos = useSelector((state) => state.todos.items); 
  
  // --- LOCAL STATE ---
  const [input, setInput] = useState("");
  const [theme, setTheme] = useLocalStorage("savedTheme", "standard");
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  // --- EFFECT: Load Initial Todos and Theme ---
  useEffect(() => {
    // 1. Fetch Todos when component mounts
    dispatch(fetchTodos());
    
    // 2. Set Theme (Theme logic kept from previous steps)
    document.body.className = theme;
      
    const titleElement = document.getElementById("title");
    if (titleElement) {
      if (theme === "darker") {
        titleElement.classList.add("darker-title");
      } else {
        titleElement.classList.remove("darker-title");
      }
    }
  }, [dispatch, theme]); // Added dispatch and theme to dependency array

  // --- EFFECT: Time Tracking ---
  useEffect(() => {
    const updateTime = () => {
      const options = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true
      };
      setCurrentTime(new Date().toLocaleString('en-US', options));
    };

    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);


  // --- HANDLERS (Dispatching Redux actions) ---

  const handleThemeChange = (newColor) => {
    setTheme(newColor);
  };

  const handleAddToDo = (event) => {
    event.preventDefault();
    const todoText = input.trim();
    if (todoText === "") {
      alert("You must write something!");
      return;
    }

    // Dispatch the Redux addTodo thunk with the title
    dispatch(addTodo(todoText)); 
    setInput("");
  };
  
  const handleAction = (todoId, action, completed) => {
    if (action === "delete") {
      // Dispatch the deleteTodo thunk
      dispatch(deleteTodo(todoId)); 
    } else if (action === "check") {
      // Dispatch the updateTodo thunk with the required format: { id, completed: !completed }
      const updatedTodo = { id: todoId, completed: !completed };
      dispatch(updateTodo(updatedTodo)); 
    }
  };


  // --- RENDER ---
  return (
    <>
      <HeadContent />
      <body>
        {/* Header and Theme Selectors */}
        <div id="header">
          <div className="flexrow-container">
            <div className="standard-theme theme-selector" onClick={() => handleThemeChange("standard")}></div>
            <div className="light-theme theme-selector" onClick={() => handleThemeChange("light")}></div>
            <div className="darker-theme theme-selector" onClick={() => handleThemeChange("darker")}></div>
          </div>
          <h1 id="title">
            Just do it.
            <div id="border"></div>
          </h1>
        </div>


        {/* Input Form */}
        <div id="form">
          <form onSubmit={handleAddToDo}>
            <input 
              className={`${theme}-input todo-input`}
              type="text" 
              placeholder="Add a task."
              value={input}
              onChange={(e) => setInput(e.target.value)} // Allows typing
            />
            <button className={`todo-btn ${theme}-button`} type="submit">
              I Got This!
            </button>
          </form>
        </div>

        {/* GitHub Corner and Time Display */}
        <div className="version">
          <div className="demo version-section">
            <a href="https://github.com/lordwill1/todo-list" className="github-corner">
              {/* SVG icon for GitHub corner (unchanged) */}
              <svg width="80" height="80" viewBox="0 0 250 250" style={{ fill: '#151513', color: '#fff', position: 'absolute', top: 0, border: 0, left: 0, transform: 'scale(-1, 1)' }}>
                <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
                <path 
                  d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" 
                  fill="currentColor" 
                  style={{ transformOrigin: '130px 106px' }} 
                  className="octo-arm"
                ></path>
                <path 
                  d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" 
                  fill="currentColor" 
                  className="octo-body"
                ></path>
              </svg>
            </a>
          </div>
          <div>
            <p>
              <span id="datetime">{currentTime}</span>
            </p>
          </div>
        </div>

        {/* The To-Do List */}
        <div id="myUnOrdList">
          <ul className="todo-list">
            {/* Map over Redux state (todos) */}
            {todos.map((todo) => (
              <div 
                key={todo.id} 
                className={`todo ${theme}-todo ${todo.completed ? 'completed' : ''}`}
              >
                <li className="todo-item">{todo.title}</li> {/* Use todo.title based on your addTodo thunk */}
                
                {/* Check Button */}
                <button 
                  className={`check-btn ${theme}-button`} 
                  onClick={() => handleAction(todo.id, "check", todo.completed)} 
                >
                  <i className="fas fa-check"></i>
                </button>
                
                {/* Delete Button */}
                <button 
                  className={`delete-btn ${theme}-button`} 
                  onClick={() => handleAction(todo.id, "delete")}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </ul>
        </div>
      </body>
    </>
  );
};

export default ToDoApp;