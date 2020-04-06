import { AuthenticationService } from './AuthenticationService';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { AuthenticationResult, AuthResultTypes, SessionUser } from './Authentication';
import { User } from '../users/User';
import { UserService } from '../users/UserService';
import { EncryptionUtils } from '../utils/EncryptionUtils';
import { injectable, inject } from 'inversify';
import { TYPES } from '../app/Types';

@injectable()
export class AuthenticationServiceImpl implements AuthenticationService {

    @inject(TYPES.UserService)
    private userService: UserService;

    async authenticateUserWithEmailAndPassword(email: string, password: string): Promise<AuthenticationResult> {

        const authResult = <AuthenticationResult> {
            data: null
        };

        try {

            const user: User = await this.userService.getUserForAuthentication(email);

            if(user != null) {

                //now we will compare passwords
                if(EncryptionUtils.comparePlainTextWithEncryptedValue(password, user.password)) {

                    authResult.data = <SessionUser> {

                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`,
                        role: user.role,
                        userId: user.userId
                    };

                    authResult.status = AuthResultTypes.SUCCESS;

                }
                else{

                    authResult.status = AuthResultTypes.AUTHENTICATION_FAILED;
                }
            }
            else{

                authResult.status = AuthResultTypes.USER_NOT_FOUND;
            }
        }
        catch(err){

            throw err;
        }

        return authResult;
    }

    registerPassportAuthWithLocalStrategy() {

        passport.use(new Strategy({

            usernameField: "email",
            passwordField: "password",
        }, async (email: string, password: string, done: any) => {

            const authResult = await this.authenticateUserWithEmailAndPassword(email, password);
            done(authResult);
        } 
        
        ));
    }
}