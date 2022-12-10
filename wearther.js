const fs = require('fs');
const http = require('http');
var requests = require('requests');

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", Math.trunc(orgVal.main.temp - 268));
    temperature = temperature.replace("{%tempmin%}", Math.trunc(orgVal.main.temp_min) - 268);
    temperature = temperature.replace("{%tempmax%}", Math.trunc(orgVal.main.temp_max) - 268);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    return temperature;

}

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        requests("https://api.openweathermap.org/data/2.5/weather?q=panna&appid=bed3479113141c1e3ed234ce9f4964df", )
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrdata = [objdata];
                const realTimeData = arrdata.map(val => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);

                res.end();
            });
    }
});

server.listen(8000, "127.0.0.1");