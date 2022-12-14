import { connectionDB } from '../database/db.js';
import dayjs from 'dayjs';

export async function create(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {

        const rentDate = dayjs().locale('br').format('YYYY-MM-DD HH:mm')
        const findPricePerDay = await connectionDB.query(`SELECT "pricePerDay" FROM games WHERE id=$1`, [gameId]);

        if (findPricePerDay.rows === 0) {
            return res.sendStatus(400);
        };
        const originalPrice = daysRented * findPricePerDay.rows[0].pricePerDay

        const findCustomer = await connectionDB.query(`SELECT * FROM customers WHERE id=$1`, [customerId]);

        if (findCustomer.rows.length === 0) {
            return res.sendStatus(400);
        };

        if (daysRented <= 0) {
            return res.sendStatus(400);
        };

        const findStockRentals = await connectionDB.query(`SELECT "gameId" FROM rentals WHERE "gameId"=$1`, [gameId]);
        const findStockGame = await connectionDB.query(`SELECT "stockTotal" FROM games WHERE id=$1`, [gameId]);

        if (findStockRentals.rows.length >= findStockGame.rows[0]) {
            return res.sendStatus(400);
        }

        await connectionDB.query(`INSERT INTO rentals ("customerId", "gameId", "returnDate", "daysRented", "rentDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`, [customerId, gameId, null, daysRented, rentDate, originalPrice, null]);

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function render(req, res) {
    try {
        const { rows } = await connectionDB.query("SELECT * FROM rentals;");

        const findCustomer = await connectionDB.query(`SELECT customers.id, customers.name FROM customers WHERE id=$1`, [rows[0].customerId])

        const findGame = await connectionDB.query(`SELECT games.id, games.name, games."categoryId", categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.id=$1`, [rows[0].gameId])

        const response = {
            id: rows[0].id,
            customerId: rows[0].customerId,
            gameId: rows[0].customerId,
            rentDate: rows[0].rentDate,
            daysRented: rows[0].daysRented,
            returnDate: rows[0].returnDate,
            originalPrice: rows[0].originalPrice,
            delayFee: rows[0].delayFee,
            customer: findCustomer.rows[0],
            game: findGame.rows[0]
        }

        return res.send(response);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function exclude(req, res) {
    try {

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}