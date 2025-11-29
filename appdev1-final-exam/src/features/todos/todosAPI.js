import axios from "axios";

export const getTodosAPI = function () {
  return axios
    .get("https://jsonplaceholder.typicode.com/todos?_limit=10")
    .then(res => res.data);
}

export const addTodoAPI = function (todo) {
  return axios
    .post("https://jsonplaceholder.typicode.com/todos", todo, {
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.data);
}

export const updateTodoAPI = function (todo) {
  return axios
    .put(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, todo, {
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.data);
}

export const deleteTodoAPI = function (id) {
  return axios
    .delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
    .then(() => id);
}