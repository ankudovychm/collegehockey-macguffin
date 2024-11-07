// URLs to the MacGuffin and Reverse MacGuffin CSVs in the GitHub repository
var FRCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/leaderboard/forwardranges.csv";
var FTCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/leaderboard/forwardtotals.csv";

var RRCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/leaderboard/reverseranges.csv";
var RTCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/leaderboard/reversetotals.csv";


// Function to fetch and display the latest entry from a CSV
function fetchLatestEntry(url, elementId, imgId = null) {
    Papa.parse(url, {
        download: true,
        header: true,
        complete: function (results) {
            var data = results.data;

            // Get the last entry (latest)
            var FirsttEntry = data[0];

            // Extract Date and Team values, and use default values if missing
            var len = FirsttEntry["Length (in days)"] || FirsttEntry["Total Length (in days)"];
            var team = FirsttEntry.Team || "unknown team";

            // Display the latest entry in the specified element
            document.getElementById(elementId).innerHTML = `<span class="bold-text">${team}</span>, for ${len} days.`;



            if (imgId) {

                var imgElement = document.getElementById(imgId);

                var image = `${imageBasePath}${team.replace(/\s+/g, '')}.png`;
                var imgElement = document.getElementById(imgId);

                imgElement.src = "../assets/"+image;
                imgElement.alt = `${team} Logo`;
            }

        },
    });
}

// Function to load historical data into tables
function loadHistoryData(which) {

    if (which == "FR"){
        var range_csv = FRCSV
        var total_csv = FTCSV

        var range_rable = "FR-range-table"
        var total_table = "FR-total-table"
    }

    else if (which == "RV"){
        var range_csv = RRCSV
        var total_csv = RTCSV
        
        var range_rable = "RV-range-table"
        var total_table = "RV-total-table"
    }
    
    Papa.parse(range_csv, {
        download: true,
        header: true,
        complete: function(results) {
            var data = results.data;
            var tableBody = document.getElementById(range_rable).querySelector("tbody");
    
            tableBody.innerHTML = ""; // Clear any existing rows
            data.forEach(row => {
                var tr = document.createElement("tr");
                tr.innerHTML = `<td>${row.Place}</td><td>${row.Team}</td><td>${row["Length (in days)"]}</td><td>${row.From}</td><td>${row.To}</td>`;
                tableBody.appendChild(tr);
            });
        }
    });

    Papa.parse(total_csv, {
        download: true,
        header: true,
        complete: function(results) {
            var data = results.data;
            var tableBody = document.getElementById(total_table).querySelector("tbody");
    
            tableBody.innerHTML = ""; // Clear any existing rows
            data.forEach(row => {
                var tr = document.createElement("tr");
                tr.innerHTML = `<td>${row.Place}</td><td>${row.Team}</td><td>${row["Total Length (in days)"]}</td>`;
                tableBody.appendChild(tr);
            });
        }
    });
}


// Load the latest MacGuffin and Reverse MacGuffin data on page load
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("#forward-consec")) {
        fetchLatestEntry(FRCSV, "forward-consec");
    }
    if (document.querySelector("#forward-all")) {
        fetchLatestEntry(FTCSV, "forward-all");
    }
    if (document.querySelector("#reverse-consec")) {
        fetchLatestEntry(RRCSV, "reverse-consec");
    }
    if (document.querySelector("#reverse-all")) {
        fetchLatestEntry(RTCSV, "reverse-all");
    }
});
