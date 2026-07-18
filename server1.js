const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({

    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "dr_screening_system",
    port: 3307

});

db.connect((err)=>{

    if(err){

        console.log("Database Connection Failed");
        console.log(err);

    }

    else{

        console.log("✅ MySQL Connected");

    }

});

app.post("/register",(req,res)=>{

    const{

        full_name,
        age,
        gender,
        diabetes_type,
        hba1c_level,
        contact_number,
        email,
        password,
        address

    } = req.body;

    const checkSql="SELECT * FROM patients WHERE email=?";

    db.query(checkSql,[email],(err,result)=>{

        if(err){

            console.log(err);
            return res.json({

                success:false,
                message:"Database Error"

            });

        }

        if(result.length>0){

            return res.json({

                success:false,
                message:"Email Already Exists"

            });

        }

        const sql=`

        INSERT INTO patients

        (full_name,
        age,
        gender,
        diabetes_type,
        hba1c_level,
        contact_number,
        email,
        password,
        address)

        VALUES(?,?,?,?,?,?,?,?,?)

        `;

        db.query(sql,[

            full_name,
            age,
            gender,
            diabetes_type,
            hba1c_level,
            contact_number,
            email,
            password,
            address

        ],(err,result)=>{

            if(err){

                console.log(err);

                return res.json({

                    success:false,
                    message:"Registration Failed"

                });

            }

            res.json({

                success:true,
                message:"Registration Successful"

            });

        });

    });

});

app.post("/login",(req,res)=>{

    const{

        email,
        password

    }=req.body;

    const sql=`

    SELECT *

    FROM patients

    WHERE email=? AND password=?

    `;

    db.query(sql,[email,password],(err,result)=>{

        if(err){

            console.log(err);

            return res.json({

                success:false,
                message:"Login Failed"

            });

        }

        if(result.length==0){

            return res.json({

                success:false,
                message:"Invalid Email or Password"

            });

        }

        res.json({

            success:true,
            patient_id:result[0].patient_id,
            full_name:result[0].full_name,
            email:result[0].email

        });

    });

});

app.post("/forgotpassword",(req,res)=>{

    const{

        email,
        password

    }=req.body;

    const sql=`

    UPDATE patients

    SET password=?

    WHERE email=?

    `;

    db.query(sql,[password,email],(err,result)=>{

        if(err){

            console.log(err);

            return res.json({

                success:false,
                message:"Password Update Failed"

            });

        }

        if(result.affectedRows==0){

            return res.json({

                success:false,
                message:"Email Not Found"

            });

        }

        res.json({

            success:true,
            message:"Password Updated Successfully"

        });

    });

});

app.post("/bookAppointment", (req, res) => {

    const {

        patient_id,
        clinic_id,
        appointment_date,
        appointment_time,
        screening_type,
        notes

    } = req.body;

    const sql = `

    INSERT INTO appointments

    (patient_id,
    clinic_id,
    appointment_date,
    appointment_time,
    screening_type,
    notes)

    VALUES (?,?,?,?,?,?)

    `;

    db.query(sql,[

        patient_id,
        clinic_id,
        appointment_date,
        appointment_time,
        screening_type,
        notes

    ],(err,result)=>{

        if(err){

            console.log(err);

            return res.json({

                success:false,
                message:"Appointment Booking Failed"

            });

        }

        res.json({

            success:true,
            message:"Appointment Booked Successfully"

        });

    });

});

app.get("/clinics",(req,res)=>{

    const sql="SELECT * FROM clinics";

    db.query(sql,(err,result)=>{

        if(err){

            console.log(err);

            return res.json([]);

        }

        res.json(result);

    });

});

app.get("/appointments/:patient_id",(req,res)=>{

    const patient_id=req.params.patient_id;

    const sql=`

    SELECT

    appointments.*,
    clinics.clinic_name,
    clinics.doctor_name

    FROM appointments

    INNER JOIN clinics

    ON appointments.clinic_id=clinics.clinic_id

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

app.delete("/appointment/:id",(req,res)=>{

    const id=req.params.id;

    const sql="DELETE FROM appointments WHERE appointment_id=?";

    db.query(sql,[id],(err,result)=>{

        if(err){

            console.log(err);

            return res.json({

                success:false,
                message:"Delete Failed"

            });

        }

        res.json({

            success:true,
            message:"Appointment Deleted"

        });

    });

});

app.post("/adminLogin",(req,res)=>{

    const {email,password}=req.body;

    const sql=`
    SELECT *
    FROM admins
    WHERE email=? AND password=?
    `;

    db.query(sql,[email,password],(err,result)=>{

        if(err){

            console.log(err);

            return res.json({

                success:false,
                message:"Login Failed"

            });

        }

        if(result.length==0){

            return res.json({

                success:false,
                message:"Invalid Email or Password"

            });

        }

        res.json({

            success:true,
            admin_id:result[0].admin_id,
            full_name:result[0].full_name

        });

    });

});

app.get("/patients",(req,res)=>{

    const sql=`

    SELECT *

    FROM patients

    ORDER BY patient_id DESC

    `;

    db.query(sql,(err,result)=>{

        if(err){

            console.log(err);

            return res.json([]);

        }

        res.json(result);

    });

});

app.delete("/patient/:id",(req,res)=>{

    const id=req.params.id;

    const sql="DELETE FROM patients WHERE patient_id=?";

    db.query(sql,[id],(err,result)=>{

        if(err){

            console.log(err);

            return res.json({

                success:false,
                message:"Delete Failed"

            });

        }

        res.json({

            success:true,
            message:"Patient Deleted Successfully"

        });

    });

});

app.get("/allAppointments",(req,res)=>{

    const sql=`

    SELECT

    appointments.*,

    patients.full_name,

    clinics.clinic_name,

    clinics.doctor_name

    FROM appointments

    INNER JOIN patients

    ON appointments.patient_id=patients.patient_id

    INNER JOIN clinics

    ON appointments.clinic_id=clinics.clinic_id

    ORDER BY appointment_date DESC

    `;

    db.query(sql,(err,result)=>{

        if(err){

            console.log(err);

            return res.json([]);

        }

        res.json(result);

    });

});

app.put("/appointmentStatus/:id",(req,res)=>{

    const id=req.params.id;

    const {status}=req.body;

    const sql=`

    UPDATE appointments

    SET status=?

    WHERE appointment_id=?

    `;

    db.query(sql,[status,id],(err,result)=>{

        if(err){

            console.log(err);

            return res.json({

                success:false,
                message:"Status Update Failed"

            });

        }

        res.json({

            success:true,
            message:"Appointment Status Updated"

        });

    });

});

app.put("/appointment/:id",(req,res)=>{

    const id=req.params.id;

    const{

        clinic_id,
        appointment_date,
        appointment_time,
        screening_type,
        notes

    }=req.body;

    const sql=`

    UPDATE appointments

    SET

    clinic_id=?,
    appointment_date=?,
    appointment_time=?,
    screening_type=?,
    notes=?

    WHERE appointment_id=?

    `;

    db.query(sql,[

        clinic_id,
        appointment_date,
        appointment_time,
        screening_type,
        notes,
        id

    ],(err,result)=>{

        if(err){

            console.log(err);

            return res.json({

                success:false,
                message:"Update Failed"

            });

        }

        res.json({

            success:true,
            message:"Appointment Updated Successfully"

        });

    });

});

app.post("/addScreening",(req,res)=>{

    const{

        appointment_id,
        screening_date,
        result,
        recommendations,
        report_file

    }=req.body;

    const sql=`

    INSERT INTO screening_records

    (
    appointment_id,
    screening_date,
    result,
    recommendations,
    report_file
    )

    VALUES(?,?,?,?,?)

    `;

    db.query(sql,[

        appointment_id,
        screening_date,
        result,
        recommendations,
        report_file

    ],(err)=>{

        if(err){

            console.log(err);

            return res.json({

                success:false,
                message:"Failed to Save Screening Record"

            });

        }

        // Appointment ko Completed mark karo
        const updateSql=`

        UPDATE appointments

        SET status='Completed'

        WHERE appointment_id=?

        `;

        db.query(updateSql,[appointment_id]);

        res.json({

            success:true,
            message:"Screening Record Saved Successfully"

        });

    });

});

app.get("/screening/:appointment_id",(req,res)=>{

    const appointment_id=req.params.appointment_id;

    const sql=`

    SELECT *

    FROM screening_records

    WHERE appointment_id=?

    `;

    db.query(sql,[appointment_id],(err,result)=>{

        if(err){

            console.log(err);

            return res.json([]);

        }

        res.json(result);

    });

});

app.get("/history/:patient_id",(req,res)=>{

    const patient_id=req.params.patient_id;

    const sql=`

    SELECT

    appointments.appointment_date,
    appointments.appointment_time,

    clinics.clinic_name,

    screening_records.result,
    screening_records.recommendations,
    screening_records.report_file

    FROM appointments

    INNER JOIN clinics

    ON appointments.clinic_id=clinics.clinic_id

    LEFT JOIN screening_records

    ON appointments.appointment_id=
    screening_records.appointment_id

    WHERE appointments.patient_id=?

    ORDER BY appointments.appointment_date DESC

    `;

    db.query(sql,[patient_id],(err,result)=>{

        if(err){

            console.log(err);

            return res.json([]);

        }

        res.json(result);

    });

});

app.get("/dashboard",(req,res)=>{

    const dashboard={};

    db.query("SELECT COUNT(*) AS totalPatients FROM patients",(err,result)=>{

        dashboard.totalPatients=result[0].totalPatients;

        db.query("SELECT COUNT(*) AS totalAppointments FROM appointments",(err,result)=>{

            dashboard.totalAppointments=result[0].totalAppointments;

            db.query("SELECT COUNT(*) AS completed FROM appointments WHERE status='Completed'",(err,result)=>{

                dashboard.completed=result[0].completed;

                db.query("SELECT COUNT(*) AS pending FROM appointments WHERE status='Pending'",(err,result)=>{

                    dashboard.pending=result[0].pending;

                    res.json(dashboard);

                });

            });

        });

    });

});

app.get("/",(req,res)=>{

    res.send("Diabetic Retinopathy Screening Backend Running Successfully 🚀");

});

app.listen(3000,()=>{

    console.log("🚀 Server Running at http://localhost:3000");

});