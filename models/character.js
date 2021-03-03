// dependencies
const mongoose = require('mongoose');
// connect to database
const conn = mongoose.createConnection('mongodb://10.1.44.21/characters', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// Create Model
const Schema = mongoose.Schema;

const characterSchema = new Schema({
  name: String,
  age: Number,
  sex: String
});

const Character = conn.model('characterData', characterSchema, 'characterData');

async function GetAll() {
  return await Character.find({}, "-__v");
}

async function Get(name) {
  return await Character.findOne({ name: name }, "-__v");
}

async function GetMany(field, value) {
  return await Character.find({ [field]: value }, "-__v");
}

async function GetField(name, field) {
  return await Character.findOne({ name: name }, { _id: 0, [field]: true });
}

async function SetField(name, field, value) {
  return await Character.updateOne({ name: name }, { [field]: value });
}

module.exports = { 
    model: Character,
    GetAll: GetAll,
    Get: Get,
    GetMany: GetMany,
    GetField: GetField,
    SetField: SetField,
};

// async function InitData() 
// {
//   try
//   {
//     await Character.create({ name: 'Fred', age: 24, sex: 'Male' });
//     await Character.create({ name: 'Daphne', age: 21, sex: 'Female' });
//     await Character.create({ name: 'Wilma', age: 29, sex: 'Female' });
//     await Character.create({ name: 'Scooby', age: 5, sex: 'Male' });
//     await Character.create({ name: 'Shaggy', age: 23, sex: 'Male' });
//   }
//   catch (ex)
//   {
//     console.log(ex);
//   }
//   console.log('Done!');
// }
// InitData();