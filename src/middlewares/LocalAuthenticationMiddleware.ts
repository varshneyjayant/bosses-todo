import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthenticationResult, AuthResultTypes } from '../security/Authentication';
import { JwtManager } from '@overnightjs/jwt';
import { AppAuthenticationError } from './ErrorHandlerMiddleware';

const AuthCustomHeaders = {

    AUTH_TOKEN: "auth-token"
}

export class LocalAuthenticationMiddleWare {

    static initAuth(req: Request, res: Response, next: NextFunction) {

        passport.authenticate('local', { session: false }, (authResult: AuthenticationResult) => {

            if(authResult.status == AuthResultTypes.SUCCESS && authResult.data != null) {

                //confirm login
                req.logIn(authResult.data, { session: false }, (err) => {

                    if(err) next(err);

                    const jwtToken = JwtManager.jwt(authResult.data);
                    res.setHeader(AuthCustomHeaders.AUTH_TOKEN, jwtToken);

                    //forward request
                    next();
                })
            }
            else {

                next(new AppAuthenticationError());
            }
        })(req, res, next);
    }
}