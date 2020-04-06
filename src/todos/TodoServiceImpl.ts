import { TodoService } from './TodoService';
import { Todo } from './Todo';
import { TodoDto, TodoDao } from '../daos/TodoDao';
import { v4 as uuidv4 } from 'uuid';
import { ServiceError } from '../middlewares/ErrorHandlerMiddleware';
import { injectable, inject } from 'inversify';
import { TYPES } from '../app/Types';

@injectable()
export class TodoServiceImpl implements TodoService {

    @inject(TYPES.TodoDao)
    private todoDao: TodoDao;

    private async checkIfTodoExists(todoId: string, ownerId: string) {

        const dbActionResponse = await this.todoDao.checkIfTodoExists(todoId, ownerId);

        if(dbActionResponse.err != null) throw new ServiceError(dbActionResponse.err);
        else if( !dbActionResponse.data) return false;
        else return true;
    }

    async addTodo(todo: Todo): Promise<Todo[]> {

        const todoDto = <TodoDto>todo;

        todoDto.todoId = uuidv4();

        const dbActionResponse  = await this.todoDao.addTodo(todoDto);

        if(dbActionResponse.err != null) throw new ServiceError(dbActionResponse.err);
        else {

            //get all todos
            return await this.getTodos(todo.createdBy);
        }
    }

    async getTodos(ownerId: string): Promise<Todo[]> {

        let todos = [];

        const dbActionResponse = await this.todoDao.getTodos(ownerId);

        if(dbActionResponse.err != null) throw new ServiceError(dbActionResponse.err);
        else{

            return dbActionResponse.data;
        }
    }

    async updateTodo(todo: Todo): Promise<Todo[]> {

        const todoDto = <TodoDto>todo;
        todoDto.modifiedOn = Date.now();

        //lets us check if todo exists
        if(await this.checkIfTodoExists(todo.todoId, todo.modifiedBy)) {

            //now update todo
            const dbActionResponse_update = await this.todoDao.updateTodo(todoDto);

            if(dbActionResponse_update.err != null) throw new ServiceError(dbActionResponse_update.err);
            else {

                return await this.getTodos(todo.modifiedBy);
            }
        }
        else{

            throw new ServiceError("Todo not found");
        }

    }

    async removeTodo(todoId: string, ownerId: string): Promise<Todo[]> {

        if(await this.checkIfTodoExists(todoId, ownerId)) {

             const dbActionResponse = await this.todoDao.removeTodo(todoId);

             if(dbActionResponse.err ! = null) throw new ServiceError(dbActionResponse.err);
             else {

                return await this.getTodos(ownerId);
             }
        }
        else{

            throw new ServiceError("Todo not found");
        }

    }
}