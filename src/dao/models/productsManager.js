import { prodModel } from "./product.models.js";

class ProductManagerDAO {
    async find(limit, page, category, sort) {
        let query = {};
        if (category) {
            query.category = category;
        }
    
        let options = {
            limit: parseInt(limit) || 10,
            page: parseInt(page) || 1
        };
    
        if (sort) {
            options.sort = {
                price: sort === 'asc' ? 1 : -1
            };
        }
    
        return await prodModel.paginate(query, options);
    }
    

    async findById(id) {
        return await prodModel.findById(id);
    }

    async create(productData) {
        return await prodModel.create(productData); 
    }

    async updateById(code, productData) {
        return await prodModel.findOneAndUpdate({ code: code }, productData, { new: true });
    }

    async deleteById(id) {
        return await prodModel.findByIdAndDelete(id);
    }
}

export const productManager = new ProductManagerDAO();