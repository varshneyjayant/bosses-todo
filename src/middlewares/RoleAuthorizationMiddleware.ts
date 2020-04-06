import { Response, NextFunction } from 'express';
import { ISecureRequest } from '@overnightjs/jwt';
import { SessionUser } from '../security/Authentication';
import { RequiredPermissionNotFoundError } from './ErrorHandlerMiddleware';

export class RoleAuthorizationMiddleware {

    static authorizeUser(userPermission: string){

        return(req: ISecureRequest, res: Response, next: NextFunction) => {

            const user = <SessionUser>req.payload;
            
            if(user.role == userPermission.trim()) {

                next();
            }
            else{

                next(new RequiredPermissionNotFoundError());
            }
        } 
    }
}