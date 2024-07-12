import { createParamDecorator, ExecutionContext, Session } from "@nestjs/common";
import { UsersService } from "../users.service";


// NB non può accedere a dipendenze facenti parti del sistema dependency injection
export const CurrentUser = createParamDecorator(
    // NB: executionContext è un request allargata che oltre ad http permette il funzionamento anche con protocolli di comunicazione WebSockets, grpc, http, graphQL 
    (data: never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.currentUser
    }
)