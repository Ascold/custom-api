import {Injectable, CanActivate, ExecutionContext, HttpStatus, HttpException} from '@nestjs/common';
import {Observable} from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const token = request.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, 'secret');
            return true;
        } catch (err) {
            throw new HttpException(HttpStatus[HttpStatus.FORBIDDEN], HttpStatus.FORBIDDEN);
        }
    }
}
