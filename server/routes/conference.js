const Client = require('../models/client.js')
const RoomBooking = require('../models/roomBooking.js')
const Room = require('../models/room.js')
const Building = require('../models/building.js')
const Order = require('../models/order.js')
const Login = require('../models/login.js');

const nodemailer = require("nodemailer");

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

                // // Add initial RoomBooking entry marking room as 'free'
                // const startDate = new Date();
                // startDate.setUTCHours(0, 0, 0, 0);

                // const endDate = new Date();
                // endDate.setFullYear(endDate.getFullYear() + 1);
                // endDate.setUTCHours(0, 0, 0, 0);

                // const initialRoomBooking = new RoomBooking({
                //     roomId: newRoom._id,
                //     startDate,
                //     endDate,
                //     status: 'free'
                // });
                // await initialRoomBooking.save();

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

                // // Add initial RoomBooking entry marking room as 'free'
                // const startDate = new Date();
                // const endDate = new Date();
                // endDate.setFullYear(endDate.getFullYear() + 1);

                // const initialRoomBooking = new RoomBooking({
                //     roomId: newRoom._id,
                //     startDate,
                //     endDate,
                //     status: 'free'
                // });
                // await initialRoomBooking.save();

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

    // BookRoom: async function (req, res) {
    //     const { roomId, startDate, endDate, guestName, guestEmail, guestId, phoneNumber } = req.body;

    //     if (!roomId || !startDate || !endDate || !guestName || !guestId || !phoneNumber) {
    //         return res.status(400).json({ error: 'Room ID, dates, and guest details are required.' });
    //     }

    //     try {
    //         // Parse dates
    //         const start = parseDateString(startDate);
    //         const end = parseDateString(endDate);

    //         if (start >= end) {
    //             return res.status(400).json({ error: 'End date must be after start date.' });
    //         }

    //         // Check room availability
    //         const conflictingBooking = await RoomBooking.findOne({
    //             roomId,
    //             $or: [
    //                 { startDate: { $lt: end }, endDate: { $gt: start } }
    //             ],
    //             status: 'booked'
    //         });

    //         if (conflictingBooking) {
    //             return res.status(400).json({ error: 'Room is already booked within the selected date range.' });
    //         }

    //         // Create or find the client
    //         let client = await Client.findOne({ clientId: guestId });

    //         if (!client) {
    //             client = new Client({
    //                 clientId: guestId,
    //                 name: guestName,
    //                 email: guestEmail,
    //                 phoneNumber
    //             });
    //             await client.save();
    //         }

    //         let order = await Order.findOne({ roomId: roomId });
    //         if (!order) {
    //             // Create an order
    //             order = new Order({
    //                 clientId: guestId,
    //                 roomId: roomId,
    //                 startDate: start,
    //                 endDate: end,
    //                 amount: 1000, // Example amount, adjust as needed
    //             });
    //             await order.save();
    //         }
    //         // Create the booking
    //         const newBooking = new RoomBooking({
    //             roomId: roomId,
    //             startDate: start,
    //             endDate: end,
    //             status: 'booked',
    //             clientId: guestId,
    //             orderId: order._id
    //         });

    //         await newBooking.save();


    //         res.status(200).json({ message: 'Room successfully booked!', booking: newBooking });
    //     } catch (error) {
    //         console.error("Error booking room:", error);
    //         res.status(500).json({ error: 'Server error, please try again later.' });
    //     }
    // },
    BookRoom: async function (req, res) {
        const { roomIds, startDate, endDate, guestName, guestEmail, guestId, phoneNumber } = req.body;

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
                roomId,
                startDate: start,
                endDate: end,
                status: 'booked',
                clientId: guestId,
                orderId: order._id
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
    // Function to send email
    //SendMail: async function (req, res) {
    //try {
    //const { recipientEmail, subject, html } = req.body;
    // } catch (err) {
    //     console.error("Failed to send email", err);
    //     res.status(500).send("Error sending email");
    // }
    //const { recipientEmail, subject, html } = req.body;

    // if (!recipientEmail || !subject || !html) {
    //     return res.status(400).json({ error: 'Recipient email, subject, and HTML content are required.' });
    // }

    // try {
    //     // Replace with your EmailJS service ID, template ID, and public key
    //     const serviceId = 'service_ed4tpfg';
    //     const templateId = 'template_iwmknp6';
    //     const publicKey = 'VOafZzbM22Bf_wp3c';

    //     // Prepare email parameters
    //     const emailParams = {
    //         to_email: recipientEmail,
    //         subject: subject,
    //         message_html: html,
    //     };

    //     // Send email using EmailJS
    //     const response = await emailjs.send(serviceId, templateId, emailParams, publicKey);

    //     console.log('Email sent successfully:', response);
    //     res.status(200).json({ message: 'Email sent successfully!', response });
    // } catch (error) {
    //     console.error('Error sending email:', error);
    //     res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    // }
    // }
    SendMail: async function (req, res) {
        const { recipientEmail, subject, html } = req.body;
        //text = "hiiiii"
        try {
            // Create a transporter object with your email service credentials
            const transporter = nodemailer.createTransport({
                service: 'Gmail', // or 'hotmail', 'yahoo', etc.
                auth: {
                    user: 'gw025867014@gmail.com', // Your email address
                    pass: 'svbu njya mldf tlbq', // Your email password or app password
                },
            });
            //console.log("recipientEmail", recipientEmail);

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
            return { success: true, message: 'Email sent successfully.' };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }
    },
    GetDailyOccupancy: async function (req, res) {
        const { date } = req.body;
        //console.log(date);
        
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        try {
            //console.log("date: ", date);
           queryDate  = new Date(date);
            //const queryDate = parseDateString(date);
            console.log("lalalala:::  \n date: ", date , " queryDate: ", queryDate);

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
            console.log("response: lc: ", response);

            res.status(200).json(response);
            //res.status(200).json(occupancyData);
        } catch (error) {
            console.error("Error generating daily occupancy data:", error);
            res.status(500).json({ error: 'Server error, please try again later.' });
        }
        
    }

    
    
};
function parseDateString(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);

    if (!day || !month || !year) throw new Error('Invalid date format');
    return new Date(Date.UTC(year, month - 1, day)); // Month is zero-indexed
}


