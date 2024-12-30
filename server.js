const express = require('express')
require('./server/db/mongoose')
path = require('path'),
fs = require('fs'),
cors = require('cors'),
routers = require('./server/routes/routes.js');

const app = express();
const port = 3001;

app.use('/home', express.static(path.join(__dirname, 'client/html/home.html')));
app.use('/addRoom', express.static(path.join(__dirname, 'client/html/addRoom.html')));
app.use('/reports', express.static(path.join(__dirname, 'client/html/reports.html')));
app.use('/dailyOccupancy', express.static(path.join(__dirname, 'client/html/dailyOccupancy.html')));
app.use('/roomMng', express.static(path.join(__dirname, 'client/html/roomMng.html')));
app.use('/roomReservations', express.static(path.join(__dirname, 'client/html/roomReservations.html')));
app.use('/pickDate', express.static(path.join(__dirname, 'client/html/pickDate.html')));
app.use('/guestDetails', express.static(path.join(__dirname, 'client/html/guestDetails.html')));
app.use('/getAllClients', express.static(path.join(__dirname, 'client/html/getAllClients.html')));
app.use('/diningRoom', express.static(path.join(__dirname, 'client/html/diningRoom.html')));

////////////////////////////////////////////////////////////////////////////////
app.use('/login', express.static(path.join(__dirname, 'client/html/login.html')));
app.use('/main', express.static(path.join(__dirname, 'client/html/index.html')));
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
