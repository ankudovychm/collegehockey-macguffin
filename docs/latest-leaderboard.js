// URLs to the MacGuffin and Reverse MacGuffin CSVs in the GitHub repository
var FRCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/leaderboard/forwardranges.csv";
var FTCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/leaderboard/forwardtotals.csv";

var RRCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/leaderboard/reverseranges.csv";
var RTCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/leaderboard/reversetotals.csv";
;


// Function to fetch and display the latest entry from a CSV
function fetchLatestEntry(url, elementId) {
    Papa.parse(url, {
        download: true,
        header: true,
        complete: function(results) {
            var data = results.data;
            
                // Get the last entry (latest)
                var FirsttEntry = data[0];

                // Extract Date and Team values, and use default values if missing
                var len = FirsttEntry["Length (in days)"] || FirsttEntry["Total Length (in days)"];
                var team = FirsttEntry.Team || "unknown team";
                
                // Display the latest entry in the specified element
                document.getElementById(elementId).innerHTML = `<span class="bold-text">${team}</span>, for ${len} days.`;

        },
    });
}

// Load the latest MacGuffin and Reverse MacGuffin data on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchLatestEntry(FRCSV, "forward-consec");
    fetchLatestEntry(FTCSV, "forward-all");
    fetchLatestEntry(RRCSV, "reverse-consec");
    fetchLatestEntry(RTCSV, "reverse-all");
});

