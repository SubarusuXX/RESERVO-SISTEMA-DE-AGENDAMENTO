const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
//const testeaws = require('../services/testeaws');   
const Arquivo = require('../models/arquivo');
const Servico = require('../models/servico');

//rota recebe Formdata
router.post('/', async (req, res) => {
    let busboy = new Busboy({ headers: req.headers}); //toda a informacao do arquivo vem no header da requisicao
    busboy.on('finish', async () => {
        try {
            const {salaoId, servico} = req.body; 
            let errors = [];
            let arquivos = [];

            /*
                {
                    "1213213232131231": {....}
                    "1213213232131231": {....}
                    "1213213232131231": {....}
                }
            */
                          
            if (req.files && Object.keys(req.files)> 0) {
            for (let key of Object.keys(req.files)) {
                const file = req.files[key];

                //1231231.jpg
                const nameParts = file.name.split('.'); //pega o nome do arquivo e separa por ponto, para pegar a extensao
                const fileName = `d${new Date().getTime()}.${
                    nameParts[nameParts.length - 1]
                }`; 
                const path = `servicos/${salaoId}/${fileName}`;

                const response = await testeaws.uploadToS3(file, path);

                if (response.error) {
                    errors.push ({error : true, message: response.message});
                } else {
                    arquivos.push(path)
                }
              }
            }

            if (errors.length > 0) {
                return res.json(errors[0]);
                return false;
            }

            //criar o serviço

            let jsonServico = JSON.parse(servico);
            const servicoCadastrado = await Servico(jsonServico).save();

            //criar arquivo
            arquivos = arquivos.map((arquivo) => ({
                referenciaId: servicoCadastrado._id,
                model: 'Servico',
                caminho: arquivo,
            }));

            await Arquivo.insertMany(arquivos);

            res.json({servico: servicoCadastrado, arquivos});
        }   catch (err) {
            res.json({ error: true, message: err.message });
        }
    }); 
    req.pipe(busboy);
});
module.exports = router;