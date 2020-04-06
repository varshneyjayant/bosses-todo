import { describe, it, before } from 'mocha';
import chai, { expect } from 'chai';
import { MongoConnectionMock } from '../__mocks__/DbConnectionMock';
import { appConfigMock } from '../__mocks__/AppConfigMock';
import { IocContainer } from '../../inversify.config';
import { Todo } from '../../src/todos/Todo';
import { UserService } from '../../src/users/UserService';
import { TYPES } from '../../src/app/Types';
import { TodoService } from '../../src/todos/TodoService';
import { User } from '../../src/users/User';
import { v4 as uuidv4 } from 'uuid';
import { ServiceError } from '../../src/middlewares/ErrorHandlerMiddleware';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('performs operation on TodoService', () => {

    let appConfig = appConfigMock;
    let userId = null;
    let todos = [];

    const userService = IocContainer.get<UserService>(TYPES.UserService);
    const todoService = IocContainer.get<TodoService>(TYPES.TodoService); 

    before(async () => {

        //mock db connection
        await MongoConnectionMock.mockConnection();

        //create an new user
        const user = <User> {

            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@gmail.com',
            password: 'JohnDoe@123',
            role: 'Todo_Access',
            createdBy: 'Test_ROOT'
        }

        userId = await userService.addUser(user);
    });

    it('addTodo', async () => {

        const todo = <Todo> {

            createdBy: userId,
            description: 'Todo Description 1',
            title: 'Todo 1'
        }

        todos = await todoService.addTodo(todo);

        expect(todos.length).to.eq(1);
    });

    it('addOneMoreTodo', async () => {

        const todo = <Todo> {

            createdBy: userId,
            title: 'Todo 2'
        };

        todos = await todoService.addTodo(todo);
        expect(todos.length).to.eq(2);
    });

    it('getTodos', async () => {

        todos = await todoService.getTodos(userId);

        expect(todos.length).to.eq(2);
    });

    it('updateTodo', async() => {

        const todo:Todo = todos[1];
        todo.title = 'Todo 1.5',
        todo.modifiedBy = userId;

        todos = await todoService.updateTodo(todo);

        expect(todos[1].title).to.eq('Todo 1.5');
    });

    it('removeTodo', async () => {

        //let us two more todo, then we will delete the first todo
        const todo1 = <Todo> {

            createdBy: userId,
            title: 'Todo 3'            
        };

        todos = await todoService.addTodo(todo1);

        expect(todos.length).to.eq(3);

        const todo2 = <Todo> {

            createdBy: userId,
            title: 'Todo 4'            
        }; 
        
        todos = await todoService.addTodo(todo1);
        expect(todos.length).to.eq(4);

        //now delete the first item
        todos = await todoService.removeTodo((<Todo>todos[0]).todoId, userId);

        expect(todos.length).to.eq(3);
    });

    it('remove Not found', () => {

        const _todoId = uuidv4();

        expect(todoService.removeTodo(_todoId, userId )).to.eventually.throw(ServiceError);

    });

})