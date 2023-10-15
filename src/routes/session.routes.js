import { Router } from "express";
import passport from 'passport';
import { passportError, authorization } from "../utils/messageError.js";
import { generateToken, authToken } from "../utils/jwt.js";

const sessionRouter = Router()

async function handleSuccessfulLogin(req, res, user) {
    req.session.passport.user = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        rol: user.rol,
        welcome: true
    };

    const token = await generateToken(req.session.passport.user);

    res.cookie('jwtCookie', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600000
    });

    const userData = JSON.stringify(req.session.passport.user);
    res.cookie('userData', userData, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600000
    });
}

sessionRouter.post('/login', passport.authenticate('login',{failureRedirect: 'faillogin'}), async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    console.log(email, password)
    try {
        if(!req.user){
            res.status(401).send({ resultado: 'Usuario invalido' });
        }

        await handleSuccessfulLogin(req, res, req.user);
        res.status(200).json({
            redirectTo: '/home',
            payload: req.session.passport,
            firstLogin: true
        });

        // const userData = JSON.stringify(req.session.passport.user);
        // console.log('userData:', userData)
        // res.cookie('userData', userData, {  
        //     httpOnly: false,
        //     secure: process.env.NODE_ENV !== 'development',
        //     maxAge: 3600000
        // });
        console.log("login exitoso")
        // res.status(200).send({payload: req.session.passport})
    } catch (error) {
        console.error('Hubo un error al iniciar sesión:', error);
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` });
    }
});

sessionRouter.get('/faillogin', (req, res) => {
    console.log('Error al iniciar sesión');
    res.redirect('/login');
});

//registrando usuario
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email']}), (req, res) => { 
    res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
});


sessionRouter.get('/githubCallback', 
  passport.authenticate('github', { failureRedirect: '/faillogin' }),
   async (req, res) => {
    try {

        await handleSuccessfulLogin(req, res, req.user);
        res.redirect('/home');
        // req.session.passport.user = {
        //     _id: req.user._id,
        //     first_name: req.user.first_name,
        //     last_name: req.user.last_name,
        //     email: req.user.email,
        //     age: req.user.age
        // };

        // const userData = JSON.stringify(req.session.passport.user);
        // res.cookie('userData', userData, {
        //     httpOnly: false,
        //     secure: process.env.NODE_ENV !== 'development',
        //     maxAge: 3600000
        // });
        console.log("inicio sesion con github exitoso")
        // res.status(200).redirect('/home');
    } catch (error) {
        console.error('Hubo un error al iniciar sesión con GitHub:', error);
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` });
    }
  }
);

sessionRouter.get('/logout', (req, res) => {
    console.log("Sesión antes del logout:", req.session);
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesión:", err);
            res.status(500).send({ resultado: 'Error interno al desloguear' });
        } else {
            res.clearCookie('userData', {
                path: '/',
                httpOnly: false,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 3600000}) ; 
            // Limpiar la cookie 'jwt'
            res.clearCookie('jwtCookie', {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development'
            });
            res.status(200).send({ resultado: 'Usuario deslogueado' });
        }
    });
    console.log("Sesión antes del logout:", req.session);
    req.logout(() => {
        console.log('Logged out');
    });
});

sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send(req.user)
})

sessionRouter.get('/current', passportError('jwt'), authorization(['admin','user']), (req, res) => {
    res.send(req.user)
})

sessionRouter.post('/update-welcome', (req, res) => {
    console.log('update-welcome',req.cookies)
    if (req.cookies && req.cookies.userData) {
        const userData = JSON.parse(decodeURIComponent(req.cookies.userData));
        console.log('update-welcome',userData)
        userData.welcome = false;
        
        res.cookie('userData', JSON.stringify(userData), {
            path: '/',
            httpOnly: false,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 3600000
        });

        res.status(200).send({ result: 'Cookie updated successfully' });
    } else {
        res.status(400).send({ result: 'Cookie not found' });
    }
});

export default sessionRouter