const fs = require('fs');
const path = require('path');

require('dotenv').config();

function parseCSV() {
    const csvFilePath = process.env.CSV_FILE_PATH;
    const csvContent = fs.readFileSync(path.resolve(csvFilePath), 'utf-8');
    const [header, ...rows] = csvContent.split('\n').map(row => row.split(','));

    return rows.map(row => {
        const obj = {};
        row.forEach((value, index) => {
            const keys = header[index].split('.');
            keys.reduce((acc, key, i) => {
                if (i=== keys.length - 1) {
                    acc[key] = value.trim();
                } else {
                    if (!acc[key]) acc[key] = {};
                    return acc[key];
                }
            }, obj);
        });
        return obj;
    })
}

module.exports = { parseCSV };