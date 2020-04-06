import { Validator, ValidationError } from 'express-json-validator-middleware';
import { Request, Response, NextFunction } from 'express';

export interface RequestJSONValidationError {

    errors: any
}

export interface ValidationOptions{

    schemaType: any;
}

export class RequestJSONValidatorMiddleware {

    private static validateFn: any;

    static initValidator() {

        const _validator = new Validator({ allErrors: true });
        RequestJSONValidatorMiddleware.validateFn = _validator.validate;
    }

    static validateBody(options: ValidationOptions) {

        return(req: Request, res: Response, next: NextFunction) => {
            
            RequestJSONValidatorMiddleware.validateFn({ body: options.schemaType})(req, res, next);
            
        }
    }

    static validateQuery(options: ValidationOptions) {

        return(req: Request, res: Response, next: NextFunction) => {
            
            RequestJSONValidatorMiddleware.validateFn({ query: options.schemaType})(req, res, next);
            
        }
    }

    static parseValidationErrorMessages(error: ValidationError): any {

        const requestValidationError = <RequestJSONValidationError>{};

        if(error.validationErrors) {

            requestValidationError.errors = error.validationErrors.body;
        }
        return requestValidationError;
    }
}