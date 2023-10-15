import dotenv from 'dotenv';
import express from 'express'
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from 'express-session';
//passport
import passport from 'passport';
import InitializePassport from './config/passport.js';
//router
import apiRouter from './routes/api.routes.js';
import viewRouter from './routes/view.routes.js';

//handlebars
import exphbs from 'express-handlebars';
import Handlebars from 'handlebars';

//path
import { __dirname } from "./path.js";
import path from 'path';

//helpers
import { productManager } from './dao/models/productsManager.js';
import { userManager } from './dao/models/userManager.js';
import { messageManager } from './dao/models/messagesManager.js';

dotenv.config();
const viewsRouter = viewRouter;
const apisRouter = apiRouter;
const app = express();
const PORT = 8080;

const server = app.listen(PORT, ()=>{
    console.log(`Server on port ${PORT}`);
})

//conexion con la BDD
mongoose.connect(process.env.MONGO_URL)
  .then(()=> console.log("BDD conectada"))  
  .catch(() => console.log("Error en conexion a BDD"))

//middlaware
app.use(express.json());
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(express.urlencoded({extended: true}));
app.use(session({
  store: MongoStore.create({ 
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: { 
          useNewUrlParser: true, 
          useUnifiedTopology: true 
      }, 
      ttl: 120
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

InitializePassport();
app.use(passport.initialize());
app.use(passport.session());

const hbs = exphbs.create({
  defaultLayout: 'main',
  handlebars: Handlebars,
  runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
  }
});


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));
app.use("/home", express.static(path.join(__dirname, "/public")));
app.use('/realtimeproducts', express.static(path.join(__dirname, '/public')))
app.use('/login', express.static(path.join(__dirname, '/public')))
app.use('/logout', express.static(path.join(__dirname, '/public')))
app.use('/signup', express.static(path.join(__dirname, '/public')))
app.use('/chat', express.static(path.join(__dirname, '/public')))


//generando cookies
app.get('/setCookie' , (req, res) =>{
  res.cookie('CookieCookie', "Esto es una Cookie").send('Cookie generada')
})
app.get('/getCookie', (req, res) =>{
  res.send(req.cookies)
})

const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("Servidos Socket.io conectado");
  //esperando un 'mensaje'
  socket.on("nuevoProd", async (prod) => {
    try {
      const {title,description,price,code,stock,category} = prod;
      console.log({respuesta: "OK", mensaje: prod})
      return await productManager.create({title,description,price,code,stock,category})
      
    } catch (error) {
      console.log("index nuevo product:", error);
    }
  });
  socket.on('pedir-Datos', async ()=>{
    const datos = await productManager.find();
    socket.emit('datos', datos);
    console.log('datos enviados');
  })
  socket.on('validatorUser', async (user)=>{
    let x = 'error'
    try{
      console.log(`esto recivo: ${user}`)
      const users = await userManager.findByEmail(user)
      if(users) {
        console.log("este es el email: "+users)
        socket.emit('emailValidado', users.email)
      }else{
        socket.emit('emailValidado', x)
        console.log({respuesta: "Error el buscar email", mensaje:"Email not found"})
      }
    }catch(error){
      console.log("index validar email:", error)
    }
  })

  socket.on('mensajes', async(objeto) =>{
    const email = objeto[0]
    const message = objeto[1]
    try{
      const newMessage = await messageManager.create({email, message});
      const messages = await messageManager.find();
      socket.emit("mostrarMensaje", messages);
      console.log("Mensaje enviado", newMessage)
    }catch(error){
      console.log("index mensaje:", error)
    }
  })

  socket.on('pedirDatos', async ()=>{
    try{
      const prods = await productManager.find()
      socket.emit("datosProd", prods)
      console.log("datos enviados")
    }catch(error){
      console.log("index pedir datos:", error)
    }
  })

});

app.use('/api', apisRouter)
app.use('/', viewsRouter)