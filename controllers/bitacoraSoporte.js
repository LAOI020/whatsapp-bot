
const { response } = require('express');
const { sendMedia, sendMessage } = require('../initWhatsApp');


const sendMessageWhatsapp = (req, res = response) => {
    const {sendTo, imageBase64, message} = req.body;

    try {
        if(imageBase64){
            sendMedia(sendTo, imageBase64, message);
        } else {
            sendMessage(sendTo, message);
        }
        
    } catch (err) {
        console.log('ERROR FUNCTION sendMessageWhatsapp');
        console.log(err);

        res.status(500).json({
            ok: false,
            msg: 'ERROR FUNCTION sendMessageWhatsapp'
        });
    }
};


module.exports = {
    sendMessageWhatsapp
}