const Client = require('../models/client.js')
const RoomBooking = require('../models/roomBooking.js')
const Room = require('../models/room.js')
const Building = require('../models/building.js')
const Order = require('../models/order.js')
const Login = require('../models/login.js');

const nodemailer = require("nodemailer");
const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');


// function isValidURL(str) {//function to check url
//     try {
//         const url = new URL(str);// Create a new URL object
//         const searchParams = url.searchParams; // Use the searchParams property to check if the URL has any query parameters
//         return true;// If no exception is thrown, the URL is valid
//     } catch (error) {
//         return false; // If an exception is thrown, the URL is not valid
//     }
// }

module.exports = {

    LoginScript: async function (req, res) {
        const { username, password } = req.body;
        try {
            // Find the user by username
            const userDB = await Login.findOne({ username });

            if (!userDB) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            if (password === userDB.password) {
                // Authentication successful
                return res.status(200).json({ message: 'Login successful' });
            } else {
                // Authentication failed
                return res.status(401).json({ message: 'Invalid username or password' });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error, please try again later.' });
        }
    },
    AddRoom: async function (req, res) {
        const { roomNumber, buildingName, numOfRooms, numBeds, floor } = req.body;

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
                    floor: floor
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
                    floor
                });
                await newRoom.save();

                return res.status(200).json({ message: `Building ${buildingName} and room ${roomNumber} created successfully!` });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error, please try again later.' });
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
        const { roomNumber, numBeds, floor, numOfRooms } = req.body;

        try {
            // Find the room and update it
            const updatedRoom = await Room.findByIdAndUpdate(roomId, {
                roomNumber,
                numBeds,
                floor,
                numOfRooms
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
    BookRoom: async function (req, res) {
        const { roomIds, startDate, endDate, guestName, guestEmail, guestId, phoneNumber, extraMattresses, babyBed } = req.body;

        if (!roomIds || !Array.isArray(roomIds) || roomIds.length === 0 || !startDate || !endDate || !guestName || !guestId || !phoneNumber) {
            return res.status(400).json({ error: 'Room IDs, dates, and guest details are required.' });
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
                    phoneNumber
                });
                await client.save();
            }
            // Create a single order
            const order = new Order({
                clientId: guestId,
                roomIds, // Store all room IDs in this order
                startDate: start,
                endDate: end,
                amount: roomIds.length * 1000 // Example amount calculation, adjust as needed
            });
            await order.save();

            // Create bookings for all rooms
            const bookings = roomIds.map(roomId => ({
                // roomId,
                // startDate: start,
                // endDate: end,
                // status: 'booked',
                // clientId: guestId,
                // orderId: order._id
                roomId,
                startDate: start,
                endDate: end,
                status: 'booked',
                clientId: guestId,
                orderId: order._id,
                extraMattresses: extraMattresses || 0,
                babyBed: babyBed || false
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
                service: 'Gmail', // or 'hotmail', 'yahoo', etc.
                auth: {
                    user: 'gw025867014@gmail.com', // Your email address
                    pass: 'svbu njya mldf tlbq', // Your email password or app password
                },
            });

            //Email options
            const mailOptions = {
                from: 'gw025867014@gmail.com', // Sender address
                to: recipientEmail,                           // Recipient address
                subject,                      // Subject of the email
                //text,
                html                       // HTML body (optional)
            };

            // Send the email
            const info = await transporter.sendMail(mailOptions);
            console.log(`Email sent: ${info.response}`);
            //return { success: true, message: 'Email sent successfully.' };
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
            //const queryDate = parseDateString(date);

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
            //res.status(200).json(occupancyData);
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
    GetBuildingReport: async function (req, res) {
        try {
            // Get building ID from request query or body
            const { buildingId } = req.query;  // Or req.body for POST request

            if (!buildingId) {
                return res.status(400).json({ error: 'Building ID is required.' });
            }

            // Fetch building from database by ID
            const building = await Building.findById(buildingId);
            if (!building) {
                return res.status(404).json({ error: 'Building not found.' });
            }

            // Fetch rooms for the selected building
            const rooms = await Room.find({ buildingId: building._id });

            // Get the total number of rooms in the building
            const totalRooms = rooms.length;

            // Find bookings for each room in the building
            const bookings = await RoomBooking.find({
                roomId: { $in: rooms.map(room => room._id) },
            });

            // Calculate the number of booked rooms
            const bookedRooms = bookings.filter(booking => booking.status === 'booked').length;

            // Calculate the occupancy rate
            const occupancyRate = totalRooms > 0 ? (bookedRooms / totalRooms) * 100 : 0;

            // Return the building report
            return res.status(200).json({
                message: 'Building report generated successfully.',
                data: {
                    buildingName: building.buildingName,
                    totalRooms,
                    bookedRooms,
                    occupancyRate: occupancyRate.toFixed(2),
                }
            });

        } catch (error) {
            console.error("Error generating building report:", error);
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
    // GetBuildingListById: async function (req, res) {
    //     try {
    //         // Extract buildingId from the query parameters
    //         const { buildingId } = req.query;

    //         if (!buildingId) {
    //             return res.status(400).json({ error: 'buildingId is required' });
    //         }

    //         // Fetch data and generate the report (existing logic here)
    //         const roomReports = await getRoomReportsForBuilding(buildingId); // Example function call
    //         const buildingName = await getBuildingNameById(buildingId); // Example function call

    //         // Ensure the `reports` directory exists
    //         const reportsDir = path.join(__dirname, 'reports');
    //         if (!fs.existsSync(reportsDir)) {
    //             fs.mkdirSync(reportsDir);
    //         }
    //         // Generate Excel file
    //         const workbook = XLSX.utils.book_new();
    //         const worksheet = XLSX.utils.json_to_sheet(roomReports);
    //         // Set the worksheet's properties for RTL direction
    //         worksheet['!cols'] = worksheet['!cols'] || []; // Ensure there is a column definition
    //         for (let i = 0; i < roomReports.length; i++) {
    //             const row = roomReports[i];
    //             // Set each cell to have a RTL text alignment (for Hebrew)
    //             for (const key in row) {
    //                 if (row.hasOwnProperty(key)) {
    //                     const cell = worksheet[XLSX.utils.encode_cell({ r: i, c: Object.keys(row).indexOf(key) })];
    //                     if (cell && typeof cell.v === 'string') {
    //                         // Add RTL alignment to each cell with Hebrew text
    //                         if (/[א-ת]/.test(cell.v)) {
    //                             if (!cell.s) {
    //                                 cell.s = {};
    //                             }
    //                             cell.s.alignment = { horizontal: 'right', vertical: 'center' };
    //                         }
    //                     }
    //                 }
    //             }
    //         }

    //         XLSX.utils.book_append_sheet(workbook, worksheet, "Room Report");

    //         const filePath = path.join(reportsDir, `${buildingId}_Report.xlsx`);
    //         XLSX.writeFile(workbook, filePath);

    //         console.log("filePath: \n");
    //         console.log(filePath);
    //         // Respond with the file URL
    //         res.status(200).json({ fileUrl: `/reports/${buildingId}_RoomReport.xlsx`, buildingName });
    //     } catch (error) {
    //         console.error("Error generating building report:", error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // },
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
            //console.log("buildingId:\n ", buildingId);
            console.log("roomReports:\n ", roomReports);
            //console.log("buildingName:\n ", buildingName);

            // Ensure the `reports` directory exists
            const reportsDir = path.resolve(__dirname, 'reports');
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            // Generate Excel file
            //const workbook = XLSX.utils.book_new();
            //const worksheet = XLSX.utils.json_to_sheet(roomReports);
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
                { header: 'סטטוס ההזמנה', key: 'bookingStatus', width: 15 }
            ];

            roomReports.forEach(report => {
                worksheet.addRow(report);
            });

            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };

            const filePath = path.join(reportsDir, `${buildingId}_Report_${reportDate}.xlsx`);
            await workbook.xlsx.writeFile(filePath);
            //XLSX.utils.book_append_sheet(workbook, worksheet, "Room Report");

            // const filePath = path.join(reportsDir, `${buildingId}_Report_${reportDate}.xlsx`);
            // XLSX.writeFile(workbook, filePath);

            res.status(200).json({ fileUrl: `/reports/${buildingId}_Report_${reportDate}.xlsx`, buildingName });
        } catch (error) {
            console.error("Error generating building report:", error);
            res.status(500).json({ error: 'Internal Server Error' });
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

const getRoomReportsForBuilding = async (buildingId) => {
    try {
        // Fetch all rooms for the given building
        const rooms = await Room.find({ buildingId });

        // For each room, fetch bookings and calculate stats
        const roomReports = await Promise.all(
            rooms.map(async (room) => {
                const bookings = await RoomBooking.find({ roomId: room._id });
                const bookedCount = bookings.filter(b => b.status === 'booked').length;

                return {
                    'מספר חדר': room.roomNumber, // Hebrew for "Room Number"
                    'מספר מיטות': room.numBeds, // Hebrew for "Number of Beds"
                    'מספר הזמנות': bookedCount, // Hebrew for "Booking Count"
                };
            })
        );

        return roomReports;
    } catch (error) {
        console.error('Error fetching room reports:', error);
        throw error;
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

        //Fetch all roomIds for the given buildingId
        const rooms = await Room.find({ buildingId }); 
        const roomMap = new Map(rooms.map(room => [room._id.toString(), room.roomNumber]));
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

        const clientIds = [...new Set(roomBookings.map(booking => booking.clientId))];
        const clients = await Client.find({ clientId: { $in: clientIds } });
        const clientMap = new Map(clients.map(client => [client.clientId, client]));

        const roomReports = roomBookings.map(booking => {
            const client = clientMap.get(booking.clientId);
            const hebrewBabyBed = booking.babyBed ? "כן": "לא"
            let bookingStatus = '';
            if (booking.startDate < reportDate && booking.endDate > reportDate) {
                bookingStatus = 'נשארים'; // Guest stays on the report date
            } else if (booking.endDate <= reportDate) {
                bookingStatus = 'עוזבים היום'; // Guest leaves before or on the report date
            } else if (booking.startDate >= reportDate) {
                bookingStatus = 'נכנסים היום'; // Guest arrives on or after the report date
            }
           
            return {
                roomNumber: roomMap.get(booking.roomId.toString()),
                guestName: client?.name,
                extraMattresses: booking.extraMattresses,
                babyBed: hebrewBabyBed,
                checkInTime: booking.startDate,
                checkOutTime: booking.endDate,
                bookingStatus
            }
        });

        return roomReports;
    } catch (error) {
        console.error("Error fetching room reports:", error);
        throw error;
    }
};
function parseDateString(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);

    if (!day || !month || !year) throw new Error('Invalid date format');
    return new Date(Date.UTC(year, month - 1, day)); // Month is zero-indexed
}