const express = require('express')
require('./server/db/mongoose')
path = require('path'),
fs = require('fs'),
cors = require('cors'),
routers = require('./server/routes/routes.js');

const app = express();
const port = 3001;

app.use('/login', express.static(path.join(__dirname, 'client/html/login.html')));
app.use('/main', express.static(path.join(__dirname, 'client/html/index.html')));
app.use('/roomMaps', express.static(path.join(__dirname, 'client/html/roomMaps.html')));
app.use('/building1_building', express.static(path.join(__dirname, 'client/html/buildings/building1.html')));
app.use('/building2_building', express.static(path.join(__dirname, 'client/html/buildings/building2.html')));
app.use('/gefen_building', express.static(path.join(__dirname, 'client/html/buildings/gefen_building.html')));
app.use('/dekel_building', express.static(path.join(__dirname, 'client/html/buildings/dekel_building.html')));
app.use('/brosh_building', express.static(path.join(__dirname, 'client/html/buildings/brosh_building.html')));
app.use('/vered_building', express.static(path.join(__dirname, 'client/html/buildings/vered_building.html')));
app.use('/alon_building', express.static(path.join(__dirname, 'client/html/buildings/alon_building.html')));
app.use('/savion_building', express.static(path.join(__dirname, 'client/html/buildings/savion_building.html')));
app.use('/calanit_building', express.static(path.join(__dirname, 'client/html/buildings/calanit_building.html')));
app.use('/rimon_building', express.static(path.join(__dirname, 'client/html/buildings/rimon_building.html')));
app.use('/shaked_building', express.static(path.join(__dirname, 'client/html/buildings/sheked_building.html')));
app.use('/havatzelet_building', express.static(path.join(__dirname, 'client/html/buildings/havatzelet_building.html')));
app.use('/duvdevan_building', express.static(path.join(__dirname, 'client/html/buildings/duvdevan_building.html')));
app.use('/hadas_building', express.static(path.join(__dirname, 'client/html/buildings/hadas_building.html')));
app.use('/zait_building', express.static(path.join(__dirname, 'client/html/buildings/zait_building.html')));
app.use('/nurit_building', express.static(path.join(__dirname, 'client/html/buildings/nurit_building.html')));
app.use('/rakefet_building', express.static(path.join(__dirname, 'client/html/buildings/rakefet_building.html')));
app.use('/tehena_building', express.static(path.join(__dirname, 'client/html/buildings/tehena_building.html')));
app.use('/details_form', express.static(path.join(__dirname, 'client/html/details_form.html')));
app.use('/js', express.static(path.join(__dirname, 'client/js')));

app.get('/', (req, res) => {
    fs.readFile('client/html/login.html', (err, html) => {
        if (err) {
            throw err;
        }

        res.writeHeader(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
    })
});

app.use('/css', express.static(path.join(__dirname, 'client/css')));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routers);

const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});
