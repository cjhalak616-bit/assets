// =============================
// Load Clinics
// =============================

window.onload = loadClinics;

async function loadClinics(){

    try{

        const response = await fetch("http://localhost:3000/clinics");

        const clinics = await response.json();

        const clinicSelect = document.getElementById("clinic_id");

        clinicSelect.innerHTML =
        "<option value=''>Choose Clinic</option>";

        clinics.forEach(clinic=>{

            clinicSelect.innerHTML += `

            <option value="${clinic.clinic_id}">

            ${clinic.clinic_name}
            - ${clinic.doctor_name}

            </option>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}


// =============================
// Book Appointment
// =============================

const bookingForm =
document.getElementById("bookingForm");

bookingForm.addEventListener("submit",

async function(e){

e.preventDefault();

const patient_id =
localStorage.getItem("patient_id");

if (!patient_id) {

    Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please login first."
    }).then(() => {

        window.location.href = "login.html";

    });

    return;
}

const clinic_id =
document.getElementById("clinic_id").value;

const appointment_date =
document.getElementById("appointment_date").value;

const appointment_time =
document.getElementById("appointment_time").value;

const screening_type =
document.getElementById("screening_type").value;

const notes =
document.getElementById("additional_notes").value;


// Validation

if(

clinic_id=="" ||

appointment_date=="" ||

appointment_time=="" ||

screening_type==""

){

Swal.fire({

icon:"warning",

title:"Missing Information",

text:"Please fill all required fields.",

confirmButtonColor:"#009688"

});

return;

}


try{

Swal.fire({

title:"Booking Appointment...",

allowOutsideClick:false,

didOpen:()=>{

Swal.showLoading();

}

});

const response=

await fetch(

"http://localhost:3000/bookAppointment",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

patient_id,

clinic_id,

appointment_date,

appointment_time,

screening_type,

notes

})

}

);

if (!response.ok) {
    throw new Error("Server Error");
}


const result=

await response.json();

Swal.close();

if(result.success){

Swal.fire({

icon:"success",

title:"Appointment Booked",

text:result.message,

confirmButtonColor:"#009688"

}).then(()=>{

window.location.href=

"historytracking.html";

});

}

else{

Swal.fire({

icon:"error",

title:"Booking Failed",

text:result.message,

confirmButtonColor:"#d33"

});

}

}

catch(error){

Swal.close();

Swal.fire({

icon:"error",

title:"Server Error",

text:"Unable to connect to server.",

confirmButtonColor:"#d33"

});

console.log(error);

}

});