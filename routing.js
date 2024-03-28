const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const db = require('./database')
const util = require('./utilities')
const {check_if_empty} = require("./utilities");
//Sets render to look for .ejs files
app.set('view engine', 'ejs')
//enables data to be pulled from a html forum
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//renders home page
app.get('/', function (req, res) {
    res.render('index')
})

//Renders and showes all listed devices within the database
app.get('/showDevices', async function (req, res) {
    console.log('Someone clicked a button')
    try {
        const result = await db.allDevices();
        if (result.length == 0) {
            res.send('NO DEVICES FOUND')
        } else {
            const formattedData = result.map(device => {
                return {
                    university_name: device.university_name,
                    device_status: device.device_status,
                    date_deployed: device.date_deployed,
                    electrocardiogram: device.electrocardiogram,
                    IMU: device.IMU,
                    optical_pulse_oximeter: device.optical_pulse_oximeter,
                    microphone: device.microphone,
                    temperature_sensor: device.temperature_sensor,
                    electronic_nose: device.electronic_nose,
                    galvanic_skin_response: device.galvanic_skin_response,
                    microcontroller_model_number: device.microcontroller_model_number,
                    info_about_data_storage: device.info_about_data_storage
                };
            });
            res.render('show_devices', {devices: formattedData});
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('SERVER ERROR');
    }
});
// Adding Device page
//Renders forum to add devices to the database
app.get('/addDevice', function (req, res) {
    console.log('WORKING')
    res.render('add_devices')
})

//sends data to function that inserts data to database
app.post('/addDevice', async function (req, res) {
    const body = req.body
    await db.addDevice(body.location_school, body.electrocardiogram, body.inertial_measurement_unit, body.optical_pulse_oximeter, body.microphone, body.temperature_sensor, body.electronic_nose, body.galvanic_skin_response, body.micro_controller_number, body.real_time_clock_model_number, body.info_about_data_storage, body.firmware_version, body.date_installed, body.model_number, body.device_status, body.date_deployed)
    res.render('index')
})


app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
