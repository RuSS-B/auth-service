import {Service} from "typedi";
import bcrypt from "bcryptjs";

@Service()
export default class PasswordManager {
    public async isValid(plainPassword: string, hash: string) {
        return await bcrypt.compare(plainPassword, this.fromSymfonyHash(hash));
    }

    private fromSymfonyHash(password: string) {
        return /^\$2y\$/.test(password) ? "$2a$" + password.slice(4) : password;
    }

    public async generate(plainPassword: string) {
        return await bcrypt.hash(plainPassword, 10);
    }
}
