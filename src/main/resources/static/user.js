function saveUser() {
    var UserName = $("#UserName").val();
    var email = $("#Email").val();

    $.ajax({
        type: "POST",
        url: "https://medicareb.work.gd/api/public/patient",
        dataType: "json",
        contentType: "application/json",  // Ensure correct content type
        data: JSON.stringify({   // Convert object to JSON string
            "patientId": 1002,
            "patientName": UserName,
            "patientAddress": email,
            "reservations": [
                { "reservationDate": "2025-03-20" },  // Use a valid date
                { "reservationDate": "2025-04-01" }
            ]
        }),
        success: function(response) {
            console.log("User saved successfully:", response);
            alert("User saved successfully!");
        },
        error: function(xhr, status, error) {
            console.error("Error saving user:", error);
            alert("Failed to save user.");
        }
    });
}