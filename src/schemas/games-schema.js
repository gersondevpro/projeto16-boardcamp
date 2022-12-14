    import joi from "joi";

    const gameSchema = joi.object({
        name: joi.string().required().min(3)
    });

    export {
        gameSchema
    }