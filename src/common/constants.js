var commonConstants = {
    DATABASE_TABLES: {
        USER: "User ",
        TICKET: "Ticket ",
        CATEGORY: "Category ",
    },
    DATABASE_TABLE_CREATION: {
        SUCCESS: "Table created successfully.",
    },
    DATABASE_CONNECTION: {
        SUCCESS: "Database connection is successfully established.",
        FAILED: "Unable to connect to the database."
    },
    SERVER_CONNECTION: {
        SUCCESS: "SERVER IS RUNNING on PORT "
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

    PAYLOAD_VALIDATION: {
        KEY_NOT_PROVIDED: "Request is invalid."
    },

    //USER MODEL
    USER: {
        RETRIEVE: {
            SUCCESS: "User retrieved successfully.",
            FAILED: "Unable to retrieve user. ",
            NOT_FOUND: "No users found."
        },
        CREATE: {
            SUCCESS: "User created successfully.",
            FAILED: "Unable to create a user. ",
            ALREADY_EXISTS: "User already exists. Please try different email."
        },
        UPDATE: {
            SUCCESS: "User updated successfully.",
            FAILED: "Unable to update user. ",
            NO_CHANGE: "No changes were applied."
        },
        DELETE: {
            SUCCESS: "User deleted successfully.",
            FAILED: "Unable to delete user. "
        },
        SEND_EMAIL_VERIFICATION: {
            SUCCESS: "User account creation was sent to user's email.",
            FAILED: "Unable to send email upon creation. "
        },
        GOOGLE: {
            CREATE: {
                SUCCESS: "User created successfully.",
                FAILED: "Unable to create a user. "
            },
            CALLBACK: {
                FAILED: "Error during Google callback: "
            },
            AUTHENTICATION: {
                FAILED: "Error during Google authentication: "
            },
            CREDENTIAL: {
                DEFAULT_USER_PASSWORD: "google",
                DEFAULT_USER_ROLE: "user"
            }
        },
        AUTHORIZATION:{
            AUTHORIZED: "Please proceed user has been authorized.",
            UNAUTHORIZED: "User is not authorized to access."
        },
        ROLES: {
            SUPER_ADMIN: "Super Admin", // Create, Read, Update, Delete
            ADMIN: "Admin", // Read, Update (Assign)
            AGENT:"Agent" // Create, Read
        }
    },

    LOGIN: {
        SUCCESS: "User logged in successfully.",
        FAILED: "Invalid credentials. Please try again ..."
    },

    VERIFICATION: {
        SUCCESS: "User verified successfully.",
        EXPIRED: "User not verified. Verification token has expired.",
        INVALID: "Invalid credentials.",
        ALREADY_VERIFIED: "User is alread verified"
    },

    SEND_EMAIL: {
        SUCCESS: "Email sent successfully.",
        FAILED: "Email failed to send. ",
        ACCOUNT_VERIFICATION: "Account Verification",
    },

    EMAIL_TYPES: {
        ACCOUNT_VERIFICATION: "Account Verification",
        REQUEST_TOKEN: "Request Token",
        UPDATE_PASSWORD: "Update Password",
        FORGOT_PASSWORD: "Forgot Password",
        TICKET_DETAILS: "Ticket Details"
    },

    TICKET: {
        RETRIEVE: {
            SUCCESS: "Ticket retrieved successfully.",
            FAILED: "Unable to retrieve ticket. ",
            NOT_FOUND: "No tickets found."
        },
        CREATE: {
            SUCCESS: "Ticket created successfully.",
            FAILED: "Unable to create a ticket. "
        },
        UPDATE: {
            SUCCESS: "Ticket updated successfully.",
            FAILED: "Unable to update ticket. ",
        },
        PRIORITY: {
            HIGH: "High",
            MEDIUM: "Medium",
            LOW: "Low"
        },
        STATUS: {
            OPEN: "Open",
            IN_PROGRESS: "In Progress",
            CLOSED: "Closed"
        },
        ERROR_MESSAGE: {
            TICKET_ALREADY_CLOSED: "Ticket is already closed."
        }
    },
    CATEGORY: {
        RETRIEVE: {
            SUCCESS: "Category retrieved successfully.",
            FAILED: "Unable to retrieve category. ",
            NOT_FOUND: "No categories found."
        },
        CREATE: {
            SUCCESS: "Category created successfully.",
            FAILED: "Unable to create a category. "
        },
    },

    TOKEN: {
        NO_TOKEN: "Invalid request. No token provided.",
        INVALID: "Invalid token. Please login again.",
        UNAUTHORIZED: "Unauthorized request.",
        TOKEN_EXPIRED: "Token has expired. Please log"
    },
}

module.exports = commonConstants