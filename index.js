const express = require('express');
const ageDistribution = 
const pool = require('./db');
const { parseCSV } = require('./csv-parser');
const { flattenObject, mergeName } = require('./utils');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/upload', async (req, res) => {
    try {
        const jsonData = parseCSV();
        for (let data of jsonData) {
            data = mergeName(data);
            const { name, age, ...rest } = data;
            const address = {};
            const additional_info = {};
            const flatData = flattenObject(rest);

            for ( let key in flatData) {
                if (key.startsWith('address.')) {
                    address[key.replace('address.', '')] = flatData[key];
                } else {
                    additional_info[key] = flatData[key];
                }
            }

            await pool.query(
                'INSERT INTO users (name, age, address, additional_info) VALUE ($1, $2, $3, #4)',
                [name, age, address, additional_info]
            );
        }

        const result = await pool.query('SELECT age FROM user');
        const ageDistribution = result.rows.reduce((acc, row) => {
            const age = row.age;
            if ( age < 20) acc['< 20'] += 1;
            else if (age >= 20 && age <= 40) acc['20 to 40'] += 1;
            else if (age > 40 && age <= 60) acc['40 to 60'] +=1;
            else acc['> 60'] += 1;
            return acc;
        }, { '< 20' : 0, '20 to 40' : 0, '40 to 60': 0, '> 60': 0} );
        
        const total = result.rowCount;
        const ageDistributionPercentage = {};
        for (let key in ageDistribution ) {
            ageDistributionPercentage[key] = ((ageDistribution[key] / toatal) * 100).toFixed(2);
        }
        console.log('Age-Group % Distribution:', ageDistributionPercentage);
        res.send('CSV data uploaded and processed successfully.');
    } catch (error){
        console.error('Error:', error);
        res.status(500).send('An error occurred.');
    }
});

app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});