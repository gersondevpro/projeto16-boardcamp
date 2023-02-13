import { db } from '../database/db.js';
import { schemaCreateCustomer } from '../schemas/customers-schemas.js';

export async function createClient(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try {
        const validateClient = schemaCreateCustomer.validate(req.body, { abortEarly: false });
        if (validateClient.error) {
            const mapError = validateClient.error.details.map(e => e.message);
            return res.status(400).send(mapError);
        };

        const findCpf = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf]);
        if (findCpf.rows.length > 0) {
            return res.sendStatus(409);
        };

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday]);

        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

export async function readClients(req, res) {
    try {
        const readClients = await db.query(`SELECT * FROM customers;`);
        res.send(readClients.rows);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

export async function readOneClient(req, res) {
    try {
        const { id } = req.params;
        const findClient = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);

        if(findClient.rows.length === 0) {
            return res.sendStatus(404);
        };

        res.send(findClient.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

export async function updateClient(req, res) {
    try {
        const { name, phone, cpf, birthday } = req.body;
        const { id } = req.params;

        const validateClient = schemaCreateCustomer.validate(req.body, { abortEarly: false });
        if (validateClient.error) {
            const mapError = validateClient.error.details.map(e => e.message);
            return res.status(400).send(mapError);
        };

        const findClient = await db.query(`SELECT cpf FROM customers WHERE id = $1;`, [id]);
        const findCpf = await db.query(`SELECT cpf FROM customers WHERE cpf = $1;`, [cpf]);

        if(findClient.rows[0].cpf !== findCpf.rows[0].cpf) {
            return res.sendStatus(409);
        };
        
        await db.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5;`,
        [name, phone, cpf, birthday, id]);

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    };
};