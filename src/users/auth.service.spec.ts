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

    fakeUserService = {
        find: () => Promise.resolve([]),
        create: (email: string, password: string) => Promise.resolve({id: 1, email, password} as User)
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
        fakeUserService.find = () => Promise.resolve([{id:1, email:'prova@gmail.com', password: 'prova'} as User])
        
        await expect(service.signup('prova@gmail.com', 'prova')).rejects.toThrow(
            BadRequestException,
        );
    })
});
