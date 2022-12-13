import { connectionDB } from '../database/db.js';

export async function create(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        const newGame = await connectionDB.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`, [name, image, stockTotal, categoryId, pricePerDay]);

        console.log(newGame);

        if (newGame.rows === 0) {
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
        const { rows } = await connectionDB.query("SELECT * FROM games;");
        return res.send(rows);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}