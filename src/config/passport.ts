import passportJwt from 'passport-jwt';
import { AccountService } from '../account/acount.service';
import prisma from './prisma.client';
import aws from './aws';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

export default function passportConfig() {
    const accountService = new AccountService(aws, prisma);

    return new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        async function (jwtToken, done) {
            try {
                const account = await accountService.getAccount({
                    id: jwtToken.id,
                });

                return done(null, account!);
            } catch (error) {
                return done(new Error('Something went wrong'), false);
            }
        }
    );
}
