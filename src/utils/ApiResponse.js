import exp from "constants";
import { stat } from "fs";

class ApiResponse {
    constructor(
        statusCode,
        message = "Success",
        data = ""
    ){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}

export {ApiResponse};