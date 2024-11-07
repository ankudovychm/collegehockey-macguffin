// URLs to the MacGuffin and Reverse MacGuffin CSVs in the GitHub repository
var macguffinCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/macguffin.csv";
var reverseMacguffinCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/reverse-macguffin.csv";

// Base path for team images
var imageBasePath = "assets/";

// Function to fetch and display the latest entry from a CSV
function fetchLatestEntry(url, elementId, daysElementId, imgId, label) {
    Papa.parse(url, {
        download: true,
        header: true,
        complete: function(results) {
            var data = results.data;
            if (data.length > 0) {
                // Get the last entry (latest)
                var latestEntry = data[data.length - 2];

                // Extract Date and Team values, and use default values if missing
                var dateStr = latestEntry.Date || "unknown date";
                var team = latestEntry.Team || "unknown team";
                
                // Display the latest entry in the specified element
                document.getElementById(elementId).innerHTML = `${label} <span class="bold-text">${team}</span>, since ${dateStr}`;

                // Set the image source dynamically based on the team name
                var imageUrl = `${imageBasePath}${team.replace(/\s+/g, '')}.png`;
                document.getElementById(imgId).src = imageUrl;
                document.getElementById(imgId).alt = `${team} Logo`;

                // Calculate days held if date is available
                if (dateStr !== "unknown date") {
                    var date = new Date(dateStr);
                    var today = new Date();
                    var daysHeld = Math.floor((today - date) / (1000 * 60 * 60 * 24)); // Convert ms to days
                    document.getElementById(daysElementId).textContent = `Held for ${daysHeld} days`;
                }
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
    fetchLatestEntry(macguffinCSV, "macguffin-info", "macguffin-days", "macguffin-image", "The current MacGuffin is");
    fetchLatestEntry(reverseMacguffinCSV, "reverse-macguffin-info", "reverse-macguffin-days", "reverse-macguffin-image", "The current Reverse MacGuffin is");
});
