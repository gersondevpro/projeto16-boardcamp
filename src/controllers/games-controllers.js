import { connectionDB } from '../database/db.js';
import { gameSchema } from '../schemas/games-schema.js';

export async function create(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {

        const gameValidate = gameSchema.validate({ name }, {abortEarly: false});
        if(gameValidate.error) {
            const mapError = gameValidate.error.details.map(e => e.message);
            return res.status(400).send(mapError);
        };

        if(stockTotal <= 0 || pricePerDay <= 0) {
            return res.sendStatus(400);
        };

        const findCategory = await connectionDB.query('SELECT * FROM categories WHERE id=$1', [categoryId]);
        console.log(categoryId)
        if(findCategory.rows.length === 0) {
            return res.sendStatus(400)
        }

        const findName = await connectionDB.query(`SELECT * FROM games WHERE name=$1`, [name])

        if(findName.rows.length > 0) {
            return res.sendStatus(409);
        }

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
        const { rows } = await connectionDB.query(`SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;`);
        return res.send(rows);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}