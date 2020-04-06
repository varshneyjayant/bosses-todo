import ServerErrorMessages from '../../server-error-msgs.json';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-json-validator-middleware';
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes';
import { RequestJSONValidatorMiddleware } from './RequestJSONValidator';
import { Logger, LoggerFactory } from '../logger/Logger';


export interface ErrorResponse {

    message: any;
    requestId: string;
    errorTime: number;
    status: number
}

export class AppAuthenticationError extends Error { 

    constructor(msg?: string) {
        super();
        
        this.name = "AppAuthenticationError";
        if(msg) {
            this.message = msg;
        }
        else{
            this.message = ServerErrorMessages.AUTHENTICATION_FAILURE;
        }
    }
}

export class RequiredPermissionNotFoundError extends Error {

    constructor() {

        super();
        this.name = "RequiredPermissionNotFoundError";
    }
}

export class ServiceError extends Error {

    constructor(msg: any) {

        super();
        this.message = this.parseServiceErrors(msg);
        this.name = "ServiceError";
    }

    private parseServiceErrors(msg: any) {

        let errorMessage = msg;

        if(typeof msg == "object") {

            if(msg.name && msg.name == "MongoError") {

                errorMessage = msg.errmsg;
            }
        }
        return errorMessage;
    }
}

export class ErrorHandlerMiddleware {

    private static logger:Logger = LoggerFactory.getLogger(ErrorHandlerMiddleware.name);

    static handleError(error: Error, req: Request, res: Response, next: NextFunction) {

        const errorResponse = <ErrorResponse> {

            errorTime: Date.now(),
            message: ServerErrorMessages.INTERNAL_SERVER_ERROR,
            requestId: req.baseUrl,
            status: INTERNAL_SERVER_ERROR
        };

        if(error != null) {

            switch(error.name) {

                case "UnauthorizedError": {

                    errorResponse.status = UNAUTHORIZED;
                    errorResponse.message = ServerErrorMessages.UNAUTHORIZED;
                }
                break;

                case "AppAuthenticationError": {

                    errorResponse.status = UNAUTHORIZED;
                    errorResponse.message = error.message;
                }
                break;

                case "JsonSchemaValidationError": {

                    errorResponse.status = BAD_REQUEST;
                    errorResponse.message = ServerErrorMessages.VALIDATION_ERROR;

                    if(error instanceof ValidationError) {

                        errorResponse.message = RequestJSONValidatorMiddleware.parseValidationErrorMessages(error);
                    }
                }
                break;

                case "ServiceError": {

                    errorResponse.message = error.message;
                }
                break;

                case "RequiredPermissionNotFoundError": {

                    errorResponse.status = UNAUTHORIZED;
                    errorResponse.message = ServerErrorMessages.UNAUTHORIZED_ROLE;
                }
                break;
            }

            ErrorHandlerMiddleware.logger.error(error);
        }

        res.status(errorResponse.status).json(errorResponse);
    }
}