import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import TodoService from "../services/TodoServices";

const todoService = new TodoService();

export const useTodoStore = defineStore("todoStore", {
  state: () => ({
    todos: [],
  }),
  getters: {
    getAllTodos() {
      return this.todos.filter((todo) => todo.status !== "Completed");
    },
    getAllCompletedTodos() {
      return this.todos.filter((todo) => todo.status === "Completed");
    },
    getTodo: (state) => {
      return (id) => state.todos.find((todo) => todo.id === id);
    },
  },
  actions: {
    addTodo(todo) {
      this.todos.push(todo);
    },
    updateTodo(data) {
      const filteredTodos = this.todos.filter((todo) => todo.id !== data.id);
      const newTodo = {
        id: uuidv4(),
        name: data.name,
        status: todoService.isOverdue(data.due) ? "Overdue" : "Pending",
        due: data.due,
        checked: false,
      };
      this.todos = [...filteredTodos, newTodo];
    },
    duplicateTodo(data) {
      const newTodo = {
        id: uuidv4(),
        name: data.name,
        status: todoService.isOverdue(data.due) ? "Overdue" : "Pending",
        due: data.due,
        checked: false,
      };
      this.todos = [...this.todos, newTodo];
    },
    deleteTodo(id) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
    },
    markAsCompleted(id) {
      this.todos = this.todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            status: "Completed",
          };
        } else {
          return todo;
        }
      });
    },
  },
});
