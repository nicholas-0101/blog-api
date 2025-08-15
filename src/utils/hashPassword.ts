import { genSalt, hash } from "bcrypt";

export const hashPassword = async (password:string) => {
    const salt = await genSalt(10); // default value genSalt
    return await hash(password, salt);
}