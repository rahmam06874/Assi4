const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

const FILE_PATH = './users.json';
function readData() {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data);
}

function writeData(data) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

//1
app.post('/user', (req, res) => {
    const { name, age, email } = req.body;
    const users = readData();

    const emailExists = users.find(u => u.email === email);
    if (emailExists) {
        return res.json({ "message": "Email already exists." });
    }

    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

    const newUser = { id: newId, name, age, email };
    users.push(newUser);
    writeData(users);

    res.json({ "message": "User added successfully." });
});

//2
app.patch('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, age, email } = req.body;
    const users = readData();

    const user = users.find(u => u.id === id);
    if (!user) {
        return res.json({ "message": "User ID not found." });
    }
    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age;
    if (email !== undefined) user.email = email;

    writeData(users);
    res.json({ "message": "User age updated successfully." });          
});

//3
app.delete('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let users = readData();

    const userExists = users.find(u => u.id === id);
    if (!userExists) {
        return res.json({ "message": "User ID not found." });
    }
    users = users.filter(u => u.id !== id);
    writeData(users);

    res.json({ "message": "User deleted successfully." });
});

//4
app.get('/user/getByName', (req, res) => {
    const nameQuery = req.query.name;
    const users = readData();

    const user = users.find(u => u.name === nameQuery);
    if (!user) {
        return res.json({ "message": "User name not found." });
    }

    res.json(user);
});

//5
app.get('/user', (req, res) => {
    const users = readData();
    res.json(users);
});

//6
app.get('/user/filter', (req, res) => {
    const minAge = parseInt(req.query.minAge);
    const users = readData();

    const filteredUsers = users.filter(u => u.age >= minAge);
    if (filteredUsers.length === 0) {
        return res.json({ "message": "no user found" });
    }

    res.json(filteredUsers);
});


//7
app.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const users = readData();

    const user = users.find(u => u.id === id);
    if (!user) {
        return res.json({ "message": "User not found." });
    }

    res.json(user);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
