var commonConstants = {
    DATABASE_CONNECTION: {
        SUCCESS: "Database connection is successfully established.",
        FAILED: "Unable to connect to the database."
    },
    SERVCER_CONNECTION: {
        SUCCESS: "SERVER IS RUNNING on PORT"
    },

    PAGINATION: {
        LIMIT: 10,
        PAGE: 1,
        INVALID_PAGE_NUMBER: "Invalid page number. Max number is: "
    },

    //HTTP ERRORS
    STATUS_CODE: {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500,
        NOT_IMPLEMENTED: 501,
        BAD_GATEWAY: 502,
        SERVICE_UNAVAILABLE: 503,
        GATEWAY_TIMEOUT: 504,
    },

    //USER MODEL
    USER: {
        RETRIEVE: {
            SUCCESS: "User retrieved successfully.",
            FAILED: "Unable to retrieve user. "
        },
        CREATE: {
            SUCCESS: "User created successfully.",
            FAILED: "Unable to create a user. "
        }
    }
}

module.exports = commonConstants