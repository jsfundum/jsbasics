#!/usr/bin/env node
const addressbook_pb = require('./addressbook_pb.js');
const fs = require('fs');
const readline = require('readline');

const rl =
    readline.createInterface({input: process.stdin, output: process.stdout});

function question(text) {
  return new Promise((resolve, reject) => {
    rl.question(text, result => {
      resolve(result);
    });
  });
}

async function newPerson() {
  const person = new addressbook_pb.Person();
  const id = await question('Enter person ID number: ');
  person.setId(id);
  const name = await question('Enter name: ');
  person.setName(name);
  const email = await question('Enter email address (blank for none): ');
  if (email) {
    person.setEmail(email);
  }

  while (true) {
    let phone = new addressbook_pb.Person.PhoneNumber();
    const number =
        await question('Enter a phone number (or leave blank to finish): ');
    if (number) {
      phone.setNumber(number);
    } else {
      break;
    }
    const type = await question('Is this a mobile, home, or work phone? ');
    if (type == 'mobile') {
      phone.setType(addressbook_pb.Person.PhoneType.MOBILE);
    } else if (type == 'home') {
      phone.setType(addressbook_pb.Person.PhoneType.HOME);
    } else if (type == 'work') {
      phone.setType(addressbook_pb.Person.PhoneType.WORK);
    } else {
      console.log('Unknown phone type.  Using default.');
    }
    person.addPhones(phone);
  }
  return person;
}

const work = [];
process.argv.slice(2).forEach(file => {
  console.log(`Opening file: ${file}`);
  const data = fs.readFileSync(file);
  const book = addressbook_pb.AddressBook.deserializeBinary(data);
  work.push(newPerson().then(person => {
    book.addPeople(person);
    fs.writeFileSync(file, book.serializeBinary());
  }));
});
Promise.all(work).then(() => {
  rl.close();
});
