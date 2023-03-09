const Hobbit = require('./hobbits-model');
const db = require('../../data/dbConfig');


test('test environment testing olarak ayarlanmış', ()=>{
    expect(process.env.NODE_ENV).toBe("testing")
})

beforeAll(async ()=> {
    await db.migrate.rollback();
    await db.migrate.latest();
})

beforeEach(async ()=> {
    await db.seed.run();
})

describe('getAll', ()=> {
    test('[1] tüm hobbitler geliyor mu', async ()=> {
        const hobbitler = await Hobbit.getAll();
        expect(hobbitler).toBeDefined();
        expect(hobbitler).toHaveLength(4);
        expect(hobbitler[0]).toHaveProperty('name', 'sam');
        expect(hobbitler[1]).toHaveProperty('name', 'frodo');
        expect(hobbitler[2]).toHaveProperty('name', 'pippin');
        expect(hobbitler[3]).toHaveProperty('name', 'merry');
    })
})

describe('getById', ()=> {
    test('[2] doğru formatta geri dönüyor', async ()=> {
        const result = await Hobbit.getById(1);
        expect(result).toBeDefined();
        expect(result).toMatchObject({name:'sam'});
        expect(result).toHaveProperty('name', 'sam');
    })
    test('[3] id\'si kayıtlı olmayanı dönmüyor', async ()=> {
        const result = await Hobbit.getById(99);
        expect(result).not.toBeDefined();
    })
})

describe('insert', ()=> {
    test('[4] yeni kişiyi başarılı şekilde ekliyor', async ()=> {
        const newHobbit = {name:'bilbo'}
        const result = await Hobbit.insert(newHobbit);
        expect(result).toHaveProperty('name', 'bilbo');
    })
    test('[5] yeni kişiyi doğru formatta döndü', async ()=> {
        const newHobbit = {name:'bilbo'}
        const result = await Hobbit.insert(newHobbit);
        expect(result).toEqual({id:5, name:'bilbo'});
    })
    test('[6] db\'ye doğru kayıt oldu', async ()=> {
        const newHobbit = {name:'bilbo'}
        await Hobbit.insert(newHobbit);
        const hobbitler = await db('hobbits');
        expect(hobbitler).toHaveLength(5);
    })
})