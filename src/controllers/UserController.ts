import { Controller, Post, ClassErrorMiddleware, ClassMiddleware, Middleware } from '@overnightjs/core';
import { ISecureRequest, JwtManager } from '@overnightjs/jwt';
import { Response } from 'express';
import { injectable, inject } from 'inversify';
import { ErrorHandlerMiddleware } from '../middlewares/ErrorHandlerMiddleware';
import { User } from '../users/User';
import { UserService } from '../users/UserService';
import { TYPES } from '../app/Types';
import { OK } from 'http-status-codes';
import { ServiceResponseProvider } from '../app/ServiceResponse';

@injectable()
@Controller("secure/user")
@ClassErrorMiddleware(ErrorHandlerMiddleware.handleError)
@ClassMiddleware(JwtManager.middleware)
export class UserController {

    @inject(TYPES.UserService)
    private userService: UserService;

    @Post("")
    private async addUser(req: ISecureRequest, res: Response) {

        const user = <User>req.body;
        user.createdBy = "ROOT";

        const userId = await this.userService.addUser(user);
        res.status(OK).json(ServiceResponseProvider.createServiceResponse(userId));
    }
}