// Function to load CSV data into the table
function loadCSVData(url, tableId) {
    Papa.parse(url, {
        download: true,
        header: true,
        complete: function(results) {
            const data = results.data;
            const table = document.getElementById(tableId);

            // Clear any existing content to prevent duplicate headers or rows
            table.innerHTML = "";

            // Generate table headers
            const headers = Object.keys(data[0]);
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Generate table body with non-empty rows only
            const tbody = document.createElement('tbody');
            data.forEach(row => {
                // Check if the row is empty (all fields are null or empty)
                if (!headers.some(header => row[header])) return;

                const tr = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.textContent = row[header];
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
        }
    });
}



// URLs to the CSV files in the GitHub repository
var baseURL = "https://raw.githubusercontent.com/ankudovychm/collegehockey-macguffin/main/data/"; 
var macguffinCSV = baseURL + "macguffin.csv";
var reverseMacguffinCSV = baseURL + "reverse-macguffin.csv";
var confMacguffinsCSV = baseURL + "ConfMcguffins.csv";

// Load each CSV into the corresponding table only if the element exists on the page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('macguffin')) {
        loadCSVData(macguffinCSV, 'macguffin');
    }

    if (document.getElementById('reverse-macguffin')) {
        loadCSVData(reverseMacguffinCSV, 'reverse-macguffin');
    }

    if (document.getElementById('conf-macguffins')) {
        loadCSVData(confMacguffinsCSV, 'conf-macguffins');
    }
});

