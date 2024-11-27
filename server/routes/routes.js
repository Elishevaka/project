const express = require('express'),
conferenceRoutes = require('./conference');

var router = express.Router();
////////////////////////////////////////////
router.post('/addRoom', conferenceRoutes.AddRoom);

router.get('/getAllRooms', conferenceRoutes.GetAllRooms);
router.delete('/deleteRoom/:roomId', conferenceRoutes.DeleteRoom);

router.put('/updateRoom/:id', conferenceRoutes.UpdateRoom);

/////////////////////////////////////////////
router.post('/api/getAvailableRooms', conferenceRoutes.GetAvailableRooms);
router.post('/api/bookRoom', conferenceRoutes.BookRoom);
router.post('/api/sendMail', conferenceRoutes.SendMail);

// Add route for handling login form submission
router.post('/login', conferenceRoutes.LoginScript);

module.exports = router;
