import joi from 'joi';

const schemaCreateGame = joi.object({
    name: joi.string().required().min(3),
    image: joi.string().required().min(7),
    stockTotal: joi.number().required().min(1),
    pricePerDay: joi.number().required().min(1)
});

export { schemaCreateGame };