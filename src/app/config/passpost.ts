/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import bcryptjs from "bcryptjs";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { UserModel } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
//local login
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await UserModel.findOne({ email });

        if (!isUserExist) {
          return done(null, false, { message: "User does not exist" });
        }
        if (!isUserExist.isVerified) {
        return  done("User is not verified");
        }

        if (
          isUserExist.isActive === IsActive.BLOCKED ||
          isUserExist.isActive === IsActive.INACTIVE
        ) {
        return  done(`User is ${isUserExist.isActive}`);
        }

        if (isUserExist.isDeleted) {
        return  done("User is deleted");
        }

        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObj) => providerObj.provider === "google"
        );

        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(
            "You have authenticated through Google. Please login with Google!"
          );
        }

        const isPasswordMatche = await bcryptjs.compare(
          password as string,
          isUserExist.password as string
        );

        if (!isPasswordMatche) {
          return done(null, false, { message: "Password does not match" });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

//google loging
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "No email found" });
        }

        let user = await UserModel.findOne({ email });

        if (user && !user.isVerified) {
          return done(null, false, { message: "User is not verified" });
        }

        if (
          user &&
          (user.isActive === IsActive.BLOCKED ||
            user.isActive === IsActive.INACTIVE)
        ) {
          return done(`User is ${user.isActive}`);
        }

        if (user && user.isDeleted) {
          return done(null, false, { message: "User is deleted" });
        }

        if (!user) {
          user = await UserModel.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, user);
      } catch (error) {
        console.log("Google strategy Error", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
