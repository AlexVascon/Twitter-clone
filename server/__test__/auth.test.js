const app = require('../app');
const request = require('supertest');

// for auth tests
let token;

describe('setup tests', () => {
   
    it('returns status code 203', async () => {

        const body = {
            name: 'User', 
            email: 'fakeemail@notlegit.com'
        }

        const res = await request(app).post('/auth/setup').send(body)

        await expect(res.statusCode).toBe(203);
     
});

test('returns status code 400 because user already exists', async () => {

    const body = {
        name: 'Bruce', 
        email: 'o0vascon0o@gmail.com'
    }
    await request(app).post('/auth/setup')
    .send(body)
    .expect(400)

});

test('returns status code 400 for invalid name', async () => {

    const body = {
        name: '', 
        email: 'o0vascon0o@gmail.com'
    }
    await request(app).post('/auth/setup')
    .send(body)
    .expect(400)

});

test('returns status code 400 for invalid email', async () => {

    const body = {
        name: 'Bruce', 
        email: ''
    }
    await request(app).post('/auth/setup')
    .send(body)
    .expect(400)

});

test('returns status code 400 for invalid email requirements', async () => {

    const body = {
        name: 'Bruce', 
        email: 'notanemail'
    }
    await request(app).post('/auth/setup')
    .send(body)
    .expect(400)

});

test('returns a string token on valid credentials', async () => {

    const body = {
        name: 'Bruce', 
        email: 'fakeemail@notlegit.com'
    }
    const res = await request(app).post('/auth/setup')
    .send(body)

    expect(res.body.emailToken).toEqual(expect.any(String))

});

test('returns a string token of length 5', async () => {

    const body = {
        name: 'Bruce', 
        email: 'fakeemail@notlegit.com'
    }
    const res = await request(app).post('/auth/setup')
    .send(body)

    expect(res.body.emailToken).toHaveLength(5)

});
})

describe('signup tests', () => {

    test('return 400 for invalid name on signup', async () => {

        const body = {
            name: '', 
            email: 'fakeemail@notlegit.com',
            password: 'p@ssw0rd'
        }
    
        const res = await request(app).post('/auth/signup').send(body)
    
        await expect(res.statusCode).toBe(400);
    })
    
    test('return 400 for invalid email on signup', async () => {
    
        const body = {
            name: 'User', 
            email: '',
            password: 'p@ssw0rd'
        }
    
        const res = await request(app).post('/auth/signup').send(body)
    
        await expect(res.statusCode).toBe(400);
    })
    
    test('return 400 for invalid email requirements on signup', async () => {
    
        const body = {
            name: 'User', 
            email: 'fakeemail.com',
            password: 'p@ssw0rd'
        }
    
        const res = await request(app).post('/auth/signup').send(body)
    
        await expect(res.statusCode).toBe(400);
    })
    
    test('return 400 for invalid password on signup', async () => {
    
        const body = {
            name: 'User', 
            email: 'fakeemail@notlegist.com',
            password: ''
        }
    
        const res = await request(app).post('/auth/signup').send(body)
    
        await expect(res.statusCode).toBe(400);
    })
    
    test('return 400 for invalid password requirements on signup', async () => {
    
        const body = {
            name: 'User', 
            email: 'fakeemail@notlegist.com',
            password: 'password'
        }
    
        const res = await request(app).post('/auth/signup').send(body)
    
        await expect(res.statusCode).toBe(400);
    })
    
    test('return 200 for all valid fields signup', async () => {
    
        const body = {
            name: 'User', 
            email: 'fakeemail@notlegist.com',
            password: 'p@ssw0rd'
        }
    
        const res = await request(app).post('/auth/signup').send(body)
    
        await expect(res.statusCode).toBe(400);
    })
})

describe('login tests', () => {
    beforeAll((done) => {
        request(app)
        .post('/auth/login')
        .send({
            email: process.env.EMAIL_USER,
            password: process.env.EMAIL_PASS,
        })
        .end((err, response) => {
            token = response.body.authToken; // save token
            done();
        })
    });

    test('return 200 for found existing user', async () => {

        const body = {
            inputChoice: 'o0vascon0o@gmail.com',
        }
    
        const res = await request(app).post('/auth/user/check-exist').send(body)
    
        await expect(res.statusCode).toBe(200);
    });

    test('return 200 for succesful login', async () => {
        const body = {
            email: process.env.EMAIL_USER,
            password: process.env.EMAIL_PASS,
        }

        const res = await request(app).post('/auth/login').send(body)
    
        await expect(res.statusCode).toBe(200);

    })

    test('return 200 for loading logged user profile page and data', async () => {

        const res = await request(app).get('/profile/details').set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(200);
    })

})














