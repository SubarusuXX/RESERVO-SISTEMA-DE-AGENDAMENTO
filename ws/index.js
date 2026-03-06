require("dotenv").config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
require('./database');

// Middleware de upload de arquivos
app.use(busboy());
app.use(busboyBodyParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Configurações de porta
app.set('port',8000);

// Rotas
app.use('/salao', require('./src/routes/salao.routes'));
app.use('/servico', require('./src/routes/servico.routes'));

app.listen(app.get('port'), () => {
    console.log(`WS  escutando na porta ${app.get('port')}` );
});