import { connectionDB } from '../database/db.js';

export async function create(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const newRent = await connectionDB.query(`INSERT INTO rentals ("customerId", "gameId", "daysRented") VALUES ($1, $2, $3)`, [customerId, gameId, daysRented]);

        if (newRent.rows === 0) {
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
        const { rows } = await connectionDB.query("SELECT * FROM customers;");
        return res.send(rows);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function exclude(req, res) {
    try {
        const { name, phone, cpf, birthday } = req.body;
        const { id } = req.params;

        await connectionDB.query("UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5", [name, phone, cpf, birthday, id]);

        return res.sendStatus(200)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}