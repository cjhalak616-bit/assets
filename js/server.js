const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // XAMPP me by default blank hota hai
    database: "dr_screening"
});

// Connect MySQL
db.connect((err) => {
    if (err) {
        console.log("Database connection failed!");
        console.log(err);
        return;
    }

    console.log(" MySQL Connected Successfully");
});

// Test Route
/*app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});*/

// Register API
app.post("/register", (req, res) => {

        console.log("DATA RECEIVED:", req.body);

    const {
        fullname,
        age,
        gender,
        diabetes_type,
        hba1c,
        contact,
        email,
        password,
        address
    } = req.body;

    const sql = `
    INSERT INTO patients
    (fullname, age, gender, diabetes_type, hba1c,
     contact, email, password,address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            fullname,
            age,
            gender,
            diabetes_type,
            hba1c,
            contact,
            email,
            password,
            address
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                res.send("Registration Failed");
            } else {
                res.send("Registration Successful");
            }
        }
    );
});

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM patients WHERE email=? AND password=?";

    db.query(sql, [email, password], (err, result) => {

        if (err) {
            console.log(err);
            res.json({
                success: false,
                message: "Login Failed"
            });
        }

        else if (result.length > 0) {

            res.json({
                success: true,
                patient_id: result[0].patient_id,
                fullname: result[0].fullname
            });

        } else {

            res.json({
                success: false,
                message: "Invalid Credentials"
            });

        }

    });

});
app.post("/updatepassword", (req,res)=>{

    const { email, password } = req.body;

    const sql = `
    UPDATE patients
    SET password = ?
    WHERE email = ?
    `;

    db.query(sql,[password,email],(err,result)=>{

        if(err){
            console.log(err);
            res.send("Password Update Failed");
        }
        else if(result.affectedRows > 0){
            res.send("Password Updated Successfully");
        }
        else{
            res.send("Email Not Found");
        }

    });

});

app.get("/history/:patient_id", (req,res)=>{

    const patient_id = req.params.patient_id;

    const sql =
    "SELECT * FROM screening_history WHERE patient_id=?";

    db.query(sql,[patient_id],(err,result)=>{

        if(err){
            res.json([]);
        }
        else{
            res.json(result);
        }

    });

});

app.post("/bookAppointment",(req,res)=>{

    const {

        patient_id,
        clinic,
        appointment_date,
        appointment_time,
        screening_type,
        notes

    } = req.body;

    const sql = `
    INSERT INTO appointments
    (patient_id,clinic,appointment_date,
    appointment_time,screening_type,notes)

    VALUES(?,?,?,?,?,?)
    `;

    db.query(sql,[

        patient_id,
        clinic,
        appointment_date,
        appointment_time,
        screening_type,
        notes

    ],(err,result)=>{

        if(err){

            console.log(err);

            res.send("Booking Failed");

        }

        else{

            res.send("Appointment Booked");

        }

    });

});

app.use(cors());
app.use(express.json());

app.use(express.static("public"));
// Start Server
app.listen(3000, () => {
    console.log(" Server running on http://localhost:3000");
});



