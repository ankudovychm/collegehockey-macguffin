// Function to load and display CSV data from GitHub
function loadCSVData(url, tableId) {
    Papa.parse(url, {
        download: true,
        header: true,
        complete: function(results) {
            const data = results.data;
            const table = document.getElementById(tableId);

            // Generate table headers
            const headers = Object.keys(data[0]);
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            // Generate table rows
            data.forEach(row => {
                const tr = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.textContent = row[header];
                    tr.appendChild(td);
                });
                table.appendChild(tr);
            });
        }
    });
}

// URLs to the CSV files in the GitHub repository
const baseURL = "https://raw.githubusercontent.com/ankudovychm/ollegehockey-macguffin/main/data/"; 
const macguffinCSV = baseURL + "macguffin.csv";
const reverseMacguffinCSV = baseURL + "reverse-macguffin.csv";
const confMacguffinsCSV = baseURL + "ConfMcguffins.csv";

// Load each CSV into the corresponding table
document.addEventListener('DOMContentLoaded', () => {
    loadCSVData(macguffinCSV, 'macguffin');
    loadCSVData(reverseMacguffinCSV, 'reverse-macguffin');
    loadCSVData(confMacguffinsCSV, 'conf-macguffins');
});
