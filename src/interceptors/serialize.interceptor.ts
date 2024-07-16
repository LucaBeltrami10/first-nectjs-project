import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators'
import { plainToClass } from "class-transformer";
import { UserDto } from "src/users/dtos/user.dto";
import { ReportDto } from "src/reports/dto/report.dto";

interface ClassConstructor {
    new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor){
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor{
    constructor(private dto: any){}
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any>{

        return handler.handle().pipe(
            map((data: any) => {
                return plainToClass(this.dto, data, {
                    // rimossi valori estranei a UserDto (così: this.dto in base al dto che unseriamo in Serialize(..). risolto problema in report)
                    excludeExtraneousValues : true,
                })
            })
        )
    }

}

// impelemts.... è opzionale. 
/* export class SerializeInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any>{
        // Run somethings befpre a request is handled by request handler
        console.log('eseguito prima dell handler',context)

        return handler.handle().pipe(
            map((data: any) => {
                // Run something before the response is sent out
                console.log('eseguito prima del response', data)
            })
        )
    }

} */

