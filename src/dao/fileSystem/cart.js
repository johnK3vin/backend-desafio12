import {promises as fs} from 'fs';

export class Carrito {
    constructor(){
        this.path = './src/dao/fileSystem/carrito.json'
    }

    async nextId() {
        const prod = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        if (prod.length < 1) return 1;
        const ids = prod.map(items => items.id);
        const id = Math.max(...ids) + 1;
        return id;
    }

    async getCart() {
        const list = JSON.parse( await fs.readFile(this.path, 'utf-8'))
        return list;
    }

    async getCartById(id){
        const list = await this.getCart();
        const carts = list.find(items => items.id === parseInt(id))
        
        if (carts){
            console.log(carts)
            return carts;
        }else {
            console.log("error: no existe en carrito")
        }
    }

    async createCart(){
        const id = await this.nextId();
        const products = new Cart(id);

        try{
            const cartList = await this.getCart();
            cartList.push(products)

            await fs.writeFile(this.path, JSON.stringify(cartList));

            console.log("carrito creado")
        }catch{
            console.log("error al crear carrito")
        }
    }

    async addCartProduct(cartId, productId, quanty){
        const cart = await this.getCart();
        const index = cart.findIndex(items => items.id === parseInt(cartId))

        if(index != -1){
            const carts = cart[index];
            const productIndex = carts.product.findIndex(items => items.productID === parseInt(productId))

            if(productIndex != -1){
                carts.product[productIndex].quanty += quanty;
                console.log("se ha sumado la cantidad")
            }else{
                carts.product.push({productID: parseInt(productId), quanty})
                console.log("Producto agregado al carrito")
            }

            await fs.writeFile(this.path, JSON.stringify(cart));
        }else{
            console.log("Error: Carrito no encontrado")
        }
    }
}

class Cart {
    constructor(id, product = []){
        this.id = id;
        this.product = product;
    }

    async addProd(id, title, price,quanty){
        this.product.push(id, title, price, quanty)
    }
}