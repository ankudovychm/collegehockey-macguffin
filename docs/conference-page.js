// Base URL for the GitHub repository files
var basePath = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/conf/";
var confMacguffinsCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/ConfMcguffins.csv";
var imageBasePath = "../assets/"; // Adjust the path as needed for the conference images folder

// Function to populate the MacGuffin and Reverse MacGuffin cards with images
function loadCurrentMacguffin(conferenceName) {
    Papa.parse(confMacguffinsCSV, {
        download: true,
        header: true,
        complete: function(results) {
            var data = results.data;
            
            // Find the row for the specified conference
            var conferenceData = data.find(row => row["Conference"] === conferenceName);
            
            if (conferenceData) {
                // Extract MacGuffin and Reverse MacGuffin details
                var macguffinTeam = conferenceData["MacGuffin: As of"].split(": ")[0];
                var macguffinDate = conferenceData["MacGuffin: As of"].split(": ")[1];
                var reverseTeam = conferenceData["Reverse MacGuffin: As of"].split(": ")[0];
                var reverseDate = conferenceData["Reverse MacGuffin: As of"].split(": ")[1];

                // Populate MacGuffin Card with bold team name and dynamic image
                document.getElementById("macguffin-info").innerHTML = `The current MacGuffin is <span class="bold-text">${macguffinTeam}</span>, since ${macguffinDate}`;
                var macguffinImage = `${imageBasePath}${macguffinTeam.replace(/\s+/g, '')}.png`;
                document.getElementById("macguffin-image").src = macguffinImage;
                document.getElementById("macguffin-image").alt = `${macguffinTeam} Logo`;

                // Populate Reverse MacGuffin Card with bold team name and dynamic image
                document.getElementById("reverse-macguffin-info").innerHTML = `The current Reverse MacGuffin is <span class="bold-text">${reverseTeam}</span>, since ${reverseDate}`;
                var reverseImage = `${imageBasePath}${reverseTeam.replace(/\s+/g, '')}.png`;
                document.getElementById("reverse-macguffin-image").src = reverseImage;
                document.getElementById("reverse-macguffin-image").alt = `${reverseTeam} Logo`;

                // Calculate days held
                var today = new Date();
                var macguffinDays = Math.floor((today - new Date(macguffinDate)) / (1000 * 60 * 60 * 24));
                var reverseDays = Math.floor((today - new Date(reverseDate)) / (1000 * 60 * 60 * 24));

                // Display days held
                document.getElementById("macguffin-days").textContent = `Held for ${macguffinDays} days`;
                document.getElementById("reverse-macguffin-days").textContent = `Held for ${reverseDays} days`;
            }
        }
    });
}

// Function to load historical data into tables
function loadHistoryData(conferenceName) {
    // URLs for the MacGuffin and Reverse MacGuffin historical CSV files for the specified conference
    var macguffinCSV = `${basePath}${conferenceName}macguffin.csv`;
    var reverseMacguffinCSV = `${basePath}${conferenceName}reverse-macguffin.csv`;

    // Load MacGuffin history
    Papa.parse(macguffinCSV, {
        download: true,
        header: true,
        complete: function(results) {
            var data = results.data;
            var tableBody = document.getElementById("macguffin-history").querySelector("tbody");

            tableBody.innerHTML = ""; // Clear any existing rows
            data.forEach(row => {
                var tr = document.createElement("tr");
                tr.innerHTML = `<td>${row.Date}</td><td>${row.Team}</td>`;
                tableBody.appendChild(tr);
            });
        }
    });

    // Load Reverse MacGuffin history
    Papa.parse(reverseMacguffinCSV, {
        download: true,
        header: true,
        complete: function(results) {
            var data = results.data;
            var tableBody = document.getElementById("reverse-macguffin-history").querySelector("tbody");

            tableBody.innerHTML = ""; // Clear any existing rows
            data.forEach(row => {
                var tr = document.createElement("tr");
                tr.innerHTML = `<td>${row.Date}</td><td>${row.Team}</td>`;
                tableBody.appendChild(tr);
            });
        }
    });
}

// Main function to load all data for the specified conference
function loadConferenceData(conferenceName) {
    loadCurrentMacguffin(conferenceName);
    loadHistoryData(conferenceName);
}

