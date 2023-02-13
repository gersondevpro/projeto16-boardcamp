import { db } from "../database/db.js";
import dayjs from "dayjs";

export async function newRental(req, res) {
    try {
        const { customerId, gameId, daysRented } = req.body;

        const rentDate = dayjs().locale('pt-br').format('YYYY-MM-DD');
        const findPricePerDay = await db.query(`SELECT "pricePerDay" FROM games WHERE id = $1`, [gameId]);

        if (daysRented === 0) {
            return res.sendStatus(400);
        };

        const originalPrice = daysRented * findPricePerDay.rows[0].pricePerDay;

        const findClient = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);
        if (findClient.rows.length === 0) {
            return sendStatus(400);
        }

        const findGame = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);
        if (findGame.rows.length === 0) {
            return sendStatus(400);
        }

        const returnDate = null;
        const delayFee = null;

        if (findGame.rows[0].stockTotal <= 0) {
            return res.sendStatus(400)
        };

        await db.query(`UPDATE games SET "stockTotal" = $1 WHERE id = $2;`, [findGame.rows[0].stockTotal - 1, findGame.rows[0].id]);

        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);

        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

export async function readRentals(req, res) {
    try {
        const rentals = await db.query(`
        SELECT rentals.*,
        customers.name AS name_client, customers.id AS id_client,
        games.name AS name_game, games.id AS id_game
        FROM((rentals
        INNER JOIN customers ON rentals."customerId" = customers.id)
        INNER JOIN games ON rentals."gameId" = games.id);`);

        console.log(rentals.rows[0].id)

        let rents = []
        const mapRentals = rentals.rows.forEach((e) => {
            rents.push({
                id: e.id,
                customerId: e.customerId,
                gameId: e.gameId,
                rentDate: e.rentDate,
                daysRented: e.daysRented,
                returnDate: e.returnDate,
                originalPrice: e.originalPrice,
                delayFee: e.delayFee,
                customer: {
                    id: e.id_client,
                    name: e.name_client,
                },
                game: {
                    id: e.id_game,
                    name: e.name_game,
                }
            })
        }
        );

        return res.send(rents);
} catch (error) {
    res.status(500).send(error.message);
};
};

export async function endLocation(req, res) {
    const { id } = req.params;

    try {
        const consult = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
        if (consult.rows.length === 0) {
            return res.sendStatus(404)
        };

        if (consult.rows[0].returnDate !== null) {
            return res.sendStatus(400);
        };

        const returnDate = dayjs().locale('br').format('YYYY-MM-DD HH:mm')
        /* const teste = "2023-03-07T03:00:00.000Z" */

        const dayRent = consult.rows[0].rentDate
        const dayReturn = returnDate
        const diffInMs = new Date(dayReturn) - new Date(dayRent)
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (diffInDays => 1) {
            await db.query(`UPDATE rentals SET "delayFee" = $1 WHERE id = $2;`,
                [(diffInDays - consult.rows[0].daysRented) * (consult.rows[0].originalPrice / consult.rows[0].daysRented), id])
        }

        await db.query(`UPDATE rentals SET "returnDate" = $1 WHERE id = $2;`, [returnDate, id]);

        // Voltando o estoque na quantidade correta após a devolução
        const findGame = await db.query(`SELECT * FROM games WHERE id = $1;`, [consult.rows[0].gameId]);
        await db.query(`UPDATE games SET "stockTotal" = $1 WHERE id = $2;`, [findGame.rows[0].stockTotal + 1, consult.rows[0].gameId]);

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

export async function deleteRental(req, res) {
    const { id } = req.params;
    try {
        const consult = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
        if (consult.rows.length === 0) {
            return res.sendStatus(404);
        };

        const deleteOrNo = await db.query(`SELECT "returnDate" FROM rentals WHERE id = $1;`, [id]);
        console.log(deleteOrNo.rows);
        if (deleteOrNo.rows[0].returnDate === null) {
            return res.sendStatus(400);
        };

        await db.query(`DELETE FROM rentals WHERE id = $1;`, [id]);

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    };
};