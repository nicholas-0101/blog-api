import { sign } from "jsonwebtoken"

export const createToken = (account:any, expiresIn:any) => {
    return sign({
        id:account.id
    }, "secret", { // "secret" is the password for token
        expiresIn,
    })
}
