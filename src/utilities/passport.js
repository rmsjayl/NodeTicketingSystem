const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const commonHelpers = require("../common/helpers");

passport.use(
    new GoogleStrategy({

        // Google client credentials
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK,

        // Google scope information
        scope: ["profile", "email"],
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;

                if (!email) {
                    // If no email is found, return an error using the done callback.
                    return done(new Error("No email found in Google profile."));
                }

                done(null, {profile: profile, accessToken: accessToken, refreshToken: refreshToken});

            } catch (error) {
                done(error, null);
            }
        })
);

// Passport session setup
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));