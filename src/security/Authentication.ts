import { ISecureRequest } from '@overnightjs/jwt';

export enum AuthResultTypes {

    SUCCESS, AUTHENTICATION_FAILED, USER_NOT_FOUND
}

export interface AuthenticationResult {

    status: AuthResultTypes;
    message: string;
    data: any;
}

export interface SessionUser {

    userId: string;
    name: string;
    email: string;
    role: string;
}

export class Authentication {

    static getSessionUserFromRequest(req: ISecureRequest): SessionUser {

        return <SessionUser>req.payload;
    }

    static getSessionUserIdFromRequest(req: ISecureRequest): string {

        const sessionUser = <SessionUser>req.payload;
        return sessionUser.userId;
    }
}