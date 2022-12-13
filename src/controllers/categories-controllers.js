import { connectionDB } from '../database/db.js';

export async function create(req, res) {
    const { name } = req.body;

    try {
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