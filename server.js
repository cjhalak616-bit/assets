const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// =======================
// Middleware
// =======================
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// =======================
// Database Connection
// =======================
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "dr_screening_system",
    port: 3307
});

db.connect((err) => {

    if (err) {
        console.log("Database Connection Failed");
        console.log(err);
        return;
    }

    console.log("✅ MySQL Connected Successfully");

});
// =======================
// Register API
// =======================
app.post("/register", (req, res) => {

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

    // Check Duplicate Email
    const checkSql =
    "SELECT * FROM patients WHERE email=?";

    db.query(checkSql,[email],(err,result)=>{

        if(err){
            console.log(err);
            return res.send("Registration Failed");
        }

        if(result.length > 0){
            return res.send("Email Already Exists");
        }

        const sql = `
        INSERT INTO patients
        (full_name,age,gender,diabetes_type,hba1c_level,
        contact_number,email,password,address)

        VALUES(?,?,?,?,?,?,?,?,?)
        `;

        db.query(sql,[

            fullname,
            age,
            gender,
            diabetes_type,
            hba1c,
            contact,
            email,
            password,
            address

        ],(err,result)=>{

            if(err){

                console.log(err);
                res.send("Registration Failed");

            }

            else{

                res.send("Registration Successful");

            }

        });

    });

});

// =======================
// Login API
// =======================
app.post("/login",(req,res)=>{

    const {email,password}=req.body;

    const sql=
    "SELECT * FROM patients WHERE email=? AND password=?";

    db.query(sql,[email,password],(err,result)=>{

        if(err){

            console.log(err);

            return res.json({
                success:false,
                message:"Login Failed"
            });

        }

        if(result.length>0){

            res.json({

                success:true,
                patient_id:result[0].patient_id,
                fullname:result[0].fullname,
                email:result[0].email

            });

        }

        else{

            res.json({

                success:false,
                message:"Invalid Email or Password"

            });

        }

    });

});

// =======================
// Forgot Password API
// =======================
app.post("/updatepassword",(req,res)=>{

    const {email,password}=req.body;

    const sql=`
    UPDATE patients
    SET password=?
    WHERE email=?
    `;

    db.query(sql,[password,email],(err,result)=>{

        if(err){

            console.log(err);
            return res.send("Password Update Failed");

        }

        if(result.affectedRows>0){

            res.send("Password Updated Successfully");

        }

        else{

            res.send("Email Not Found");

        }

    });

});

// =======================
// Book Appointment API
// =======================
app.post("/bookAppointment",(req,res)=>{

    const{

        patient_id,
        clinic,
        appointment_date,
        appointment_time,
        screening_type,
        notes

    }=req.body;

    const sql=`

    INSERT INTO appointments

    (patient_id,
    clinic,
    appointment_date,
    appointment_time,
    screening_type,
    notes)

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

            res.send("Appointment Booked Successfully");

        }

    });

});

// =======================
// History API
// =======================
app.get("/history/:patient_id",(req,res)=>{

    const patient_id=req.params.patient_id;

    const sql=`

    SELECT *

    FROM screening_history

    WHERE patient_id=?

    ORDER BY appointment_date DESC

    `;

    db.query(sql,[patient_id],(err,result)=>{

        if(err){

            console.log(err);
            return res.json([]);

        }

        res.json(result);

    });

});

// =======================
// Start Server
// =======================
app.listen(3000,()=>{

    console.log(" Server Running at http://localhost:3000");

});

app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});