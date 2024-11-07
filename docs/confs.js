// URL for the CSV file
var confMacguffinsCSV = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/ConfMcguffins.csv";

// Function to load and populate conference data
function loadConferenceData() {
    Papa.parse(confMacguffinsCSV, {
        download: true,
        header: true,
        complete: function(results) {
            const data = results.data;

            data.forEach(row => {
                // Replace spaces with underscores to match HTML id format
                const conferenceName = row["Conference"] ? row["Conference"].replace(/\s+/g, "") : null;
                const macguffinInfo = row["MacGuffin: As of"];
                const reverseMacguffinInfo = row["Reverse MacGuffin: As of"];

                // Skip row if any value is undefined
                if (!conferenceName || !macguffinInfo || !reverseMacguffinInfo) {
                    return; // Skip this row
                }

                // Format the MacGuffin and Reverse MacGuffin info
                const [macguffinTeam, macguffinDate] = macguffinInfo.split(": ");
                const [reverseTeam, reverseDate] = reverseMacguffinInfo.split(": ");

                // Dynamically populate the HTML content based on IDs
                const macguffinElement = document.getElementById(`${conferenceName}-macguffin`);
                const reverseElement = document.getElementById(`${conferenceName}-reverse`);

                if (macguffinElement) {
                    macguffinElement.textContent = `${macguffinTeam} (As of ${macguffinDate})`;
                }
                if (reverseElement) {
                    reverseElement.textContent = `${reverseTeam} (As of ${reverseDate})`;
                }
            });
        }
    });
}

// Run the function on page load
document.addEventListener("DOMContentLoaded", loadConferenceData);
