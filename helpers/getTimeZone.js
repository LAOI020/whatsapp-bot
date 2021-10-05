
const https = require('https');
const moment = require('moment');
require('moment/locale/es-mx');


const getTimeZone = () => {

    return new Promise((resolve) => {
        https.get('https://worldtimeapi.org/api/timezone/America/Mexico_City',
            res => {

                let result;
                // {
                //     abbreviation: 'CDT',
                //     client_ip: '177.248.221.79',
                //     datetime: '2021-09-16T23:36:01.317996-05:00',
                //     day_of_week: 4,
                //     day_of_year: 259,
                //     dst: true,
                //     dst_from: '2021-04-04T08:00:00+00:00',
                //     dst_offset: 3600,
                //     dst_until: '2021-10-31T07:00:00+00:00',
                //     raw_offset: -21600,
                //     timezone: 'America/Mexico_City',
                //     unixtime: 1631853361,
                //     utc_datetime: '2021-09-17T04:36:01.317996+00:00',
                //     utc_offset: '-05:00',
                //     week_number: 37
                // }

                res.on('data', data => {
                    result = data.toString();
                });
    
                res.on('end', () => {
                    const resultJson = JSON.parse(result);
                    
                    let dateTimeFormat = 
                        moment(resultJson.datetime)
                        .format('DD/MMM/YY h:m:A')
                        .toUpperCase()
                        .replace('.', '');

                    resolve(dateTimeFormat);
                });
        })
    });
};


module.exports = getTimeZone;