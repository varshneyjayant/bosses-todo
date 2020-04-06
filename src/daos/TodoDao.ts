import { BaseDao, BaseSchema } from './BaseDao';
import { Todo } from '../todos/Todo';
import { Document, Schema, Model, model } from 'mongoose';
import { DbActionResponse, DbHandler } from '../app/DbHandler';
import { injectable } from 'inversify';


export interface TodoDto extends Todo, Document {};

@injectable()
export class TodoDao extends BaseDao {

    //schema
    private TodoSchema: Schema;

    //models
    private TodoModel: Model<TodoDto>;

    constructor() {

        super();
    }

    protected registerModels() {

        this.TodoModel = model<TodoDto>(this.TODO_COLLECTION, this.TodoSchema);
    }

    protected registerSchemas() {

        this.TodoSchema = new BaseSchema({

            todoId: { type: String, required: true, unique: true},
            title: { type: String, required: true },
            description: { type: String }
        });
    }

    addTodo(todo: TodoDto): Promise<DbActionResponse> {

        const _todo = new this.TodoModel(todo);

        return new Promise<DbActionResponse>((resolve, reject) => {

            _todo.save((err, savedTodo) => {

                resolve(DbHandler.getDbActionResponse(err, savedTodo));
            });
        });
    }

    getTodos(createdBy: string): Promise<DbActionResponse> {

        return new Promise<DbActionResponse>((resolve, reject) => {

            this.TodoModel.find({ createdBy: createdBy  }, (err, docs) => {

                resolve(DbHandler.getDbActionResponse(err, docs));
            });
        });
    }

    updateTodo(todo: TodoDto): Promise<DbActionResponse> {

        return new Promise<DbActionResponse>((resolve, reject) => {

            this.TodoModel.updateOne({ todoId: todo.todoId }, todo, (err, data) => {

                resolve(DbHandler.getDbActionResponse(err, data));
            });

        });
    }

    removeTodo(todoId: string): Promise<DbActionResponse> {


        return new Promise<DbActionResponse>((resolve, reject) => {

            this.TodoModel.deleteOne({ todoId: todoId }, (err) => {

                resolve(DbHandler.getDbActionResponse(err, err == null ? true: false));
            });
        });
    }

    checkIfTodoExists(todoId: string, createdBy: string): Promise<DbActionResponse> {

        return new Promise<DbActionResponse>((resolve, reject) => {

            this.TodoModel.exists({ todoId: todoId, createdBy: createdBy}, (err, status) => {

                resolve(DbHandler.getDbActionResponse(err, status));
            });
        });
    }
}