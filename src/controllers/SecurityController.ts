import { Controller, Post, ClassErrorMiddleware, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import { ServiceResponseProvider } from './../app/ServiceResponse';
import { injectable } from 'inversify';
import {  ErrorHandlerMiddleware } from '../middlewares/ErrorHandlerMiddleware';
import { LocalAuthenticationMiddleWare } from '../middlewares/LocalAuthenticationMiddleware';

@injectable()
@Controller("security")
@ClassErrorMiddleware(ErrorHandlerMiddleware.handleError)
export class SecurityController{

    @Post("login")
    @Middleware(LocalAuthenticationMiddleWare.initAuth)
    private loginAppUser(req: Request, res: Response) {

        return res.status(OK).json(ServiceResponseProvider.createServiceResponse("Login Success"));
    }
}