import { connectionDB } from '../database/db.js';
import { categorySchema } from '../schemas/categories-schema.js';

export async function create(req, res) {
    const { name } = req.body;

    try {

        const categoryValidate = categorySchema.validate({name}, {abortEarly: false});

        if(categoryValidate.error) {
            const mapError = categoryValidate.error.details.map(e => e.message);
            return res.status(400).send(mapError);
        }

        const findCategory = await connectionDB.query(`SELECT * FROM categories WHERE name=$1`, [name])

        if(findCategory.rows.length > 0) {
            return res.sendStatus(409);
        }

        const newCategory = await connectionDB.query(`INSERT INTO categories (name) VALUES ($1)`, [name]);
    
        if (newCategory.rows === 0) {
            return res.sendStatus(404);
        };

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function render(req, res) {
    try {
        const { rows } = await connectionDB.query("SELECT * FROM categories;");
        return res.send(rows);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}