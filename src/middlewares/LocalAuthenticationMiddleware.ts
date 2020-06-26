import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthenticationResult, AuthResultTypes } from '../security/Authentication';
import { AppAuthenticationError } from './ErrorHandlerMiddleware';
import jsonwebtoken from 'jsonwebtoken';


const AuthCustomHeaders = {

    AUTH_TOKEN: "auth-token",
    ACCESS_CONTROL_EXPOSE_HEADERS: "Access-Control-Expose-Headers"
}

export class LocalAuthenticationMiddleWare {

    static initAuth(req: Request, res: Response, next: NextFunction) {

        passport.authenticate('local', { session: false }, (authResult: AuthenticationResult) => {

            if(authResult.status == AuthResultTypes.SUCCESS && authResult.data != null) {

                //confirm login
                req.logIn(authResult.data, { session: false }, (err) => {

                    if(err) next(err);

                    const jwtToken =  jsonwebtoken.sign(authResult.data, process.env.OVERNIGHT_JWT_SECRET, {
                        expiresIn: process.env.OVERNIGHT_JWT_EXP
                    })
                    //set the cookie
                    res.cookie(AuthCustomHeaders.AUTH_TOKEN, jwtToken, {
                        maxAge: 24 * 60 * 3600 * 1000,
                        httpOnly: true,
                        //sameSite: "none"
                    })

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