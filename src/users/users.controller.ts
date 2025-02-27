import { Body, Controller, Get, Post, Patch, Query, Param, Delete, NotFoundException, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('/auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ){}

    @UseGuards(AuthGuard)
    @Get('/whoami')
    whoAmI(@CurrentUser() user: User){
        return user;
    }

    // @Get('/whoami')
    // WhoAmI(@Session() session: any){
    //     return this.usersService.findOne(session.userId);
    // }

    @Post('/signout')
    signOut(@Session() session: any){
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    // @UseInterceptors(new SerializeInterceptor(UserDto))
    
    @Get('/:id')
    async findUser(@Param('id') id: string){
        const user = await this.usersService.findOne(parseInt(id));
        if(!user){
            throw new NotFoundException('user not found!')
        }
        return user;
    }

    @Get()
    findAlUser(@Query('email') email: string){
        return this.usersService.find(email);
    }

    @Patch('/:id')
    editUser(@Param('id') id:string, @Body() body: UpdateUserDto){
        return this.usersService.update(parseInt(id), body)
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id))
    }
}
