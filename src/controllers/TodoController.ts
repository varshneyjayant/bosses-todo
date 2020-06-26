import { Controller, Post, Put, Get, Delete, ClassErrorMiddleware, ClassMiddleware, Middleware } from '@overnightjs/core';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { injectable, inject } from 'inversify';
import { ErrorHandlerMiddleware } from '../middlewares/ErrorHandlerMiddleware';
import { RoleAuthorizationMiddleware } from '../middlewares/RoleAuthorizationMiddleware';
import { RequestJSONValidatorMiddleware, ValidationOptions } from '../middlewares/RequestJSONValidator';
import { AddTodoValidator, UpdateTodoValidator } from '../validators/TodoValidator';
import { TodoService } from '../todos/TodoService';
import { TYPES } from '../app/Types';
import { Todo } from '../todos/Todo';
import { Authentication } from '../security/Authentication';
import { ServiceResponseProvider } from '../app/ServiceResponse';
import { OK } from 'http-status-codes';
import { RESTAuthenticationMiddleware } from '../middlewares/RESTAuthenticationMiddleware';

//makes this controller injectable
@injectable()
//creates a route for the controllers
@Controller("secure/todo")
//register common route error middleware
@ClassErrorMiddleware(ErrorHandlerMiddleware.handleError)
//register common route middleware
@ClassMiddleware(RESTAuthenticationMiddleware.authenticate)
export class TodoController {

    @inject(TYPES.TodoService)
    private todoService: TodoService;

    @Post("")
    @Middleware([
        RoleAuthorizationMiddleware.authorizeUser("Todo_Access"),
        RequestJSONValidatorMiddleware.validateBody(<ValidationOptions>{
            schemaType: AddTodoValidator
        })
    ])
    private async addTodo(req: ISecureRequest, res: Response) {

        const todo = <Todo>req.body;
        todo.createdBy = Authentication.getSessionUserIdFromRequest(req);

        try{

            const todos = await this.todoService.addTodo(todo);
            res.status(OK).json(ServiceResponseProvider.createServiceResponse(todos));
        }
        catch(err){

            ErrorHandlerMiddleware.handleError(err, req, res, null);
        }
        
    }

    @Get("")
    @Middleware(RoleAuthorizationMiddleware.authorizeUser("Todo_Access"))
    private async getTodo(req: ISecureRequest, res: Response) {

        const ownerId = Authentication.getSessionUserIdFromRequest(req);
        
        try{

            const todos = await this.todoService.getTodos(ownerId);
            res.status(OK).json(ServiceResponseProvider.createServiceResponse(todos));
        }
        catch(err){

            ErrorHandlerMiddleware.handleError(err, req, res, null);
        }
    }

    @Put("")
    @Middleware([
        RoleAuthorizationMiddleware.authorizeUser("Todo_Access"),
        RequestJSONValidatorMiddleware.validateBody(<ValidationOptions>{
            schemaType: UpdateTodoValidator
        })
    ])
    private async updateTodo(req: ISecureRequest, res: Response) {

        const todo = <Todo>req.body;
        todo.modifiedBy = Authentication.getSessionUserIdFromRequest(req);

        try{

            const todos = await this.todoService.updateTodo(todo);
            res.status(OK).json(ServiceResponseProvider.createServiceResponse(todos));
        }
        catch(err){

            ErrorHandlerMiddleware.handleError(err, req, res, null);
        }
    }

    @Delete(":todoId")
    @Middleware(RoleAuthorizationMiddleware.authorizeUser("Todo_Access"))
    private async removeTodo(req: ISecureRequest, res: Response) {

        const todoId = req.params.todoId;
        const ownerId = Authentication.getSessionUserIdFromRequest(req);

        try{
            
            const todos = await this.todoService.removeTodo(todoId, ownerId);
            res.status(OK).json(ServiceResponseProvider.createServiceResponse(todos));
        }
        catch(err){

            ErrorHandlerMiddleware.handleError(err, req, res, null);
        }
    }
}