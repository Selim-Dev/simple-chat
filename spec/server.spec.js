const axios = require('axios');
describe('calc', () => {
    it('should muliply 2 and 2 ', () => {
        expect(2 * 2).toBe(4);
    });
});
describe('get messages', () => {
    it('should return 200 ok', async() => {
        const messages = await axios.get('http://localhost:3000/messages');
        expect(messages.status).toEqual(200);
        console.log();
    });
    it('should return not empty list', async() => {
        const messages = await axios.get('http://localhost:3000/messages');
        expect(messages.data.length).toBeGreaterThan(0);
        console.log();
    });
});
describe('get messages from a user', () => {
    it('should return 200 ok', async() => {
        const messages = await axios.get('http://localhost:3000/messages/ali');
        expect(messages.status).toEqual(200);
        console.log();
    });
    it('name should be ali ', async() => {
        const messages = await axios.get('http://localhost:3000/messages/ali');
        expect(messages.data[0].name).toEqual('ali');
        console.log();
    });
});