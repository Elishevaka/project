const express = require('express')
require('./server/db/mongoose')
path = require('path'),
fs = require('fs'),
cors = require('cors'),
routers = require('./server/routes/routes.js');

const app = express();
const port = 3001;

app.use('/main', express.static(path.join(__dirname, 'client/html/index.html')));
app.use('/roomMaps', express.static(path.join(__dirname, 'client/html/roomMaps.html')));
app.use('/building1', express.static(path.join(__dirname, 'client/html/buildings/building1.html')));
app.use('/building2', express.static(path.join(__dirname, 'client/html/buildings/building2.html')));
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
app.use('/tamar_building', express.static(path.join(__dirname, 'client/html/buildings/tamar_building.html')));
app.use('/details_form', express.static(path.join(__dirname, 'client/html/details_form.html')));
app.use('/js', express.static(path.join(__dirname, 'client/js')));

app.get('/', (req, res) => {
    fs.readFile('client/html/index.html', (err, html) => {
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
