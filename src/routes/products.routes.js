import { Router } from "express";
import { productManager } from "../dao/models/productsManager.js";
import { passportError, authorization } from "../utils/messageError.js";
const productRouter = Router()

productRouter.get('/', passportError('jwt'), authorization(['user','admin']), async (req, res) =>{
    const {limit, page, category, sort} = req.query
    try{
        const prods = await productManager.find(limit, page, category, sort);
        const respuesta = {
            status: "success",
            payload: prods.docs,
            totalPages: prods.totalPages,
            prevPage: prods.prevPage,
            nextPage: prods.nextPage,
            page: prods.page,
            hasPrevPage: prods.hasPrevPage,
            hasNextPage: prods.hasNextPage,
            prevLink: prods.hasPrevPage ? `http://${req.headers.host}${req.baseUrl}?limit=${limit}&page=${prods.prevPage}&category=${category}&sort=${sort}` : null,
            nextLink: prods.hasNextPage ? `http://${req.headers.host}${req.baseUrl}?limit=${limit}&page=${prods.nextPage}&category=${category}&sort=${sort}` : null
        }
        res.status(200).send({respuesta: "OK" ,mensaje: respuesta})
    }catch(error){
        console.log(error)
        res.status(400).send({respuesta: "Error en consultar productos", mensaje: error })
    }
}) 

productRouter.get('/:id', passportError('jwt'), authorization(['user','admin']), async (req, res) =>{
    const {id} = req.params

    try{
        const prods = await productManager.findById(id)
        if(prods){
            res.status(200).send({respuesta: "OK" ,mensaje: prods})
        }else{
            res.status(404).send({respuesta: "Error en consultar producto", mensaje: "not found"})
        }
        
    }catch(error){
        res.status(400).send({respuesta: "Error en consultar productos", mensaje: error })
    }
})

productRouter.post('/', passportError('jwt'), authorization('admin'), async (req, res) =>{
    const {title, description, code, stock, price, category} = req.body

    try{
        const prods = await productManager.create({title, description, price, stock, code, category})
        res.status(200).send({respuesta: "OK" ,mensaje: prods})
    }catch(error){
        res.status(400).send({respuesta: "Error", mensaje: "No se logro crear producto"})
    }
})

productRouter.put('/:id', passportError('jwt'), authorization('admin'), async (req, res) =>{
    const {id} = req.params
    const {title, description, code, stock, price, category, status} = req.body

    try{
        const prods = await productManager.updateById({code: id}, {title, description, code, price, status, category, stock})
        if(prods){
            res.status(200).send({respuesta: "OK" ,mensaje: "Producto actualizado"})
        }else{
            res.status(404).send({respuesta: "Error en modificar", mensaje: "not found"})
        }
        
    }catch(error){
        res.status(400).send({respuesta: "Error en consultar productos", mensaje: error })
    }
})

productRouter.delete('/:id', passportError('jwt'), authorization('admin'), async (req, res) =>{
    const {id} = req.params

    try{
        const prods = await productManager.deleteById(id)
        if(prods){
            res.status(200).send({respuesta: "OK" ,mensaje: "producto eliminado"})
        }else{
            res.status(404).send({respuesta: "Error en consultar producto", mensaje: "not found"})
        }
        
    }catch(error){
        res.status(400).send({respuesta: "Error en consultar productos", mensaje: error })
    }
})

export default productRouter;