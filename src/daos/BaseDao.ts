import { Schema, SchemaDefinition } from 'mongoose';
import { injectable } from 'inversify';

export interface BaseDto {

    createdOn: number,
    modifiedOn: number,
    createdBy: string,
    modifiedBy: string
}

@injectable()
export class BaseSchema<T = any> extends Schema {

    constructor(definition?: SchemaDefinition) {

        super(BaseSchema.getExtendedSchema(definition));
    }

    private static getExtendedSchema(definition: SchemaDefinition): SchemaDefinition {

        const baseSchemaFields = {

            createdOn: { type: String, default: Date.now },
            createdBy: { type: String, required: true },
            modifiedBy: String,
            modifiedOn: String,
        };

        if(definition && definition != null) {

            return { ...definition, baseSchemaFields };
        }
        else {

            return baseSchemaFields;
        }
    }
}

export abstract class BaseDao {

    //all collections
    protected readonly USER_COLLECTION = "users";
    protected readonly TODO_COLLECTION = "todos";

    constructor() {

        this.registerSchemas();
        this.registerModels();
    }

    protected abstract registerSchemas();
    protected abstract registerModels();

}