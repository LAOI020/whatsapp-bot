
const { Client, MessageMedia } = require('whatsapp-web.js');
const { uploadFileSessionWhatsApp, getFileSessionWhatsApp, uploadQRdata } = require('./database/storageActions');
const answerReportsWhatsApp = require('./helpers/bitacora-soporte/answerReportsWhatsApp');


let client;
let sessionData;

const initWhatsApp = async () => {
    try {
        
        const checkFileExits = await getFileSessionWhatsApp();
            
        if(checkFileExits){
            whatsAppWithSession();

        } else {
            whatsAppWithOutSession();
        }

    } catch (err) {
        console.log('function initWhatsApp error');
        console.log(err);
    }
};


const whatsAppWithSession = async () => {

    sessionData = await getFileSessionWhatsApp();

    client = new Client({
        session: sessionData
    });
    
    client.on('ready', () => {
        console.log('whatsapp ready, con sesion');

        listenMessage();
    });

    client.on('auth_failure', async () => {
        console.log('whatsapp error en la autenticacion, con sesion');

        const logOutClient = new Promise((resolve) => {
            resolve(client.logout());

        }).catch((err) => {
            console.log('error al cerrar sesion');
            console.log(err);
        });

        await logOutClient;

        await client.destroy();
        
        whatsAppWithOutSession();
    });

    client.on('disconnected', () => {
        console.log('usuario desconectado, con sesion');
        
        const logOutClient = new Promise((resolve) => {
            resolve(client.logout());

        }).catch((err) => {
            console.log('error al cerrar sesion');
            console.log(err);
        });

        await logOutClient;

        await client.destroy();
        
        whatsAppWithOutSession();
    });

    client.initialize().catch((err) => {
        console.log('client initialize catch');
        console.log(err);
    })
};


const whatsAppWithOutSession = () => {

    client = new Client();

    client.on('qr', (qr) => {
        console.log('whatsapp event qr, sin sesion');
        
        uploadQRdata(qr);
    });

    client.on('ready', () => {
        console.log('whatsapp ready, sin sesion');

        listenMessage();
    });

    client.on('authenticated', (session) => {
        console.log('whatsapp autenticado');
        console.log(session);

        sessionData = session;

        uploadFileSessionWhatsApp(session);
    });

    client.on('auth_failure', () => {
        console.log('whatsapp error en la autenticacion, sin sesion');
    });

    client.on('disconnected', () => {
        console.log('usuario desconectado, sin sesion');
    });
    
    client.initialize();
};


const listenMessage = () => {
    client.on('message', async (message) => {
        
        let {body} = message;
        body = body.toUpperCase().trim();
        
        if(
            body === 'SI' || 
            body === 'NO' || 
            body.includes('SOLUCIONADO') ||
            body == 'LISTO'
        ){

            await answerReportsWhatsApp(message);

            return;
        }
    });
};


const sendMessage = async (numberPhone, text) => {
    if(numberPhone.length === 10){
        numberPhone = `521${numberPhone}@c.us`;
    }
    
    await client.sendMessage(numberPhone, text);
};


const sendMedia = async (numberPhone, imageBase64, caption = null) => {
    if(numberPhone.length === 10){
        numberPhone = `521${numberPhone}@c.us`;
    }
    
    const media = new MessageMedia('image/jpg', imageBase64);

    await client.sendMessage(
        numberPhone, media, {caption: caption || null}
    );
};


module.exports = {
    initWhatsApp,
    sendMessage,
    sendMedia
}