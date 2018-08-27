#!/usr/bin/env node
const addressbook_pb = require('./addressbook_pb.js');
const fs = require('fs');

function printAddressBook(book) {
  book.getPeopleList().forEach(person => {
    console.log(`Person ID: ${person.getId()}`);
    console.log(`  Name: ${person.getName()}`);
    if (person.getEmail()) {
      console.log(`  E-mail address: ${person.getEmail()}`);
    }

    person.getPhonesList().forEach(phone => {
      let type = '';
      switch (phone.getType()) {
        case addressbook_pb.Person.PhoneType.MOBILE:
          type = '  Mobile phone #: ';
          break;
        case addressbook_pb.Person.PhoneType.HOME:
          type = '  Home phone #: ';
          break;
        case addressbook_pb.Person.PhoneType.WORK:
          type = '  Work phone #: ';
          break;
        default:
          type = '  Unknown phone #: ';
          break;
      }
      console.log(type, phone.getNumber());
    });
    if (person.getLastUpdated()) {
      console.log(person.getLastUpdated());
    }
  });
}

process.argv.slice(2).forEach(file => {
  console.log(`Opening file: ${file}`);
  const data = fs.readFileSync(file);
  const book = addressbook_pb.AddressBook.deserializeBinary(data);
  printAddressBook(book);
});
