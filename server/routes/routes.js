const express = require('express'),
conferenceRoutes = require('./conference');

var router = express.Router();
////////////////////////////////////////////
router.post('/addRoom', conferenceRoutes.AddRoom);
router.post('/createTable', conferenceRoutes.CreateTable);
router.get('/api/table-data', conferenceRoutes.GetTableData);
router.post('/api/table-reservations', conferenceRoutes.TableReservations);
router.post('/api/reserveTable', conferenceRoutes.ReserveTable);
router.post('/assignTableToOrder', conferenceRoutes.AssignTableToOrder);

router.get('/getAllRooms', conferenceRoutes.GetAllRooms);
router.get('/getAllCustomers', conferenceRoutes.GetClients);
router.get('/getAllTables', conferenceRoutes.GetAllTable);
router.get('/getReservationsForDate', conferenceRoutes.GetReservationsForDate);
router.get('/reports/download/:fileName', conferenceRoutes.DownloadFile);
router.get('/api/revenueByDate', conferenceRoutes.RevenueByDates);
router.get('/api/revenueByPaymentType', conferenceRoutes.RevenueByPaymentType);
router.delete('/deleteRoom/:roomId', conferenceRoutes.DeleteRoom);
router.delete('/deleteOrder/:id', conferenceRoutes.DeleteOrder);

router.put('/updateRoom/:id', conferenceRoutes.UpdateRoom);
router.put('/updateCustomer/:id', conferenceRoutes.UpdateCustomer);
router.put('/updateOrder/:id', conferenceRoutes.UpdateOrder);
router.put('/updateTable/:id', conferenceRoutes.UpdateTable);
// router.put('/deleteCustomer/:id', conferenceRoutes.DeleteCustomer);

/////////////////////////////////////////////
router.post('/api/getAvailableRooms', conferenceRoutes.GetAvailableRooms);
router.post('/api/bookRoom', conferenceRoutes.BookRoom);
router.post('/api/sendMail', conferenceRoutes.SendMail);
router.post('/api/getDailyOccupancy', conferenceRoutes.GetDailyOccupancy);
router.get('/api/reports', conferenceRoutes.GetReports);
router.get('/api/reports/building-list', conferenceRoutes.GetBuildingList);
router.get('/api/reports/building', conferenceRoutes.GetBuildingListById);
router.get('/api/reports/all-customers', conferenceRoutes.GetAllCustomersReport);
router.get('/api/reports/client-list', conferenceRoutes.GetClientList);
router.get('/api/reports/client', conferenceRoutes.GetClientReportById);
router.get('/api/reports/order-list', conferenceRoutes.GetOrderList);
router.get('/api/reports/order', conferenceRoutes.GetOrderReportById);

// New routes to generate reports for rooms entering or leaving today
router.get('/api/reports/entering-on-date', conferenceRoutes.GetEnteringOnDateReport);
router.get('/api/reports/leaving-on-date', conferenceRoutes.GetLeavingOnDateReport);



router.get('/orders', conferenceRoutes.OrdersByDates);

// Add route for handling login form submission
router.post('/login', conferenceRoutes.LoginScript);

module.exports = router;
