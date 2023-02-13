import { db } from '../database/db.js';
import { schemaCreateGame } from '../schemas/games-schemas.js';

export async function create(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;
    
    console.log(req.body);

    try {
        const gameValidate = schemaCreateGame.validate({ name, image, stockTotal, pricePerDay }, { abortEarly: false });
        if (gameValidate.error) {
            console.log("TÔ AQUI DENTRO")
            return res.status(400).send(gameValidate.error.details.map(e => e.message));
        };

        const findName = await db.query(`SELECT * FROM games WHERE name = $1;`, [name]);
    
        if (findName.rows.length > 0) {
            return res.sendStatus(409);
        };

        if (stockTotal <= 0 || pricePerDay <= 0) {
            return res.sendStatus(400);
        }

        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, [name, image, stockTotal, pricePerDay]);

        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

export async function read (req, res) {
    try {
        const readGames = await db.query(`SELECT * FROM games;`);
        res.send(readGames.rows);
    } catch (error) {
        res.status(500).send(error.message);
    };
};