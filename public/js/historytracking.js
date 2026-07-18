window.onload = loadHistory;

async function loadHistory() {

    const patient_id = localStorage.getItem("patient_id");

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

    try {

        const response = await fetch(
            `http://localhost:3000/history/${patient_id}`
        );

        if (!response.ok) {
            throw new Error("Server Error");
        }

        const history = await response.json();

        const table =
        document.getElementById("historyTable");

        table.innerHTML = "";

        if (history.length === 0) {

            table.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    No Screening History Found
                </td>
            </tr>
            `;

            return;
        }

        history.forEach(record => {

            let status = "Pending";
            let badge = "status-pending";

            if (record.result) {
                status = "Completed";
                badge = "status-completed";
            }

            table.innerHTML += `

            <tr>

                <td>${record.appointment_date}</td>

                <td>${record.appointment_date}</td>

                <td>${record.clinic_name}</td>

                <td>${record.result ?? "Pending Screening"}</td>

                <td>${record.recommendations ?? "-"}</td>

                <td>

                    <span class="badge ${badge}">
                        ${status}
                    </span>

                </td>

            </tr>

            `;

        });

    }

    catch(error){

        console.log(error);

        Swal.fire({
            icon:"error",
            title:"Server Error",
            text:"Unable to load history."
        });

    }

}