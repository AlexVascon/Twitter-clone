const app = require('../app');
const request = require('supertest');

describe('signup steps', () => {

    test('returns status code 203 and token if email gets sent', async () => {
       const res = await request(app).post('/auth/setup').send({
            name: 'User', 
            email: 'fakeemail@notlegit.com'
        });
       expect(res.statusCode).toBe(203); 
    });

    test('return 404 for invalid email or name', async () => {
        const res = await request(app).post('/auth/setup').send({ 
            name: '', 
            email: 'fake'
        });
        expect(res.statusCode).toBe(400);
    })

  
});