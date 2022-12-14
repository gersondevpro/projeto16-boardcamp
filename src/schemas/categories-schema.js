import joi from "joi";

const categorySchema = joi.object({
    name: joi.string().required().min(3)
});

export {
    categorySchema
}