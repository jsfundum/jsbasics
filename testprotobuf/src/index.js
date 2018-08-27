const addressbook_pb = require('./addressbook_pb.js');

const person = new addressbook_pb.Person();
person.setId(1234);
person.setName('hahaha');
const book = new addressbook_pb.AddressBook();
book.addPeople(person);
console.log(book.serializeBinary());
