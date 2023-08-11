
export function ResponseError(res , message,status) {
    res.status(status).json({ error:message,status });
}


export function ResponseSuccess(res, message,status,data) {
    res.status(status).json({ message,data,status });
}