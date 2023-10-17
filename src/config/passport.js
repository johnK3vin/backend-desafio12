import local from "passport-local";
import passport from "passport";
import GithubStrategy from "passport-github2";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import { userManager } from "../dao/models/userManager.js";
import { userModel } from "../dao/models/users.models.js";
import jwt from 'passport-jwt';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const InitializePassport = () => {

  const cookieExtractor = req => {
    const token = req.cookies.jwtCookie ? req.cookies.jwtCookie : null

    console.log("cookieExtractor", token)

    return token
  }

  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //El token va a venir desde cookieExtractor
    secretOrKey: process.env.JWT_SECRET
  }, async (jwt_payload, done) => { //jwt_payload = info del token (en este caso, datos del cliente)
    try {
        return done(null, jwt_payload)
    } catch (error) {
        return done(error)
    }
  }))

  passport.use("register",new LocalStrategy({usernameField: "email",passReqToCallback: true},
      async (req,username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          //buscar usuario
          const user = await userManager.findByEmail(email);
          console.log("user:", user);
          debugger;

          //usuario ya existe
          if (user) {
            return done(null, false, { message: "El usuario ya existe" });
          }

          //crear usuario
          const hashPass = createHash(password);
          console.log(hashPass);
          const createUser = await userManager.create({
            first_name,
            last_name,
            email,
            age,
            password: hashPass,
          });
          return done(null, createUser, {
            message: "Usuario creado exitosamente.",
          });
        } catch (error) {
          console.log("error passport:" + error);
          return done(error);
        }
      }
    )
  );

  //login del usuario
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await userManager.findByEmail(email);

          //Si el usuario no existe
          if (!user) {
            return done(null, false, { message: "El usuario no existe." });
          }

          //Si el usuario existe, validar la contraseña
          if (!validatePassword(password, user.password)) {
            console.log("Contraseña incorrecta");
            return done(null, false, {
              message: "La contraseña es incorrecta.",
            });
          }

          //Si el usuario existe y la contraseña es correcta, retornar el usuario
          console.log("Usuario logueado correctamente");
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy.Strategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_SECRET_CLIENT,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("accessToken:", accessToken);
          console.log("refreshToken:", refreshToken);
          console.log("profile:", profile._json);
          const user = await userModel.findOne({email : profile._json.email});
          if (user) {
            return done(null, user);
          } else {
            const newUser = await userManager.create({
              first_name: profile._json.name,
              last_name: " ",
              email: profile._json.email,
              age: 18,
              password: createHash(profile._json.email + profile._json.name),
            });
            return done(null, newUser);
          }
        } catch (error) {
          console.log("error github:" + error);
          return done(error);
        }
      }
    )
  );

  //Serializar al usuario
  passport.serializeUser((user, done) => {
    console.log("serialed user:", user);
    done(null, user._id);
  });

  //Deserializar al usuario
  passport.deserializeUser(async (id, done) => {
    try {
      console.log("deserializer_id:", id);
      const user = await userManager.findById(id);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
};
 
export default InitializePassport;
