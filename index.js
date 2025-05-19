const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/protected', (req,res) =>{
    res.send('Hello!')
});

app.listen(5000, ()=> console.log('Listning on:5000'));