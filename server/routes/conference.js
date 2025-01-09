const Client = require('../models/client.js')
const RoomBooking = require('../models/roomBooking.js')
const Room = require('../models/room.js')
const Building = require('../models/building.js')
const Order = require('../models/order.js')
const Login = require('../models/login.js');
const DiningTable = require('../models/diningRoom.js');
const TableReservation = require('../models/tableReservation.js');

const nodemailer = require("nodemailer");
const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

module.exports = {

    LoginScript: async function (req, res) {
        const { username, password } = req.body;
        try {
            // Find the user by username
            const userDB = await Login.findOne({ username });

            if (!userDB) {
                return res.status(401).json({ message: 'שם משתמש או סיסמא שגויים' });
            }

            if (password === userDB.password) {
                // Authentication successful
                return res.status(200).json({ message: 'הכניסה הצליחה' });
            } else {
                // Authentication failed
                return res.status(401).json({ message: 'שם משתמש או סיסמא שגויים' });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error, please try again later.' });
        }
    },
    AddRoom: async function (req, res) {
        const { roomNumber, buildingName, numOfRooms, numBeds, floor, price } = req.body;

        try {
            // Check if the building exists by name
            let building = await Building.findOne({ buildingName: buildingName.trim() });

            if (building) {
                const existingRoom = await Room.findOne({ roomNumber, buildingId: building._id });

                if (existingRoom) {
                    return res.status(400).json({ error: 'Room already exists in this building.' });
                }

                // Add new room to the existing building
                const newRoom = new Room({
                    roomNumber: roomNumber,
                    buildingId: building._id,
                    buildingName: building.buildingName,
                    numOfRooms: numOfRooms,
                    numBeds: numBeds,
                    floor: floor,
                    price: price
                });
                await newRoom.save();
                building.numberOfRooms += 1;
                await building.save();

                return res.status(200).json({ message: `Room ${roomNumber} added to ${buildingName} successfully!` });

            } else {
                // Create new building if it doesn't exist
                const newBuilding = new Building({
                    buildingName: buildingName.trim(),
                    numberOfRooms: numOfRooms
                });
                await newBuilding.save();

                const newRoom = new Room({
                    roomNumber,
                    buildingId: newBuilding._id,
                    buildingName: newBuilding.buildingName,
                    numOfRooms,
                    numBeds,
                    floor,
                    price
                });
                await newRoom.save();

                return res.status(200).json({ message: `Building ${buildingName} and room ${roomNumber} created successfully!` });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error, please try again later.' });
        }
    },
    CreateTable: async function (req, res) {
        const { tableNumber, diningRoom, numberOfSeats, nearWindow, nearDoor } = req.body;
        console.log("tableNumber, diningRoom, numberOfSeats, nearWindow, nearDoor\n", tableNumber, diningRoom, numberOfSeats, nearWindow, nearDoor);

        try {
            const newTableNumber = `${diningRoom}_${tableNumber}`;
            console.log("newTableNumber\n", newTableNumber);

            // Check if a table with this combined number already exists
            const existingDiningRoom = await DiningTable.findOne({ tableNumber: newTableNumber });

            // // Check if the dining room exists
            // let existingDiningRoom = await DiningTable.findOne({
            //     tableNumber: tableNumber,
            //     diningRoom: diningRoom
            // });
            if (existingDiningRoom) {

                // // Check if the table already exists in this dining room
                // const existingTable = await DiningTable.findOne({
                //     tableNumber,
                //     diningRoom: existingDiningRoom._id
                // });

                // if (existingTable) {
                return res.status(400).json({ error: 'Table already exists in this dining room.' });
                // }

                // // Add new table to the existing dining room
                // const newTable = new DiningTable({
                //     tableNumber,
                //     numberOfSeats,
                //     nearWindow,
                //     nearDoor,
                //     diningRoom: existingDiningRoom._id
                // });
                // await newTable.save();

                // // Optional: Update table count in dining room
                // existingDiningRoom.numberOfTables += 1;
                // await existingDiningRoom.save();

                // return res.status(200).json({ message: `Table ${tableNumber} added to ${diningRoom} successfully!` });
            } else {
                const newTable = new DiningTable({
                    tableNumber: newTableNumber,
                    numberOfSeats,
                    nearWindow,
                    nearDoor,
                    diningRoom
                });
                await newTable.save();

                return res.status(200).json({ message: `Dining room ${diningRoom} and table ${newTableNumber} created successfully!` });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error, please try again later.' });
        }
    },
    GetTableData: async function (req, res) {
        const { date } = req.query;

        try {
            const clients = await Client.find();
            const searchDate = new Date(date);

            // Fetch reservations where the reservation date matches the given date
            const reservations = await TableReservation.find({
                date: searchDate, // Check if the reservation date matches the provided date
            }).populate('diningTableId');

            const reservedTableIds = reservations.map(reservation => reservation.diningTableId._id.toString());
            const availableTables = await DiningTable.find({ _id: { $nin: reservedTableIds } });

            res.status(200).json({ clients, tables: availableTables });
        } catch (error) {
            console.error("Error fetching data:", error);
            res.status(500).json({ error: 'Server error while fetching data' });
        }
    },
    TableReservations: async function (req, res) {
        const { clientId, tableNumber, startDate, endDate } = req.body;
        try {
            const table = await DiningTable.findOne({ tableNumber });
            if (!table) return res.status(404).send('Table not found');

            const reservation = new TableReservation({
                clientId,
                diningTableId: table._id,
                startDate,
                endDate
            });
            await reservation.save();
            res.status(201).send('Table reservation created');
        } catch (error) {
            res.status(500).send('Error creating reservation');
        }
    },
    ReserveTable: async function (req, res) {
        const { clientId, tableNumber, diningRoom, startDate, endDate } = req.body;
        try {
            const table = await DiningTable.findOne({ tableNumber, diningRoom });
            if (!table) {
                return res.status(404).json({ error: 'Table not found' });
            }

            const existingReservation = await TableReservation.findOne({
                diningTableId: table._id,
                $or: [
                    { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
                ]
            });

            if (existingReservation) {
                return res.status(400).json({ error: 'Table already reserved for this date range' });
            }

            const reservation = new TableReservation({
                clientId,
                diningTableId: table._id,
                startDate,
                endDate
            });
            await reservation.save();

            res.status(201).json({ message: 'Table reserved successfully!' });
        } catch (error) {
            console.error("Error reserving table:", error);
            res.status(500).json({ error: 'Server error during reservation' });
        }
    },
    GetAllRooms: async function (req, res) {
        try {
            const rooms = await Room.find().populate('buildingId', 'buildingName'); // Only populate buildingName
            return res.status(200).json(rooms); // Return rooms with building info
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error fetching rooms.' });
        }
    },
    AssignTableToOrder: async function (req, res) {
        // const { orderId, tableId, date } = req.body;
        // try {
        //     // Find the order to get the clientId associated with it
        //     const order = await Order.findById(orderId);
        //     if (!order) {
        //         return res.status(404).json({ error: 'Order not found' });
        //     }

        //     const client_id = order.clientId; // Get the clientId from the order
        //     console.log("client_id\n", client_id);
        //     console.log("TYPE - client_id\n", typeof(client_id));
            
        //     let client = await Client.findOne({ clientId: client_id });
            
        //     // await Order.findByIdAndUpdate(orderId, { tableId: tableId });

        //     // Update or create the table reservation to mark it as occupied for the given date
        //     const reservationUpdate = await TableReservation.updateOne(
        //         { diningTableId: tableId, date: date },
        //         {
        //             $set: {
        //                 clientId: client._id,  // Link the reservation to the client
        //                 status: 'occupied'
        //             }
        //         },
        //         { upsert: true } // Creates a new reservation if it doesn't exist for the date
        //     );

        //     if (reservationUpdate.modifiedCount > 0 || reservationUpdate.upsertedCount > 0) {
        //         // Only update the order if the reservation was successful
        //         await Order.findByIdAndUpdate(orderId, { tableId: tableId });
        //         res.json({ message: 'Table assigned successfully!' });
        //     } else {
        //         res.status(400).json({ error: 'Failed to reserve the table.' });
        //     }
        // } catch (error) {
        //     console.error(error);
        //     res.status(500).json({ error: 'Error assigning table to order.' });
        // }
        const { orderId, tableIds, date } = req.body;
        try {
            // Find the order to get the clientId associated with it
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            const client_id = order.clientId; // Get the clientId from the order
            console.log("client_id\n", client_id);
            console.log("TYPE - client_id\n", typeof(client_id));
            
            let client = await Client.findOne({ clientId: client_id });
            
            for (const tableId of tableIds) {
                const reservationUpdate = await TableReservation.updateOne(
                    { diningTableId: tableId, date: date },
                    {
                        $set: {
                            clientId: client._id,  // Link the reservation to the client
                            status: 'occupied'
                        }
                    },
                    { upsert: true } // Creates a new reservation if it doesn't exist for the date
                );
    
                // If any table update fails, send an error response
                if (reservationUpdate.modifiedCount === 0 && reservationUpdate.upsertedCount === 0) {
                    return res.status(400).json({ error: `Failed to reserve table with ID ${tableId}.` });
                }
            }
    
            // After updating table reservations, update the order with the tableIds
            order.tableIds = tableIds;
            await order.save();
    
            res.json({ message: 'Tables assigned and reserved successfully!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error assigning table to order.' });
        }
    },
    DeleteRoom: async function (req, res) {
        const { roomId } = req.params;

        try {
            // Find the room by its ID
            const room = await Room.findById(roomId);

            if (!room) {
                return res.status(404).json({ error: 'Room not found.' });
            }

            // Find the associated building and decrement its numberOfRooms
            const building = await Building.findById(room.buildingId);

            if (building) {
                building.numberOfRooms -= 1;
                await building.save();
            }

            // Delete the room from the database
            await Room.findByIdAndDelete(roomId);

            res.status(200).json({ message: `Room ${room.roomNumber} from ${room.buildingName} deleted successfully!` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error, please try again later.' });
        }
    },
    // Update Room
    UpdateRoom: async function (req, res) {
        const roomId = req.params.id;
        const { roomNumber, numBeds, floor, numOfRooms, price } = req.body;

        try {
            // Find the room and update it
            const updatedRoom = await Room.findByIdAndUpdate(roomId, {
                roomNumber,
                numBeds,
                floor,
                numOfRooms,
                price
            }, { new: true });

            if (!updatedRoom) {
                return res.status(404).json({ error: 'Room not found' });
            }

            res.status(200).json({ message: 'Room updated successfully', updatedRoom });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error, please try again later.' });
        }
    },
    // Update Client
    UpdateCustomer: async function (req, res) {
        const _id = req.params.id;
        const { clientId, name, email, phone, city, address, zipCode } = req.body;
        //const { name, email, phone, city, address, zipCode } = req.body;

        try {
            // Find the customer and update it
            const updatedCustomer = await Client.findByIdAndUpdate(_id, {
                clientId,
                name,
                email,
                phoneNumber: phone,
                city,
                address,
                zipCode
            }, { new: true }); // The `{ new: true }` option returns the updated document

            if (!updatedCustomer) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            res.status(200).json({ message: 'Customer updated successfully', updatedCustomer });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error, please try again later.' });
        }
    },

    GetAvailableRooms: async function (req, res) {
        const { startDate, endDate } = req.body;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start and end dates are required' });
        }

        try {

            const start = parseDateString(startDate);
            start.setUTCHours(0, 0, 0, 0);

            const end = parseDateString(endDate);
            end.setUTCHours(0, 0, 0, 0);

            // Query to find rooms that are not booked within the selected range
            const unavailableRooms = await RoomBooking.find({
                $or: [
                    { startDate: { $lt: end }, endDate: { $gt: start } } // Overlapping dates
                ]
            }).select('roomId');

            // Get IDs of unavailable rooms
            const unavailableRoomIds = unavailableRooms.map(room => room.roomId);

            // Find rooms that are not in the list of unavailable room IDs
            const availableRooms = await Room.find({ _id: { $nin: unavailableRoomIds } })
                .populate('buildingId', 'buildingName'); // Populate building name if needed

            res.status(200).json(availableRooms);
        } catch (error) {
            console.error("Error fetching available rooms:", error);
            res.status(500).json({ error: 'Server error, please try again later.' });
        }
    },
    GetClients: async function (req, res) {
        try {
            // Fetch all clients
            const clients = await Client.find();
            console.log("clients: \n", clients);

            res.status(200).json(clients);
        } catch (error) {
            console.error("Error fetching clients:", error);
            res.status(500).json({ error: 'Error fetching clients' });
        }
    },
    GetAllTable: async function (req, res) {
        try {
            const tables = await DiningTable.find();
            res.status(200).json(tables);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    GetReservationsForDate: async function (req, res) {
        const { date } = req.query;
        console.log("date\n", date);

        try {
            const reservations = await TableReservation.find({
                date: new Date(date) // Filter reservations for the selected date
            }).populate('diningTableId'); // Populate dining table details
            console.log("reservations\n", reservations);

            res.status(200).json(reservations);
        } catch (error) {
            console.error("Error fetching reservations:", error);
            res.status(500).json({ error: 'Error fetching reservations' });
        }
    },
    BookRoom: async function (req, res) {
        const { roomIds, startDate, endDate, guestName, guestEmail, guestId, phoneNumber, extraMattresses, babyBed, payment, specialRequests, city, zipCode, address, price } = req.body;

        if (!roomIds || !Array.isArray(roomIds) || roomIds.length === 0 || !startDate || !endDate || !guestName || !guestId || !phoneNumber || !price) {
            return res.status(400).json({ error: 'Room IDs, dates, and guest details are required.' });
        }
        if (!payment || !['No payment', 'Credit', 'Check', 'Cash'].includes(payment)) {
            return res.status(400).json({ error: 'Invalid payment option selected.' });
        }

        try {

            // Parse dates
            const start = parseDateString(startDate);
            const end = parseDateString(endDate);

            if (start >= end) {
                return res.status(400).json({ error: 'End date must be after start date.' });
            }
            // Check availability for all rooms
            const conflictingBookings = await RoomBooking.find({
                roomId: { $in: roomIds },
                $or: [
                    { startDate: { $lt: end }, endDate: { $gt: start } }
                ],
                status: 'booked'
            });

            if (conflictingBookings.length > 0) {
                return res.status(400).json({
                    error: 'Some rooms are already booked within the selected date range.',
                    conflictingRooms: conflictingBookings.map(booking => booking.roomId)
                });
            }
            // Create or find the client
            let client = await Client.findOne({ clientId: guestId });

            if (!client) {
                client = new Client({
                    clientId: guestId,
                    name: guestName,
                    email: guestEmail,
                    phoneNumber,
                    city: city,
                    zipCode: zipCode,
                    address: address
                });
                await client.save();
            }

            // Create a single order
            const order = new Order({
                clientId: guestId,
                roomIds,
                startDate: start,
                endDate: end,
                amount: extraMattresses*100, // Example amount calculation, adjust as needed
                paymentBy: payment
            });
            await order.save();
            console.log("price: ", price);
            
            // Create bookings for all rooms
            const bookings = roomIds.map(roomId => ({
                roomId,
                startDate: start,
                endDate: end,
                status: 'booked',
                clientId: guestId,
                orderId: order._id,
                extraMattresses: extraMattresses || 0,
                babyBed: babyBed || false,
                specialRequests: specialRequests,
                price: price
            }));

            await RoomBooking.insertMany(bookings);

            res.status(200).json({
                message: 'Rooms successfully booked!',
                orderId: order._id,
                bookings
            });
        } catch (error) {
            console.error("Error booking rooms:", error);
            res.status(500).json({ error: 'Server error, please try again later.' });
        }
    },

    SendMail: async function (req, res) {
        const { recipientEmail, subject, html } = req.body;
        try {
            // Create a transporter object with your email service credentials
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'gw025867014@gmail.com', // My email address
                    pass: 'svbu njya mldf tlbq', // My email password or app password
                },
            });

            //Email options
            const mailOptions = {
                from: 'gw025867014@gmail.com', // Sender address
                to: recipientEmail,            // Recipient address
                subject,                       // Subject of the email
                html                           // HTML body (optional)
            };

            // Send the email
            const info = await transporter.sendMail(mailOptions);
            console.log(`Email sent: ${info.response}`);
            res.status(200).json(info.response);
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Error sending email.' });
        }
    },
    GetDailyOccupancy: async function (req, res) {
        const { date } = req.body;

        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        try {
            queryDate = new Date(date);
            const occupancyData = await RoomBooking.aggregate([
                {
                    $match: {
                        startDate: { $lte: queryDate },
                        endDate: { $gte: queryDate }
                    }
                },
                {
                    $group: {
                        _id: queryDate,
                        occupiedRooms: { $addToSet: "$roomId" },
                        roomDetails: {
                            $push: {
                                roomId: "$roomId",
                                status: "$status"
                            }
                        }
                    }
                },
                {
                    $project: {
                        date: "$_id",
                        occupiedCount: { $size: "$occupiedRooms" },
                        rooms: "$roomDetails"
                    }
                }
            ]);

            // Inside the GetDailyOccupancy function:
            const totalRooms = await Room.find({}).countDocuments(); // Counts all rooms in the database

            const response = {
                date: queryDate,
                occupiedCount: occupancyData[0] ? occupancyData[0].occupiedCount : 0,
                totalRooms: totalRooms,
                rooms: occupancyData[0] ? occupancyData[0].rooms : [] // Use rooms from the aggregation result
            };

            res.status(200).json(response);
        } catch (error) {
            console.error("Error generating daily occupancy data:", error);
            res.status(500).json({ error: 'Server error, please try again later.' });
        }

    },

    GetReports: async function (req, res) {
        try {
            const { type } = req.query;  // 'type' could be used to specify different types of reports

            if (!type) {
                return res.status(400).json({ error: 'Report type is required.' });
            }

            // Generate different reports based on the 'type' query parameter
            if (type === 'roomAvailability') {
                // Report on rooms and their availability
                const rooms = await Room.find();
                const roomBookings = await RoomBooking.find();

                const report = rooms.map(room => {
                    const bookings = roomBookings.filter(booking => booking.roomId.toString() === room._id.toString());
                    const bookingStatus = bookings.length > 0 ? 'Booked' : 'Available';
                    return {
                        roomNumber: room.roomNumber,
                        buildingName: room.buildingName,
                        floor: room.floor,
                        status: bookingStatus
                    };
                });

                return res.status(200).json({
                    message: 'Room availability report generated successfully.',
                    data: report
                });

            } else if (type === 'bookingSummary') {
                // Report on all bookings made within a specific time frame (e.g., past month)
                const startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1);  // Start of last month
                const endDate = new Date();  // Current date

                const bookings = await RoomBooking.find({
                    startDate: { $gte: startDate },
                    endDate: { $lte: endDate },
                }).populate('roomId').populate('clientId');

                const report = bookings.map(booking => {
                    return {
                        roomNumber: booking.roomId.roomNumber,
                        buildingName: booking.roomId.buildingName,
                        startDate: booking.startDate,
                        endDate: booking.endDate,
                        guestName: booking.clientId.guestName,
                        guestEmail: booking.clientId.guestEmail
                    };
                });

                return res.status(200).json({
                    message: 'Booking summary report generated successfully.',
                    data: report
                });

            } else {
                return res.status(400).json({ error: 'Invalid report type.' });
            }

        } catch (error) {
            console.error("Error generating report:", error);
            return res.status(500).json({ error: 'Server error, please try again later.' });
        }
    },
    GetBuildingList: async function (req, res) {
        try {
            const buildings = await Building.find(); // Fetch all buildings
            res.status(200).json(buildings);
        } catch (error) {
            console.error("Error fetching buildings:", error);
            res.status(500).json({ error: 'Error fetching buildings' });
        }
    },
    GetClientList: async function (req, res) {
        try {
            const { searchQuery } = req.query;

            // Search for clients by name or clientId if a search query is provided
            const query = searchQuery
                ? {
                    $or: [
                        { name: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive name search
                        { clientId: parseInt(searchQuery) || null } // Exact match for clientId
                    ]
                }
                : {}; // If no search query, return all clients

            const clients = await Client.find(query).limit(500); // Limit results to avoid performance issues

            if (clients.length === 0) {
                return res.status(404).json({ message: 'לא נמצאו לקוחות תואמים' });
            }

            // Return a list of clients with their name and clientId
            res.status(200).json(clients.map(client => ({
                clientId: client.clientId,
                name: client.name
            })));
        } catch (error) {
            console.error('Error fetching clients:', error);
            res.status(500).json({ error: 'שגיאת שרת פנימית' });
        }
    },
    GetBuildingListById: async function (req, res) {
        try {
            const { buildingId, reportDate } = req.query;

            if (!buildingId || !reportDate) {
                return res.status(400).json({ error: 'buildingId and reportDate are required' });
            }

            // Validate the date format (assuming YYYY-MM-DD format)
            if (!Date.parse(reportDate)) {
                return res.status(400).json({ error: 'Invalid date format' });
            }
            console.log("reportDate: \n ", reportDate);

            // Fetch the report data for the given building and date
            const roomReports = await getRoomReportsForBuildingAndDate(buildingId, reportDate);
            const buildingName = await getBuildingNameById(buildingId);

            // Ensure the `reports` directory exists
            const reportsDir = path.resolve(__dirname, 'reports');
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Room Report", {
                views: [{ rightToLeft: true }]
            });

            worksheet.columns = [
                { header: 'מספר חדר', key: 'roomNumber', width: 15 },
                { header: 'שם האורח', key: 'guestName', width: 20 },
                { header: 'מזרונים נוספים', key: 'extraMattresses', width: 15 },
                { header: 'מיטת תינוק', key: 'babyBed', width: 15 },
                { header: 'זמן צ׳ק-אין', key: 'checkInTime', width: 20 },
                { header: 'זמן צ׳ק-אאוט', key: 'checkOutTime', width: 20 },
                { header: 'סטטוס ההזמנה', key: 'bookingStatus', width: 15 },
                { header: 'בקשות מיוחדות', key: 'specialRequests', width: 40 }
            ];

            roomReports.forEach(report => {
                worksheet.addRow(report);
            });

            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };

            const filePath = path.join(reportsDir, `${buildingId}_Report_${reportDate}.xlsx`);
            await workbook.xlsx.writeFile(filePath);

            res.status(200).json({ fileUrl: `/reports/${buildingId}_Report_${reportDate}.xlsx`, buildingName });
        } catch (error) {
            console.error("Error generating building report:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    GetAllCustomersReport: async function (req, res) {
        const { startDate, endDate } = req.query;

        try {
            // Fetch orders within the specified date range
            const orders = await Order.find({
                startDate: { $gte: new Date(startDate) },
                endDate: { $lte: new Date(endDate) }
            });

            // Populate the order details (like client name, building, room, etc.)
            const orderReports = await generateOrderReport(orders);

            const reportsDir = path.resolve(__dirname, 'reports');
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("All Customers Report", {
                views: [{ rightToLeft: true }]
            });

            worksheet.columns = [
                { header: 'מספר הזמנה', key: 'orderId', width: 20 },
                { header: 'שם האורח', key: 'clientName', width: 20 },
                { header: 'תעודת זהות אורח', key: 'clientId', width: 20 },
                { header: 'שם בניין', key: 'buildingName', width: 15 },
                { header: 'מספר חדר', key: 'roomNumbers', width: 15 },
                { header: 'זמן צ׳ק-אין', key: 'startDate', width: 20 },
                { header: 'זמן צ׳ק-אאוט', key: 'endDate', width: 20 },
                { header: 'מחיר הזמנה', key: 'amount', width: 15 },
                { header: 'שולם ע"י', key: 'paymentBy', width: 15 },
                { header: 'בקשות מיוחדות', key: 'specialRequests', width: 40 }
            ];

            orderReports.forEach(order => {
                worksheet.addRow(order);
            });

            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };

            const filePath = path.join(reportsDir, `All_Customers_Report_${startDate}_to_${endDate}.xlsx`);
            await workbook.xlsx.writeFile(filePath);

            res.status(200).json({ fileUrl: `/reports/All_Customers_Report_${startDate}_to_${endDate}.xlsx` });
        } catch (error) {
            console.error('Error generating all customers report:', error);
            res.status(500).json({ success: false, message: 'Failed to generate all customers report.' });
        }
    },
    GetClientReportById: async function (req, res) {
        try {
            const { clientId } = req.query;

            if (!clientId) {
                return res.status(400).json({ error: 'ClientId is required' });
            }

            const client = await Client.findOne({ clientId });
            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }

            const orders = await RoomBooking.find({ clientId });
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Client Report", {
                views: [{ rightToLeft: true }]
            });

            worksheet.columns = [
                { header: 'שם לקוח', key: 'clientName', width: 20 },
                { header: 'מספר טלפון', key: 'phoneNumber', width: 20 },
                { header: 'דוא"ל', key: 'email', width: 25 },
                { header: 'כתובת', key: 'address', width: 30 },
                { header: 'מספר הזמנה', key: 'orderNumber', width: 20 },
                { header: 'תאריך הזמנה', key: 'orderDate', width: 20 }
            ];

            orders.forEach(order => {
                worksheet.addRow({
                    clientName: client.name,
                    phoneNumber: client.phoneNumber,
                    email: client.email,
                    address: client.address,
                    orderNumber: order._id,
                    orderDate: order.startDate
                });
            });

            worksheet.getRow(1).font = { bold: true };
            const reportsDir = path.resolve(__dirname, 'reports');
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            const filePath = path.join(reportsDir, `Client_Report_${clientId}.xlsx`);
            await workbook.xlsx.writeFile(filePath);

            res.status(200).json({ fileUrl: `/reports/Client_Report_${clientId}.xlsx`, clientName: client.name });
        } catch (error) {
            console.error("Error generating client report:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    GetOrderList: async function (req, res) {
        try {
            const orders = await Order.find();

            // Populate the client name for each order by matching clientId with Client model
            const ordersWithClientNames = await Promise.all(orders.map(async (order) => {
                const client = await Client.findOne({ clientId: order.clientId });

                return {
                    _id: order._id,
                    clientId: order.clientId,
                    clientName: client ? client.name : 'Unknown', // If no client found, default to 'Unknown'
                };
            }));

            res.json(ordersWithClientNames);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
        }
    },
    GetOrderReportById: async function (req, res) {
        const { orderId } = req.query;
        try {
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found.' });
            }

            const orderReport = await generateOrderReport([order]); // Pass the order as an array for consistency
            /////
            const reportsDir = path.resolve(__dirname, 'reports');
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Order Report", {
                views: [{ rightToLeft: true }]
            });

            worksheet.columns = [
                { header: 'מספר הזמנה', key: 'orderId', width: 20 },
                { header: 'שם האורח', key: 'clientName', width: 20 },
                { header: 'תעודת זהות אורח', key: 'clientId', width: 20 },
                { header: 'שם בניין', key: 'buildingName', width: 15 },
                { header: 'מספר חדר', key: 'roomNumbers', width: 15 },
                { header: 'זמן צ׳ק-אין', key: 'startDate', width: 20 },
                { header: 'זמן צ׳ק-אאוט', key: 'endDate', width: 20 },
                { header: 'מחיר הזמנה', key: 'amount', width: 15 },
                { header: 'שולם ע"י', key: 'paymentBy', width: 15 },
                { header: 'בקשות מיוחדות', key: 'specialRequests', width: 40 }
            ];

            orderReport.forEach(order => {
                worksheet.addRow(order);
            });

            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };

            const filePath = path.join(reportsDir, `${orderId}_Report.xlsx`);
            await workbook.xlsx.writeFile(filePath);

            res.status(200).json({ fileUrl: `/reports/${orderId}_Report.xlsx` });
            ////
            // res.json({ success: true, fileUrl: reportFileUrl, message: 'Order report generated successfully.' });
        } catch (error) {
            console.error('Error generating order report:', error);
            res.status(500).json({ success: false, message: 'Failed to generate order report.' });
        }
    },

    GetEnteringOnDateReport: async function (req, res) {
        const { selectedDate } = req.query;
        try {
            const queryDate = new Date(selectedDate);

            // Fetch all buildings
            const allBuildings = await Building.find({});

            let allRoomReports = [];

            // Iterate over each building and fetch room reports
            for (const building of allBuildings) {
                const roomReports = await getRoomReportsForBuildingAndDate(building._id, queryDate);
                const enteringTodayRooms = roomReports.filter(report => report.bookingStatus === 'נכנסים היום');
                allRoomReports.push(...enteringTodayRooms);
            }

            // Ensure the `reports` directory exists
            const reportsDir = path.resolve(__dirname, 'reports');
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Room Report", {
                views: [{ rightToLeft: true }]
            });

            worksheet.columns = [
                { header: 'שם בניין', key: 'buildingName', width: 15 },
                { header: 'מספר חדר', key: 'roomNumber', width: 15 },
                { header: 'שם האורח', key: 'guestName', width: 20 },
                { header: 'מזרונים נוספים', key: 'extraMattresses', width: 15 },
                { header: 'מיטת תינוק', key: 'babyBed', width: 15 },
                { header: 'זמן צ׳ק-אין', key: 'checkInTime', width: 20 },
                { header: 'זמן צ׳ק-אאוט', key: 'checkOutTime', width: 20 },
                { header: 'סטטוס ההזמנה', key: 'bookingStatus', width: 15 },
                { header: 'בקשות מיוחדות', key: 'specialRequests', width: 40 }
            ];

            allRoomReports.forEach(report => {
                worksheet.addRow(report);
            });

            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };

            const filePath = path.join(reportsDir, `נכנסים בתאריך${selectedDate}_דוח_.xlsx`);
            await workbook.xlsx.writeFile(filePath);

            res.status(200).json({ fileUrl: `/reports/_Report_.xlsx` });
        } catch (error) {
            console.error("Error generating building report:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    // Report for rooms leaving today (endDate is today)
    GetLeavingOnDateReport: async function (req, res) {
        const { selectedDate } = req.query;
        try {
            const queryDate = new Date(selectedDate);

            // Fetch all buildings
            const allBuildings = await Building.find({});

            let allRoomReports = [];

            // Iterate over each building and fetch room reports
            for (const building of allBuildings) {
                const roomReports = await getRoomReportsForBuildingAndDate(building._id, queryDate);
                const enteringTodayRooms = roomReports.filter(report => report.bookingStatus === 'עוזבים היום');
                allRoomReports.push(...enteringTodayRooms);
            }

            // Ensure the `reports` directory exists
            const reportsDir = path.resolve(__dirname, 'reports');
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Room Report", {
                views: [{ rightToLeft: true }]
            });

            worksheet.columns = [
                { header: 'שם בניין', key: 'buildingName', width: 15 },
                { header: 'מספר חדר', key: 'roomNumber', width: 15 },
                { header: 'שם האורח', key: 'guestName', width: 20 },
                { header: 'מזרונים נוספים', key: 'extraMattresses', width: 15 },
                { header: 'מיטת תינוק', key: 'babyBed', width: 15 },
                { header: 'זמן צ׳ק-אין', key: 'checkInTime', width: 20 },
                { header: 'זמן צ׳ק-אאוט', key: 'checkOutTime', width: 20 },
                { header: 'סטטוס ההזמנה', key: 'bookingStatus', width: 15 },
                { header: 'בקשות מיוחדות', key: 'specialRequests', width: 40 }
            ];

            allRoomReports.forEach(report => {
                worksheet.addRow(report);
            });

            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };

            const filePath = path.join(reportsDir, `עוזבים_בתאריך${selectedDate}_דוח_.xlsx`);
            await workbook.xlsx.writeFile(filePath);

            res.status(200).json({ fileUrl: `/reports/_Report_.xlsx` });
        } catch (error) {
            console.error("Error generating building report:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    OrdersByDates: async function (req, res) {
        const { startDate, endDate } = req.query;
        try {
            console.log("startDate, endDate", startDate, endDate);

            const orders = await Order.find({
                startDate: { $lt: endDate },
                endDate: { $gt: startDate }
            });
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching orders' });
        }
    },
    UpdateOrder: async function (req, res) {
        const { id } = req.params;
        const { clientId, roomIds, startDate, endDate, amount, paymentBy } = req.body;
        console.log("id:", id);

        try {
            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { clientId, roomIds, startDate, endDate, amount, paymentBy },
                { new: true }
            );
            res.json(updatedOrder);
        } catch (error) {
            res.status(500).json({ error: 'Error updating order' });
        }
    },
    UpdateTable: async function (req, res) {
        const tableId = req.params.id;
        const { tableNumber, numberOfSeats, nearWindow, nearDoor, diningRoom } = req.body;
        console.log("tableId\n ", tableId);
        console.log("tableNumber, numberOfSeats, nearWindow, nearDoor, diningRoom\n ", tableNumber, numberOfSeats, nearWindow, nearDoor, diningRoom);

        try {
            // Find the table and update its properties
            const updatedTable = await DiningTable.findByIdAndUpdate(
                tableId,
                {
                    tableNumber,
                    numberOfSeats,
                    nearWindow,
                    nearDoor,
                    diningRoom
                },
                { new: true } // Return the updated document
            );

            if (!updatedTable) {
                return res.status(404).json({ error: 'Table not found' });
            }

            res.status(200).json({ message: 'Table updated successfully', updatedTable });
        } catch (error) {
            console.error('Error updating table:', error);
            res.status(500).json({ error: 'Server error, please try again later.' });
        }
    },
    DeleteOrder: async function (req, res) {
        const { id } = req.params;
        try {
            const deletedOrder = await Order.findByIdAndDelete(id);
            res.json({ message: 'Order deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting order' });
        }
    },
    DownloadFile: async function (req, res) {
        const { fileName } = req.params;
        const filePath = path.join(__dirname, 'reports', fileName);

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            res.download(filePath, fileName, (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                    res.status(500).json({ error: 'Error downloading the file' });
                }
            });
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    }
};

const getBuildingNameById = async (buildingId) => {
    try {
        const building = await Building.findById(buildingId);

        if (!building) {
            throw new Error('Building not found');
        }

        return building.buildingName;
    } catch (error) {
        console.error('Error fetching building name:', error);
        throw error;
    }
};
async function getRoomReportsForBuildingAndDate(buildingId, reportDate) {
    try {
        // Fetch all rooms for the given buildingId
        const rooms = await Room.find({ buildingId });
        //const roomMap = new Map(rooms.map(room => [room._id.toString(), room.roomNumber]));
        const roomIds = rooms.map(room => room._id.toString());

        if (roomIds.length === 0) {
            console.log("No rooms found for the building.");
            return [];
        }

        reportDate = new Date(reportDate);
        const roomBookings = await RoomBooking.find({
            roomId: { $in: roomIds },
            $or: [
                { startDate: { $lte: reportDate }, endDate: { $gte: reportDate } }
            ],
            status: "booked"
        });
        console.log("roomBookings in this date\n", roomBookings);

        // Get unique client IDs from bookings and fetch client data
        const clientIds = [...new Set(roomBookings.map(booking => booking.clientId))];
        const clients = await Client.find({ clientId: { $in: clientIds } });
        const clientMap = new Map(clients.map(client => [client.clientId, client]));

        // Map room bookings to a quick lookup structure
        const bookingsByRoomId = new Map();
        roomBookings.forEach(booking => {
            bookingsByRoomId.set(booking.roomId.toString(), booking);
        });

        // Prepare the final report
        const roomReports = rooms.map(room => {
            const booking = bookingsByRoomId.get(room._id.toString());
            if (booking) {
                const client = clientMap.get(booking.clientId);
                const hebrewBabyBed = booking.babyBed ? "כן" : "לא";
                let bookingStatus = '';
                if (booking.startDate < reportDate && booking.endDate > reportDate) {
                    bookingStatus = 'נשארים'; // Guest stays on the report date
                } else if (booking.endDate <= reportDate) {
                    bookingStatus = 'עוזבים היום'; // Guest leaves before or on the report date
                } else if (booking.startDate >= reportDate) {
                    bookingStatus = 'נכנסים היום'; // Guest arrives on or after the report date
                }
                console.log("booking.startDate\n", booking.startDate);
                console.log("reportDate\n", reportDate);

                return {
                    buildingName: room.buildingName,
                    roomNumber: room.roomNumber,
                    guestName: client?.name || "לא זמין",
                    extraMattresses: booking.extraMattresses,
                    babyBed: hebrewBabyBed,
                    checkInTime: booking.startDate,
                    checkOutTime: booking.endDate,
                    bookingStatus,
                    specialRequests: booking.specialRequests
                };
            } else {
                // Room is available (no bookings on the report date)
                return {
                    buildingName: room.buildingName,
                    roomNumber: room.roomNumber,
                    guestName: null, // Available in Hebrew
                    extraMattresses: null,
                    babyBed: null,
                    checkInTime: null,
                    checkOutTime: null,
                    bookingStatus: "פנוי" // Available in Hebrew
                };
            }
        });

        return roomReports;
    } catch (error) {
        console.error("Error fetching room reports:", error);
        throw error;
    }
}

function parseDateString(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);

    if (!day || !month || !year) throw new Error('Invalid date format');
    return new Date(Date.UTC(year, month - 1, day)); // Month is zero-indexed
}

async function generateOrderReport(orders) {
    const orderReports = [];
    for (const order of orders) {
        const client = await Client.findOne({ clientId: order.clientId });
        const roomIds = order.roomIds.map(roomId => roomId.toString());
        const rooms = await Room.find({ _id: { $in: roomIds } });

        // Prepare room numbers and buildings
        const roomNumbers = rooms.map(room => room.roomNumber);
        const buildingNames = rooms.map(room => room.buildingName);

        // Loop through each building and room to create separate rows
        for (let i = 0; i < roomNumbers.length; i++) {
            const buildingName = buildingNames[i];
            const roomNumber = roomNumbers[i];

            // Create a row for each building and room
            orderReports.push({
                orderId: order._id,
                clientName: client ? client.name : 'לא זמין',
                clientId: order.clientId,
                buildingName: buildingName,
                roomNumbers: roomNumber,
                startDate: order.startDate.toISOString().split('T')[0],
                endDate: order.endDate.toISOString().split('T')[0],
                amount: order.amount,
                paymentBy: order.paymentBy,
                specialRequests: order.specialRequests || 'לא קיימות בקשות מיוחדות'
            });
        }
    }
    console.log("orderReports: \n", orderReports)
    return orderReports; // Return the generated report data
}

async function generateReportFile(reportData, reportType) {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');

        // Define columns for the worksheet
        worksheet.columns = [
            { header: 'Room ID', key: 'roomId', width: 15 },
            { header: 'Client Name', key: 'clientName', width: 25 },
            { header: 'Start Date', key: 'startDate', width: 20 },
            { header: 'Extra Mattresses', key: 'extraMattresses', width: 20 },
            { header: 'Baby Bed', key: 'babyBed', width: 15 },
            { header: 'Special Requests', key: 'specialRequests', width: 30 },
        ];

        // Add rows to the worksheet
        reportData.forEach((data) => {
            worksheet.addRow({
                roomId: data.roomId,
                clientName: data.clientName,
                startDate: data.startDate,
                extraMattresses: data.extraMattresses,
                babyBed: data.babyBed,
                specialRequests: data.specialRequests,
            });
        });

        // Define the file path for saving the report
        const fileName = `${reportType}_Report_${new Date().toISOString()}.xlsx`;
        const filePath = path.join(__dirname, 'reports', fileName);

        // Ensure the 'reports' directory exists
        if (!fs.existsSync(path.join(__dirname, 'reports'))) {
            fs.mkdirSync(path.join(__dirname, 'reports'));
        }

        // Write the workbook to a file
        await workbook.xlsx.writeFile(filePath);

        // Return the file path (or URL) for downloading
        return fileName;
    } catch (error) {
        console.error('Error generating the report file:', error);
        throw new Error('Error generating report file.');
    }
}