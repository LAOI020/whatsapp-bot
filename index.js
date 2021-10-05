
const express = require('express');
const app = express();
require('dotenv').config();
const qr = require('qr-image');
const { getQRdata } = require('./database/storageActions');
const wakeUpDyno = require('./helpers/wakeUpDynoHeroku');
const { initWhatsApp } = require('./initWhatsApp');


app.use(express.urlencoded({extended: true}));


initWhatsApp();


app.get('/qr', async (req, res) => {
    
    res.writeHead(200, {'content-type': 'image/svg+xml'});

    const qrData = await getQRdata();

    const qrSVG = qr.image(qrData, {type: 'svg', margin: 4});
    
    qrSVG.pipe(res);
});

app.use('/api/bitacora-soporte', require('./routes/bitacoraSoporte'));


app.listen(9000, () => {
    console.log('server ready');
    
    wakeUpDyno('url heroku app');
})