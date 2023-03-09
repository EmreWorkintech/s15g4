const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "shhh"

beforeAll(async ()=> {
    await db.migrate.rollback();
    await db.migrate.latest();
})

beforeEach(async ()=> {
    await db.seed.run();
})

afterAll(async ()=> {
    await db.destroy();
})

describe('API END POINT TESTLERI', ()=> {
    describe('[GET] /', ()=> {
        test('[1] up mesajını geri dönüyor', async ()=> {
            const res = await request(server).get('/');
            expect(res.body).toMatchObject({ api: "up" });
            expect(res.status).toBe(200);
        })
    })
    describe('[GET] /hobbits', ()=> {
        test('[2] tüm hobbitleri geri dönüyor', async ()=> {
            const res = await request(server).get('/hobbits');
            expect(res.body).toHaveLength(4);
            expect(res.body[0]).toHaveProperty('name','sam');
            expect(res.status).toBe(200);
        })
    })
    describe('[POST] /hobbits', ()=> {
        describe('yeni hobbit başarılı kayıt oluyor', ()=> {
            test('[3] doğru status kodunu dönüyor', async ()=> {
                const yeniHobbit = {name:'bilbo'};
                const res = await request(server).post('/hobbits').send(yeniHobbit);
                expect(res.status).toBe(201);
            })
            test('[4] hobbiti dönüyor', async ()=> {
                const yeniHobbit = {name:'bilbo'};
                const res = await request(server).post('/hobbits').send(yeniHobbit);
                expect(res.body).toEqual({id:5,name:'bilbo'});
            })
        })
        describe('hatalı bilgi ile kayıt olmuyor', ()=> {
            test('[5] doğru status kodunu dönüyor', async ()=> {
                const yeniHobbit = {foo:'bilbo'};
                const res = await request(server).post('/hobbits').send(yeniHobbit);
                expect(res.status).toBe(401);
            })
            test('[6] name eksik iken hata mesajını doğru dönüyor', async ()=> {
                const yeniHobbit = {foo:'bilbo'};
                const res = await request(server).post('/hobbits').send(yeniHobbit);
                expect(res.body.message).toBe('name bilgisi eksik.');
            })
            test('[7] name type yanlış ise hata mesajını doğru dönüyor', async ()=> {
                const yeniHobbit = {name:1234};
                const res = await request(server).post('/hobbits').send(yeniHobbit);
                expect(res.body.message).toBe('name string değil!');
            })
        })
    })
    describe('[GET] /hobbits/:id', ()=> {
        test('[8] geçerli bir id için hobbiti dönüyor', async ()=> {
            const res = await request(server).get('/hobbits/1');
            expect(res.body).toMatchObject({id:1, name:'sam'});
            expect(res.status).toBe(200);
        })
    })
    describe('[GET] /', ()=> {
        test('[9] up mesajını geri dönüyor', async ()=> {
            const res = await request(server).get('/');
            const token = res.body.token;
            expect(token).toBeDefined();
        })
        test('[10] token geçerli bir token mı?', async ()=> {
            const res = await request(server).get('/');
            const token = res.body.token;
            let tokenInfo;
            jwt.verify(
                token,
                JWT_SECRET,
                (err, decodedJWT) => {
                    if(!err){
                        tokenInfo = decodedJWT
                    }
                }
            )
            expect(tokenInfo.id).toBe("1");
            expect(tokenInfo.name).toBe('sam');
        })
    })

    describe('[GET] /hobbits with token', ()=> {
        test('[11] token geçerli ise hobbitleri dönüyor', async ()=> {

            // deneme için yapıldı
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoic2FtIiwiaWF0IjoxNTE2MjM5MDIyfQ.xtnOCJt3KTvbOPZFDPnggh4iw5v41rnMGGtmsCczrEY"
            const res = await request(server).get('/hobbits').set('Authorization', token);
            expect(res.body).toHaveLength(4);
            expect(res.body[0]).toHaveProperty('name','sam');
            expect(res.status).toBe(200);
        })
    })
})
