export class ApiError extends Error {
    constructor ( 
        statusCode,
        message = "Some error founds",
        errors = [],
        stack = ""

    ){ 
        super(message),

        this.data = null
        this.statusCode = statusCode
        this.message = message
        this.errors = errors
        
        if (stack) {
            this.stack = stack
          } else {
            Error.captureStackTrace(this, this.construtor)
          }
    
    }
}