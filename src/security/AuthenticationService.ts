import { AuthenticationResult } from './Authentication';

export interface AuthenticationService {

    authenticateUserWithEmailAndPassword(email: string, password: string): Promise<AuthenticationResult>
    
    registerPassportAuthWithLocalStrategy();
}