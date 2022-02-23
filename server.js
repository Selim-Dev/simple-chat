const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const Message = require('./models/Message');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());
const messages = [
    { name: 'ali', message: 'test' },
    { name: 'sleem', message: 'i am here' },
];

app.get('/messages', async(req, res) => {
    try {
        const messages = await Message.find();
        if (!messages) throw new Error("Couldn't Retrieve messages");
        res.send(messages);
    } catch (err) {
        res.status(400).send(`Something Went Wrong: ${err.message}`);
    }
});
app.get('/messages/:user', async(req, res) => {
    try {
        const messages = await Message.find({ name: req.params.user });
        if (!messages) throw new Error("Couldn't Retrieve messages");
        res.send(messages);
    } catch (err) {
        res.status(400).send(`Something Went Wrong: ${err.message}`);
    }
});
app.post('/messages', async(req, res) => {
    try {
        const { name, message } = req.body;
        const savedMessage = await Message.create({ name, message });
        if (!savedMessage) throw new Error("message didn't Send");
        const censored = await Message.findOne({ message: 'badword' });
        console.log(censored);
        if (censored) {
            console.log('censored word found');
            await Message.findByIdAndDelete(censored._id);
        } else {
            io.emit('message', savedMessage);
        }
        res.status(200).send(savedMessage);
    } catch (err) {
        res.status(500).send(`Bad Request: ${err.message}`);
        return console.error(err.message);
    } finally {
        console.log('message post called');
    }
});

mongoose.connect(
    'mongodb+srv://alisleem:alisleem@cluster0.5av40.mongodb.net/simple-chat?retryWrites=true&w=majority',
    (err) => {
        if (err) process.exit(1);
        console.log('mongo db Connected', err);
    }
);

io.on('connection', (socket) => {
    console.log('user connected ');
});

http.listen(port, () => {
    console.log(`Server is Listening on port ${port}`);
});