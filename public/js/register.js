const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const full_name = document.getElementById("full_name").value.trim();
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const diabetes_type = document.getElementById("diabetes_type").value;
    const hba1c_level = document.getElementById("hba1c_level").value;
    const contact_number = document.getElementById("contact_number").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const address = document.getElementById("address").value.trim();

    // Validation

    if (
        full_name === "" ||
        age === "" ||
        gender === "" ||
        diabetes_type === "" ||
        hba1c_level==="" ||
        contact_number === "" ||
        email === "" ||
        password === "" ||
        address === ""
    ) {

        Swal.fire({
            icon: "warning",
            title: "Missing Information",
            text: "Please fill all required fields.",
            confirmButtonColor: "#009688"
        });

        return;
    }

    if (!/^[A-Za-z ]+$/.test(full_name)) {

        Swal.fire({
            icon: "warning",
            title: "Invalid Name",
            text: "Name should contain only letters.",
            confirmButtonColor: "#009688"
        });

        return;
    }

    if (age < 18 || age > 120) {

        Swal.fire({
            icon: "warning",
            title: "Invalid Age",
            text: "Age must be between 18 and 120.",
            confirmButtonColor: "#009688"
        });

        return;
    }

    if (!/^[0-9]{10}$/.test(contact_number)) {

        Swal.fire({
            icon: "warning",
            title: "Invalid Contact Number",
            text: "Enter a valid 10-digit mobile number.",
            confirmButtonColor: "#009688"
        });

        return;
    }

    if (password.length < 6) {

        Swal.fire({
            icon: "warning",
            title: "Weak Password",
            text: "Password should contain at least 6 characters.",
            confirmButtonColor: "#009688"
        });

        return;
    }

    try {

        Swal.fire({
            title: "Please Wait...",
            text: "Creating your account",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch("http://localhost:3000/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                full_name,
                age,
                gender,
                diabetes_type,
                hba1c_level,
                contact_number,
                email,
                password,
                address

            })

        });

        const result = await response.json();

        Swal.close();

        if (result.success) {

            Swal.fire({

                icon: "success",
                title: "Registration Successful 🎉",
                text: "Your account has been created successfully.",
                confirmButtonColor: "#009688"

            }).then(() => {

                window.location.href = "login.html";

            });

        }

        else {

            Swal.fire({

                icon: "error",
                title: "Registration Failed",
                text: result.message,
                confirmButtonColor: "#d33"

            });

        }

    }

    catch (error) {

        Swal.close();

        Swal.fire({

            icon: "error",
            title: "Server Error",
            text: "Unable to connect to the server.",
            confirmButtonColor: "#d33"

        });

        console.error(error);

    }

});