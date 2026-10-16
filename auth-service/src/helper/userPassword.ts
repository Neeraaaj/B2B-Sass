import bcrypt from "bcrypt";


async function hashPassword(pwd:string){
    const saltRounds = 10;
    const hashPwd = await bcrypt.hash(pwd, saltRounds);
    return hashPwd;
}

async function comparePassword(planTextPwd:string, hashPwd: string){
    const isValid = await bcrypt.compare(planTextPwd, hashPwd)
    return isValid ? true : false
}

export {
    hashPassword,
    comparePassword
}