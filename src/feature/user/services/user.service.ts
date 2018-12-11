import {Injectable} from '@nestjs/common';
import {UsersRepositoryService} from '../repository/users-repository.service';
import {UserDto} from '../dto/user.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
    constructor(private usersRepository: UsersRepositoryService) {
    }

    public async createUser(request): Promise<UserDto> {
        const newUser = await this.usersRepository.createUser(request);
        return {
            username: newUser.username,
            email: newUser.email
        };
    }

    public async getUsers(): Promise<Array<UserDto>> {
        const usersArr = await this.usersRepository.getUsers() as Array<any>;
        const resultUsersArr = [] as Array<UserDto>;
        usersArr.forEach(user => {
            const processedUser: UserDto = {
                username: user.username,
                email: user.email
            };
            resultUsersArr.push(processedUser);
        });
        return resultUsersArr;
    }

    public async loginUser(request) {
        const user = await this.usersRepository.loginUser(request);
        const payload = {
            email: user.email
        };
        return jwt.sign(payload, 'secret', {expiresIn: '7h'});
    }
}
