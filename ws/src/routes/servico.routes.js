const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const aws = require('../services/aws');   
const Arquivo = require('../models/arquivo');
const Servico = require('../models/servico');

//rota recebe Formdata
router.post('/', upload.array("files"), async (req, res) => {

  try {

    const { salaoId, servico } = req.body;

    let errors = [];
    let arquivos = [];

    if (req.files && req.files.length > 0) {

      for (let file of req.files) {

        const nameParts = file.originalname.split('.');

        const fileName = `d${new Date().getTime()}.${
          nameParts[nameParts.length - 1]
        }`;

        const path = `servicos/${salaoId}/${fileName}`;

        const response = await aws.uploadToS3(file, path);

        if (response.error) {
          errors.push({ error: true, message: response.message });
        } else {
          arquivos.push(path);
        }

      }

    }
    
    if (errors.length > 0) {
      return res.json(errors[0]);
    }
    
    let jsonServico = JSON.parse(servico);

    const servicoCadastrado = await Servico(jsonServico).save();
    
    arquivos = arquivos.map((arquivo) => ({
      referenciaId: servicoCadastrado._id,
      model: 'Servico',
      caminho: arquivo
    }));

    await Arquivo.insertMany(arquivos);

    res.json({ servico: servicoCadastrado, arquivos });

  } catch (err) {

    res.json({ error: true, message: err.message });

  }

});

module.exports = router;