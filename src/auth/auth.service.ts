import jwt from 'jsonwebtoken'
import { LoginDto } from './dto/login.dto'
import { AuthRepository } from './auth.repository'
import { HttpError } from '../common/http-error'

export class AuthService {
    private readonly authRepository: AuthRepository

    constructor() {
        this.authRepository = new AuthRepository()
    }

    async login(data: LoginDto): Promise<any> {
        const user = await this.authRepository.authorize(
            { email: data.email },
            data.password
        )

        if (!user) throw new HttpError(401, 'Unauthorized')

        return { token: jwt.sign(user, process.env.JWT_SECRET!) }
    }
}
