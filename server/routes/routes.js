const express = require('express'),
conferenceRoutes = require('./conference');

var router = express.Router();

// POST request to create a new client
router.post('/client', conferenceRoutes.CreateClient);

router.get('/checkRoomStatus/:roomId', conferenceRoutes.CheckRoomStatus);
router.get('/saveBuildingOnLoad', conferenceRoutes.SaveBuildingOnLoad);
router.post('/createOrUpdateRoom', conferenceRoutes.CreateOrUpdateRoom);
router.post('/findBuildingId', conferenceRoutes.FindBuildingId);
router.post('/saveBuildingData', conferenceRoutes.SaveBuildingData);
router.post('/saveBuildingInfo', conferenceRoutes.SaveBuildingInfo);

// Add route for handling login form submission
router.post('/login', conferenceRoutes.LoginScript);

module.exports = router;
