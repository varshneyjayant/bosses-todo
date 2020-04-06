export const AddUserValidator = {

    type: 'object',
    required: [ 'firstName', 'lastName', 'email', 'password' ],
    properties: {

        firstName: {
            type: 'string',
            minLength: 3,
            maxLength: 30
        },

        lastName: {

            type: 'string',
            minLength: 3,
            maxLength: 30
        },

        email: {

            type: 'string',
            format: 'email'
        },

        password: {

            type: 'string',
            minLength: 8,
            maxLength: 25,
            pattern: '^(?=.*[a-z])(?=.*[A-Z]).{8,25}$'
        }
    }
}