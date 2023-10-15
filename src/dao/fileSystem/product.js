import {promises as fs} from 'fs';

export class ProductManager{
    constructor(){
        this.path = './src/dao/fileSystem/product.json';
    }
    async nextId() {
        const prod = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        if (prod.length < 1) return 1;
        const ids = prod.map(items => items.id);
        const id = Math.max(...ids) + 1;
        return id;
    }

    async addProduct(title, description, price, thumbnail = [], code, stock, status, category){
        if (!title || !price || !description || !code || !stock || !status || !category) {
           return console.log("ERROR: Porfavor ingresar todos los campos")
       }

        const id = await this.nextId()
        const product =  new Product(id, title, description, price, thumbnail, code, stock, status, category);

        const prod = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const prods = prod.find(items => items.id === product.id)

        if(prods){
            console.log("ERROR: Ya existe este producto");
            return;
        } else{
            prod.push(product)
            await fs.writeFile(this.path, JSON.stringify(prod))
            console.log("Producto agregado con exito")
        }
    }

    async updateProduct(id, product){
        const prod = JSON.parse(await fs.readFile(this.path, "utf-8"));
        const indice = prod.findIndex(items => items.id === parseInt(id));

        if(indice !== -1){
            const update = {...prod[indice], ...product };
            prod[indice] = update;

            await fs.writeFile(this.path, JSON.stringify(prod))
            console.log("se ha modificado el producto con exito")
        } else{
            console.log("ERROR: No se ha encontrado ningun producto");
        }
    }

    async delateProduct(id){
        const search = JSON.parse(await fs.readFile(this.path, "utf-8"));
        const prod = search.find(items => items.id === parseInt(id));

        if(prod){
            await fs.writeFile(this.path, JSON.stringify(search.filter(items => items.id != id)))
            console.log("Producto removido con exito")
        } else {
            console.log("ERROR: Producto no encontrado")
        }
    }

    async getProducts(){
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        return prods
    }

    async getProductsById(id){
        const search = JSON.parse(await fs.readFile(this.path, "utf-8"));
        const searchId = search.find(items => items.id === parseInt(id));
        if(searchId){
            console.log(searchId)
            return(searchId);
        } else{
            console.log("ERROR: No se ha encontrado ningun producto");
        }
    }

}


class Product{
    constructor(id,title, description, price, thumbnail, code, stock, status = true, category){
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.status = status;
        this.category = category;
    }
}
