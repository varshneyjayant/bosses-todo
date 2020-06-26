import { Controller, Post, ClassErrorMiddleware, ClassMiddleware, Middleware, Get } from '@overnightjs/core';
import { ISecureRequest, JwtManager } from '@overnightjs/jwt';
import { Response } from 'express';
import { injectable, inject } from 'inversify';
import { ErrorHandlerMiddleware } from '../middlewares/ErrorHandlerMiddleware';
import { User } from '../users/User';
import { UserService } from '../users/UserService';
import { TYPES } from '../app/Types';
import { OK } from 'http-status-codes';
import { ServiceResponseProvider } from '../app/ServiceResponse';
import { RequestJSONValidatorMiddleware, ValidationOptions } from '../middlewares/RequestJSONValidator';
import { AddUserValidator } from '../validators/UserValidator';
import jwt from 'express-jwt';

@injectable()
@Controller("user")
@ClassErrorMiddleware(ErrorHandlerMiddleware.handleError)
export class UserController {

    @inject(TYPES.UserService)
    private userService: UserService;

    @Post("")
    @Middleware(RequestJSONValidatorMiddleware.validateBody(<ValidationOptions>{
        schemaType: AddUserValidator
    }))
    private async addUser(req: ISecureRequest, res: Response) {

        const user = <User>req.body;
        user.createdBy = "ROOT";

        try{

            const userId = await this.userService.addUser(user);
            res.status(OK).json(ServiceResponseProvider.createServiceResponse(userId));
        }
        catch(err){

            ErrorHandlerMiddleware.handleError(err, req, res, null);
        }

        
    }
}