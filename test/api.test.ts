import request = require('supertest');
import * as express from 'express';
import * as routes from '../src/routes';
import { logger } from '../src/modules/logger';

process.env.SESSION_SECRET = 'secret';
process.env.SESSION_TIMEOUT = '60';
process.env.NODE_ENV = 'test';

const app = express();
app.use(express.json());
app.use(routes);
jest.setTimeout(10000);

beforeAll(async () => {
    await new Promise((r) => setTimeout(r, 500));
});

describe('Test Api CoinGecko', () => {
    it('Flow Successful get all coins', async () => {
        const result1 = await request(app).post('/create')
            .send({
                name: 'Juan',
                lastName: 'Juan',
                user: 'jj',
                currency: 'usd',
                password: '123456abc'
            });
        const result2 = await request(app).post('/login')
            .send({ user: 'jj', password: '123456abc' });
        const res1 = JSON.parse(result1.text);
        const res2 = JSON.parse(result2.text);
        const result3 = await request(app).get('/operations/coins')
            .set('Authorization', `Bearer ${res2.data}`);
        const res3 = JSON.parse(result3.text);

        expect(res1.status).toBeTruthy();
        expect(res2.status).toBeTruthy();
        expect(res3.status).toBeTruthy();
        expect(res3.data.length).toBeGreaterThan(0);
    });

    it('Flow Successful add-coins top-coin', async () => {
        const result1 = await request(app).post('/create')
            .send({
                name: 'Juan',
                lastName: 'Juan',
                user: 'jj2',
                currency: 'usd',
                password: '123456abc'
            });
        const result2 = await request(app).post('/login')
            .send({ user: 'jj2', password: '123456abc' });

        const res1 = JSON.parse(result1.text);
        const res2 = JSON.parse(result2.text);

        const result3 = await request(app).post('/operations/add-coin')
            .send({ coin: 'btc' })
            .set('Authorization', `Bearer ${res2.data}`);
        const result4 = await request(app).get('/operations/top-coins/10')
            .set('Authorization', `Bearer ${res2.data}`);
        const res3 = JSON.parse(result3.text);
        const res4 = JSON.parse(result4.text);

        expect(res1.status).toBeTruthy();
        expect(res2.status).toBeTruthy();
        expect(res3.status).toBeTruthy();
        expect(res4.status).toBeTruthy();
        expect(res4.data.length).toBe(1);
    });

    it('Flow Successful add-coins top-coin, invalid coin', async () => {
        const result1 = await request(app).post('/login')
            .send({ user: 'jj2', password: '123456abc' });

        const res1 = JSON.parse(result1.text);

        await request(app).post('/operations/add-coin')
            .send({ coin: 'btc' })
            .set('Authorization', `Bearer ${res1.data}`);
        // Add invalid coin
        await request(app).post('/operations/add-coin')
            .send({ coin: 'btn' })
            .set('Authorization', `Bearer ${res1.data}`);
        await request(app).post('/operations/add-coin')
            .send({ coin: 'eth' })
            .set('Authorization', `Bearer ${res1.data}`);
        await request(app).post('/operations/add-coin')
            .send({ coin: 'ada' })
            .set('Authorization', `Bearer ${res1.data}`);
        await request(app).post('/operations/add-coin')
            .send({ coin: 'usdc' })
            .set('Authorization', `Bearer ${res1.data}`);
        const result2 = await request(app).get('/operations/top-coins/10')
            .set('Authorization', `Bearer ${res1.data}`);

        const res2 = JSON.parse(result2.text);

        expect(res2.status).toBeTruthy();
        expect(res2.data.length).toBe(4);
    });

    it('Flow Successful top-coin, sort coin', async () => {
        const result1 = await request(app).post('/login')
            .send({ user: 'jj2', password: '123456abc' });

        const res1 = JSON.parse(result1.text);

        const result2 = await request(app).get('/operations/top-coins/10/asc')
            .set('Authorization', `Bearer ${res1.data}`);

        const res2 = JSON.parse(result2.text);

        expect(res2.status).toBeTruthy();
        expect(res2.data.length).toBe(4);
    });

    // Test fail flow
    it('Fail create existing user', async () => {
        const result1 = await request(app).post('/create')
            .send({
                name: 'Juan',
                lastName: 'Juan',
                user: 'jj2',
                currency: 'usd',
                password: '123456abc'
            });

        const res1 = JSON.parse(result1.text);

        expect(res1.status).toBeFalsy();
    });
    it('Fail create account with payload incomplete', async () => {
        const result1 = await request(app).post('/create')
            .send({
                lastName: 'Juan',
                user: 'jj2',
                currency: 'usd',
                password: '123456abc'
            });

        const res1 = JSON.parse(result1.text);

        expect(res1.status).toBeFalsy();
    });
    it('Fail login with payload incomplete', async () => {
        const result1 = await request(app).post('/login')
            .send({
                password: '123456abc'
            });

        const res1 = JSON.parse(result1.text);

        expect(res1.status).toBeFalsy();
    });
    it('Fail login with invalid credential', async () => {
        const result1 = await request(app).post('/login')
            .send({
                user: 'jj3',
                password: '123456abc'
            });

        const res1 = JSON.parse(result1.text);

        expect(res1.status).toBeFalsy();
    });
    it('Fail operation with invalid token', async () => {
        const result1 = await request(app).post('/operations/add-coin')
            .send({ coin: 'usdc' })
            .set('Authorization', 'Bearer xxxxx');

        const res1 = JSON.parse(result1.text);

        expect(res1.status).toBeFalsy();
    });
    it('Fail add coin with invalid payload', async () => {
        const result1 = await request(app).post('/login')
            .send({ user: 'jj2', password: '123456abc' });

        const res1 = JSON.parse(result1.text);

        await request(app).post('/operations/add-coin')
            .send({ coi: 'btc' })
            .set('Authorization', `Bearer ${res1.data}`);
    });
    it('Fail top-coin, invalid param', async () => {
        const result1 = await request(app).post('/login')
            .send({ user: 'jj2', password: '123456abc' });

        const res1 = JSON.parse(result1.text);

        const result2 = await request(app).get('/operations/top-coins/26')
            .set('Authorization', `Bearer ${res1.data}`);

        const res2 = JSON.parse(result2.text);

        expect(res2.status).toBeFalsy();
    });

    it('Fail top-coin, user without coins', async () => {
        const result1 = await request(app).post('/login')
            .send({ user: 'jj', password: '123456abc' });

        const res1 = JSON.parse(result1.text);

        const result2 = await request(app).get('/operations/top-coins/2')
            .set('Authorization', `Bearer ${res1.data}`);

        const res2 = JSON.parse(result2.text);

        expect(res2.status).toBeFalsy();
    });
});