import joi from "joi";

const customerSchema = joi.object({
    name: joi.string().required().min(3),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().min(11).max(11).required(),
    birthday: joi.date().less('now').required()
});

export {
    customerSchema
}