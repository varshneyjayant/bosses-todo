export const AddTodoValidator = {

    type: 'object',
    required: [ 'title' ],
    properties: {

        title: {
            type: 'string',
            minLength: 4,
            maxLength: 60
        },

        description: {

            type: 'string',
            minLength: 4,
            maxLength: 250
        }
    }
}

export const UpdateTodoValidator = {


    type: 'object',
    required: [ 'todoId', 'title' ],
    properties: {

        todoId: {
            type: 'string',
            format: 'uuid'
        },

        title: {
            type: 'string',
            minLength: 4,
            maxLength: 60
        },

        description: {

            type: 'string',
            minLength: 4,
            maxLength: 250
        }
    }
}