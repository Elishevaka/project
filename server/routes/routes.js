const express = require('express'),
conferenceRoutes = require('./conference');

var router = express.Router();
////////////////////////////////////////////
router.post('/addRoom', conferenceRoutes.AddRoom);

router.get('/getAllRooms', conferenceRoutes.GetAllRooms);
router.get('/getAllCustomers', conferenceRoutes.GetClients);
router.get('/reports/download/:fileName', conferenceRoutes.DownloadFile);
router.delete('/deleteRoom/:roomId', conferenceRoutes.DeleteRoom);

router.put('/updateRoom/:id', conferenceRoutes.UpdateRoom);
router.put('/updateCustomer/:id', conferenceRoutes.UpdateCustomer);
// router.put('/deleteCustomer/:id', conferenceRoutes.DeleteCustomer);

/////////////////////////////////////////////
router.post('/api/getAvailableRooms', conferenceRoutes.GetAvailableRooms);
router.post('/api/bookRoom', conferenceRoutes.BookRoom);
router.post('/api/sendMail', conferenceRoutes.SendMail);
router.post('/api/getDailyOccupancy', conferenceRoutes.GetDailyOccupancy);
router.get('/api/reports', conferenceRoutes.GetReports);
router.get('/api/reports/building-list', conferenceRoutes.GetBuildingList);
router.get('/api/reports/client-list', conferenceRoutes.GetClientList);
router.get('/api/reports/building', conferenceRoutes.GetBuildingListById);
router.get('/api/reports/client', conferenceRoutes.GetClientReportById);

// Add route for handling login form submission
router.post('/login', conferenceRoutes.LoginScript);

module.exports = router;
