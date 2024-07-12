import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException  } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUserService: Partial<UsersService>;

    beforeEach(async () => {
    //Cretae a fake copy of UserService
    const users: User[]= [];
    fakeUserService = {
        find: (email: string) => {
            const filteredUser = users.filter(user => user.email === email)
            return Promise.resolve(filteredUser);
        },
        create: (email: string, password: string) => {
            const user ={id: (Math.random() * 9999), email, password} as User
            users.push(user);
            return Promise.resolve(user);
        }
    };
    const module = await Test.createTestingModule({
        providers : [
            AuthService,
            {
                provide: UsersService,
                useValue: fakeUserService
            }
        ]
    }).compile();

    service = module.get(AuthService)
    });

    it('can create an instance of auth service', async()=> {
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hased password', async () => {

        const user = await service.signup('lucarlo@gmail.com', 'lucarlo');
        expect(user.password).not.toEqual('lucarlo')
        const [salt, hash] = user.password.split('.')
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws an error if user signs up with email that is in use', async ()=> {
        await service.signup('mario@gmail.com', 'mario');
        
        await expect(service.signup('mario@gmail.com', 'prova')).rejects.toThrow(
            BadRequestException,
        );
    })

    it('throws if signin is called with an unused email', async ()=>{
        await expect(service.signin('pippo@gmail.com', 'pippo')).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async ()=>{
        await service.signup('mario@gmail.com', 'mario')
        await expect(
            service.signin('mario@gmail.com', 'stefano'),
           ).rejects.toThrow(BadRequestException)

    });
    it('return a user if correct password is provided', async ()=>{
        await service.signup('mario@gmail.com', 'mario')
        const user = await service.signin('mario@gmail.com', 'mario')
            expect(user).toBeDefined();
    });
});
