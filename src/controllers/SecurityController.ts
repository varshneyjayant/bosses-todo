import { Controller, Post, ClassErrorMiddleware, Middleware, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import { ServiceResponseProvider } from './../app/ServiceResponse';
import { injectable } from 'inversify';
import {  ErrorHandlerMiddleware } from '../middlewares/ErrorHandlerMiddleware';
import { LocalAuthenticationMiddleWare } from '../middlewares/LocalAuthenticationMiddleware';
import {  ISecureRequest } from '@overnightjs/jwt';
import { RESTAuthenticationMiddleware } from '../middlewares/RESTAuthenticationMiddleware';

@injectable()
@Controller("security")
@ClassErrorMiddleware(ErrorHandlerMiddleware.handleError)
export class SecurityController{

    @Post("login")
    @Middleware(LocalAuthenticationMiddleWare.initAuth)
    private loginAppUser(req: Request, res: Response) {

        return res.status(OK).json(ServiceResponseProvider.createServiceResponse("Login Success"));
    }

    @Get("check")
    @Middleware(RESTAuthenticationMiddleware.authenticate)
    private userSessionHealthCheck(req: ISecureRequest, res: Response) {

        return res.status(OK).send();
    }
    
}