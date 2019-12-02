const request = require('supertest');
const app = require('../app');

const {
  getDataFromFile,
  rewriteFile,
  getTodos,
  addTodo,
  removeTodo,
  toggleTodoCompletion
} = require('./todos');

const FILE_PATH = './data/todos.json';

describe('Getting todos from the file', () => {
  test('It should response with status code 404 when the file is empty', done => {
    // clear the file
    rewriteFile(FILE_PATH, '');
    request(app)
      .get('/todos')
      .then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });

  test('It should response with status 200 and return an array of data when the file not empty', done => {
    // rewrite file with data
    rewriteFile(FILE_PATH, [
      {
        id: '1',
        name: 'Do something',
        description: 'Need to do something later',
        createdAt: new Date(),
        done: false
      }
    ]);
    request(app)
      .get('/todos')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        done();
      });
  });
});

describe('Adding todos to the file', () => {
  test('It should response with status code 400 when user is authorized and params is not valid', done => {
    // clear the file
    rewriteFile(FILE_PATH, []);
    // add data to the file
    const newTodo = {
      name: '',
      description: 'some desc...'
    };
    request(app)
      .post('/todos')
      .type('form')
      .send(newTodo)
      .set('Authorization', 'authorized')
      .then(response => {
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('"name" is not allowed to be empty');
        done();
      });
  });

  test('It should response with status 403 when user is not authorized', done => {
    // clear the file
    rewriteFile(FILE_PATH, []);
    // add data to the file
    const newTodo = {
      name: 'new name',
      description: 'new desc'
    };
    request(app)
      .post('/todos')
      .type('form')
      .send(newTodo)
      .set('Authorization', 'not-authorized')
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });

  test('It should response with status 200 when user is authorized and data is valid', done => {
    // clear the file
    rewriteFile(FILE_PATH, []);
    // add data to the file
    const newTodo = {
      name: 'new name',
      description: 'new desc'
    };
    request(app)
      .post('/todos')
      .type('form')
      .send(newTodo)
      .set('Authorization', 'authorized')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Remove todos from the file', () => {
  test("It should response with status code 400 when the todo that need to be removed doesn't exist", done => {
    // rewrite file with data
    rewriteFile(FILE_PATH, [
      {
        id: '1',
        name: 'Do something',
        description: 'Need to do something later',
        createdAt: new Date(),
        done: false
      }
    ]);
    request(app)
      .delete('/todos/2')
      .set('Authorization', 'authorized')
      .then(response => {
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("Todo with this id: 2 doesn't exist.");
        done();
      });
  });

  test('It should response with status code 200 when the todo that need to be removed exists', done => {
    // rewrite file with data
    rewriteFile(FILE_PATH, [
      {
        id: '1',
        name: 'Do something',
        description: 'Need to do something later',
        createdAt: new Date(),
        done: false
      }
    ]);
    request(app)
      .delete('/todos/1')
      .set('Authorization', 'authorized')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Toggle completion of the todo', () => {
  test("It should response with status code 400 when the todo that need to be toggled doesn't exist", done => {
    // rewrite file with data
    rewriteFile(FILE_PATH, [
      {
        id: '1',
        name: 'Do something',
        description: 'Need to do something later',
        createdAt: new Date(),
        done: false
      }
    ]);
    request(app)
      .delete('/todos/2')
      .set('Authorization', 'authorized')
      .then(response => {
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("Todo with this id: 2 doesn't exist.");
        done();
      });
  });

  test('It should response with status code 200 when the todo that need to be toggle exists', done => {
    // rewrite file with data
    rewriteFile(FILE_PATH, [
      {
        id: '1',
        name: 'Do something',
        description: 'Need to do something later',
        createdAt: new Date(),
        done: false
      }
    ]);
    request(app)
      .delete('/todos/1')
      .set('Authorization', 'authorized')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
