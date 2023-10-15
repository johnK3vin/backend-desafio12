import { messageModel } from "./messages.models.js"

class MessageManagerDAO {
    async find(limit) {
        return await messageModel.find().limit(limit);
    }

    async create(messageData) {
        return await messageModel.create(messageData);
    }
}

export const messageManager = new MessageManagerDAO();