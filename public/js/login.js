const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {

        Swal.fire({
            icon: "warning",
            title: "Missing Information",
            text: "Please enter Email and Password."
        });

        return;
    }

    try {

        Swal.fire({
            title: "Please Wait...",
            text: "Logging in...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch("http://localhost:3000/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email,
                password

            })

        });

        const result = await response.json();

        Swal.close();

        if (result.success) {

            // Save patient info
            localStorage.setItem("patient_id", result.patient_id);
            localStorage.setItem("full_name", result.full_name);
            localStorage.setItem("email", result.email);

            Swal.fire({

                icon: "success",
                title: "Login Successful",
                text: "Welcome " + result.full_name

            }).then(() => {

                window.location.href = "index.html";

            });

        }

        else {

            Swal.fire({

                icon: "error",
                title: "Login Failed",
                text: result.message

            });

        }

    }

    catch (error) {

        console.log(error);

        Swal.fire({

            icon: "error",
            title: "Server Error",
            text: "Unable to connect to server."

        });

    }

});