import { Router } from "express";
import { CartManager } from "../dao/models/cartManager.js";

const cartRouter = Router();

cartRouter.get('/:id', async(req, res) =>{
    const {id} = req.params
    try{
        const carts = await CartManager.findById(id)
        if(carts){
            res.status(200).send({resputa: "OK" , mensaje: carts})
        }else{
            res.status(404).send({respuesta: "Error en consultar carrrito", mensaje: "carts not found"})
        }
        
    }catch(error){
        res.status(400).send({respuesta: "Error", mensaje: error})
    }
})

cartRouter.get('/', async (req, res) => {
    const {limit} = req.query
    try {
        const carts = await CartManager.findAll(limit);
        res.status(200).send({respuesta: 'OK', mensaje: carts})
    } catch (error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
})

cartRouter.post('/', async(req, res) =>{
    try{
        const carts = await CartManager.create({})
        res.status(200).send({respuesta: "OK" ,mensaje: carts})
    }catch(error){
        res.status(400).send({respuesta: "Error", mensaje: "No se logro crear carrito"})
    }
})

cartRouter.post('/:cid/products/:pid', async(req, res) =>{
    const {cid, pid} = req.params
    const {quantity} = req.body
    try {
        await CartManager.addProductCart(cid, pid, quantity);
        res.status(200).send({ respuesta: 'OK', mensaje: 'Cart Updated' });
    } catch (error) {
        res.status(error.message.includes("not found") ? 404 : 400).send({ respuesta: 'Error', mensaje: error.message });
    }
})


cartRouter.delete('/:cid', async (req, res) => {
    const { cid } = req.params
    try {
        await CartManager.delateCart(cid);
        res.status(200).send({respuesta: 'ok', mensaje: 'Cart Empty'});
    } catch (error){
        res.status(400).send({respuesta: 'Error getting cart by id', mensaje: error})
    }
})

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    try {
        await CartManager.removeProductbyId(cid, pid);
        res.status(200).send({ respuesta: 'OK', mensaje: 'Product removed' });
    } catch (error) {
        res.status(error.message.includes("not found") ? 404 : 400).send({ respuesta: 'Error', mensaje: error.message });
    }
})

cartRouter.put('/:cid', async (req, res) => {
    const { cid } = req.params
    const prodArray = req.body.products

    if (!Array.isArray(prodArray)) {
        return res.status(400).send({ respuesta: 'Error', mensaje: 'array no encontrado' })
    }

    try {
        await CartManager.updateProductWhitCart(cid, prodArray);
        res.status(200).send({ respuesta: 'OK', mensaje: 'Cart updated successfully' });
    } catch (error) {
        res.status(error.message.includes("not found") ? 404 : 400).send({ respuesta: 'Error', mensaje: error.message });
    }
})

cartRouter.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body

    try {
        await CartManager.addProductCart(cid, pid, quantity);
        res.status(200).send({ respuesta: 'OK', mensaje: 'Cart Updated' });
    } catch (error) {
        res.status(error.message.includes("not found") ? 404 : 400).send({ respuesta: 'Error', mensaje: error.message });
    }
})



export default cartRouter;

