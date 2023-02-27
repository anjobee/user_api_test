const { faker } = require('@faker-js/faker');

const generateUser = () => {
  const username = faker.internet.userName();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  const password = faker.internet.password();
  const address = faker.address.streetAddress();
  const postcode = faker.address.zipCode();
  const contactNo = faker.phone.number();

  return {
    username,
    firstName,
    lastName,
    email,
    password,
    address,
    postcode,
    contactNo
  };
};

const generateUsers = (count) => {
  const users = [];

  for (let i = 0; i < count; i++) {
    users.push(generateUser());
  }

  return users;
};

module.exports = generateUsers;