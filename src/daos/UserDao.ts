import { BaseDao } from './BaseDao';
import { Schema, Model, Document, model } from 'mongoose';
import { User } from '../users/User';
import { BaseSchema } from './BaseDao';
import { DbActionResponse, DbHandler } from '../app/DbHandler';
import { injectable } from 'inversify';


export interface UserDto extends User, Document {}

@injectable()
export class UserDao extends BaseDao {

    private UserSchema: Schema;

    private UserModel: Model<UserDto>;

    constructor(){
        super();
    }

    protected registerModels() {

        this.UserModel = model<UserDto>(this.USER_COLLECTION, this.UserSchema);
    }

    protected registerSchemas() {

        this.UserSchema = new BaseSchema({

            userId: { type: String, required: true, unique: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String },
            role: { type: String, required: true }
        });
    }


    addUser(user: UserDto): Promise<DbActionResponse> {

        const _user = new this.UserModel(user);

        return new Promise<DbActionResponse>((resolve, reject) => {

            _user.save((err, savedUser) => {

                resolve(DbHandler.getDbActionResponse(err, savedUser));
            });
        });
    }

    getUserByEmail(email: string): Promise<DbActionResponse> {

        return new Promise<DbActionResponse>((resolve, reject) => {

            this.UserModel.findOne({ email: email }, (err, user) => {

                resolve(DbHandler.getDbActionResponse(err, user));
            });
        });
    }
}