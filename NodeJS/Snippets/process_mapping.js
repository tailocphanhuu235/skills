const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');

const collectionName = 'mappings';
const modelName = 'mapping';
const mappingFile = 'mapping.csv';

async function run() {
    mongoose.connect("mongodb://localhost:27017/ConvertDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).catch(err => console.error(err));

    //DROP OLD INFORMATION
    mongoose.connection.dropCollection(collectionName);

    // MAPPING SCHEMA
    const mappingSchema = new mongoose.Schema({
        table_name: String,
        old_name: String,
        new_name: String
    }, {minimize: false, versionKey: false});

    // CONFIGURE MAPPING MODEL
    const MappingModel = mongoose.model(modelName, mappingSchema);

    // Read CSV => Then insert into database mongodb
    fs.createReadStream(mappingFile, 'utf8')
        .pipe(csv({headers: ['TABLE_NAME', 'OLD_NAME', 'NEW_NAME'],skipLines: 1}))
        .on('data', (row) => {
            let table_name = row.TABLE_NAME;
            let old_name = row.OLD_NAME;
            let new_name = row.NEW_NAME;

            // Create new model
            const model = new MappingModel();
            model.set("table_name", table_name);
            model.set("old_name", old_name);
            model.set("new_name", new_name);
            model.save();
        })
        .on('end', () => {
            // MappingModel.find({table_name: 'ABC'}, 'table_name old_name new_name', function(err, mapping) {
            //     console.log(JSON.stringify(mapping));
            // })
            console.log('SUCCESSFUL !!!');
        });

}

run().catch(err => console.error(err));