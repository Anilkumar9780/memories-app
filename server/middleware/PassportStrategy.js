import User from '../models/UserSchema.js'
import { Strategy, ExtractJwt } from 'passport-jwt';

export const passportStrategy = (passport) => {
    const options = {};
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey = "YOUR_SECRET";
    passport.use('local-register',
        new Strategy(options, async (payload, done) => {
            console.log(payload)
            try {
                const result = await User.findOne({ _id: payload.id });
                if (result) {
                    return done(null, result.toJSON());
                }
                return done('No User Found', {});
            } catch (error) {
                return done(error, {});
            }
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((_id, done) => {
        User.findById(_id, (err, user) => {
            if (err) {
                done(null, false, { error: err });
            } else {
                done(null, user);
            }
        });
    });
};
