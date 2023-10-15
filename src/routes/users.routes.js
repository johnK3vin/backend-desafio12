import { Router } from "express";
import { userManager } from "../dao/models/userManager.js";
import passport from "passport";
import { createHash } from "../utils/bcrypt.js";
const userRouter = Router()

userRouter.get('/', async (req, res) =>{
    const { limit, page } = req.query;
    try {
        const users = await userManager.find(limit, page);
        res.status(200).send({respuesta: 'ok', mensaje: users})
    } catch (error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
})

userRouter.get('/:id', async (req, res) =>{
    const {id} = req.params
    try{
        const users = await userManager.findById(id)
        if(users){
            res.status(200).send({respuesta : 'OK' , mensaje : users})
        }else{
            res.status(404).send({respuesta: 'Error' , mensaje : 'User not found'})
        }
        
    }catch(error){
        res.status(400).send({respuesta: 'Error' , mensaje : error})
    }
})


userRouter.post('/', async (req, res) =>{
    const {first_name, last_name, age, email, password} = req.body
    try{
        const hashpass = await createHash(password)
        const newUser = await userManager.create({first_name, last_name, age, email, password : hashpass})
        res.status(200).send({respuesta : 'OK' , mensaje : newUser})
    }catch(error){
        res.status(400).send({respuesta: 'Error' , mensaje : error})
    }
})

userRouter.post('/signup', passport.authenticate('signup',{failureRedirect:'/failregister'}), async (req, res) => {
    try {
        if(!req.user){
            res.status(401).send({ resultado: 'Usuario invalido' });
        }

        res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
    }
    catch (error) {
        console.error('Hubo un error al registrar el usuario:', error);
        res.status(500).send({ mensaje: `Error al registrar ${error}` });
    }
})

userRouter.get('/failregister', (req, res) => {
    console.log('Error al registrar');
    res.status(401).send({ resultado: 'Error al registrar' });
});

userRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => { 
    res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
});

userRouter.get('/githubCallback', passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
    res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
});

userRouter.put('/:id', async (req, res) =>{
    const {id} = req.params
    const {first_name, last_name, ege, email, password} = req.body
    try{
        const users = await userManager.updateById(id, {first_name, last_name, ege, email, password})
        if(users){
            res.status(200).send({respuesta : 'OK' , mensaje : users})
        }else{
            res.status(404).send({respuesta: 'Error' , mensaje : 'User not found'})
        }
    }catch(error){
        res.status(400).send({respuesta: 'Error' , mensaje : error})
    }
})

userRouter.delete('/:id' , async(req, res) =>{
    const {id} = req.params
    try{
        const delate = await userManager.deleteById(id)
        if(delate){
            res.status(200).send({respuesta : 'OK' , mensaje : delate})
        }else{
            res.status(404).send({respuesta: 'Error en eliminar usuario' , mensaje : 'User not found'})
        }
    }catch(error){
        res.status(400).send({respuesta: 'Error', mensaje : error})
    }
})

export default userRouter;