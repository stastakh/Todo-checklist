module.exports = class Todo {
  constructor(todo) {
    this.id = todo.id;
    this.name = todo.name;
    this.description = todo.description;
    this.createdAt = new Date();
    this.done = false;
  }
};
