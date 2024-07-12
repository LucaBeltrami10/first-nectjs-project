import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scriypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scriypt)

@Injectable()
export class AuthService {
    constructor(private userService: UsersService){}

    async signup(email: string, password: string){
        // See if email is in use
        const users = await this.userService.find(email);
        if(users.length){
            throw new BadRequestException('email is uso');
        }
        // Hash the users pasword
        // Generate a salt
        const salt = randomBytes(8).toString('hex');
        // Hash the salt and password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        // Join the hashd result and the salt together
        const result = salt + '.' + hash.toString('hex');
        // Create a new user and save it
        const user = await this.userService.create(email, result)
        
        // return user
        return user
    }

    async signin(email: string, password: string){
        const [user] = await this.userService.find(email);
        if(!user){
            throw new NotFoundException('user not found')
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer

        if( storedHash !== hash.toString('hex')){
            throw new BadRequestException('bad password')
        }

        return user;
    }

    /* async signin(email: string, password: string){
        const user = await this.userService.find(email)
        console.log(email, password, user[0])
        if(!user){
            throw new BadRequestException('email non esistente, registrati!');
        }
        const usersPassword = user[0].password;
        const [salt, hasedPassword] = usersPassword.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        const result = salt + '.' + hash.toString('hex');

        if(result === usersPassword){
            console.log('true')
            return true
        }else{
            console.log('true')
            return false
        }
    } */

}