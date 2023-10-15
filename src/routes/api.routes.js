import { Router } from 'express'
import userRouter from './users.routes.js'
import productRouter from './products.routes.js'
import messageRouter from './messages.routes.js'
import cartRouter from './carts.routes.js'
import sessionRouter from './session.routes.js'

const apiRouter = Router()

apiRouter.use('/users', userRouter)
apiRouter.use('/carts', cartRouter)
apiRouter.use('/message', messageRouter)
apiRouter.use('/products', productRouter)
apiRouter.use('/session', sessionRouter)

export default apiRouter;