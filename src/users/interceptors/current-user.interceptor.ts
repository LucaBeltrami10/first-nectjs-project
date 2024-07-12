import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { UsersService } from "../users.service";
import { Observable } from "rxjs";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private userService: UsersService){}
    
    async intercept(context: ExecutionContext, handler: CallHandler<any>){
        const request = context.switchToHttp().getRequest()
        const {userId} = request.session || {};

        if(userId){
            const user = await this.userService.findOne(userId)
            request.currentUser = user;
            }

        // significa vai avanti ed esegui il gestore di rotta
        return handler.handle()
    }
}