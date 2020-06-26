import jwt from 'express-jwt';
import { Request, Response, NextFunction } from 'express';

export class RESTAuthenticationMiddleware {

    static authenticate(req: Request, res: Response, next: NextFunction) {

        jwt({
            secret: process.env.OVERNIGHT_JWT_SECRET,
            userProperty: 'payload',
            getToken: function(req) {

                let token = null;

                //check if the token is available in cookie
                const authToken = req.cookies['auth-token'];
                if(authToken) {

                    token = authToken;
                }
                else{

                    //check if the token is available in the request header
                    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

                        token = req.headers.authorization.split(' ')[1];
                    }
                }

                return token;

            }
        })(req, res, next);
    }
}