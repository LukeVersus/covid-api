export class ResponseGeneric<T> {
    data: T;
    message: string;
    error: string;
    constructor(data: T = null, message: string = "Ação realizada com sucesso.", error: string = null) {
        return {
            message,
            error,
            data
        }
    }
}