import passportJwt from 'passport-jwt';
import { AccountService } from '../account/acount.service';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

export default function passportConfig() {
    const accountService = new AccountService();

    return new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        async function (jwtToken, done) {
            const account = await accountService.getUser({ id: jwtToken.id });

            if (!account) {
                return done(new Error('Something went wrong'), false);
            } else {
                return done(null, account);
            }
        }
    );
}
