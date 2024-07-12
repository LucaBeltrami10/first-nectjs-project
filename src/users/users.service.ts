import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>){
    }
    create(email: string, password: string){
        const user = this.repo.create({email, password});
        return this.repo.save(user);
    }; 

    findOne(id: number){
        if(!id){
            return null
        }
        return this.repo.findOne({ where: { id }});
      }

    find(email: string){
        return this.repo.find({where: {email}})
    };

    // Partial<User> co,unica a nest che è possibile che attrs abbia solo una parte delle proprietà definite nell'entità User
    async update(id:number, attrs: Partial<User>){
        const user = await this.repo.findOne({ where: { id } })
        if(!user){
            throw new NotFoundException('user not found!')
        }
        // Object.assign è un metodo integrato Javascript che copia i parametri di un oggetto (attrs) in un altro oggetto (user)
        Object.assign(user, attrs);
        return this.repo.save(user)
    };

    async remove(id:number){
        const user = await this.repo.findOne({ where: { id } });
        if(!user){
            throw new NotFoundException('user not found!')
        }
        return this.repo.remove(user);
    };
}
