// URLs to the MacGuffin and Reverse MacGuffin CSVs in the GitHub repository
var FRCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/leaderboard/forwardranges.csv";
var FTCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/leaderboard/forwardtotals.csv";
var RRCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/leaderboard/reverseranges.csv";
var RTCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/leaderboard/reversetotals.csv";
;


// Function to fetch and display the latest entry from a CSV
function fetchLatestEntry(url, elementId, label) {
    Papa.parse(url, {
        download: true,
        header: true,
        complete: function(results) {
            var data = results.data;
            if (data.length > 0) {
                // Get the last entry (latest)
                var FirsttEntry = data[1];

                // Extract Date and Team values, and use default values if missing
                var len = FirsttEntry["Length (in days)"] || "unknown len";
                var team = FirsttEntry.Team || "unknown team";
                
                // Display the latest entry in the specified element
                document.getElementById(elementId).innerHTML = `${label} <span class="bold-text">${team}</span>, for ${len} days.`;

            } else {
                document.getElementById(elementId).textContent = `No data available for ${label.toLowerCase()}.`;
            }
        },
        error: function() {
            document.getElementById(elementId).textContent = `Error loading ${label.toLowerCase()}.`;
        }
    });
}

// Load the latest MacGuffin and Reverse MacGuffin data on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchLatestEntry(FRCSV, "forward-consec", "");
});
