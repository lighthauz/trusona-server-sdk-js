const chai = require('chai');
const assert = chai.assert;

const dotenv = require('dotenv').config()
const request = require('request-promise')
const uuid = require('uuid/v4')
const Trusona = require('../src/trusona')
const Trusonafication = require('../src/Trusonafication')

const token = process.env.TRUSONA_TOKEN
const secret = process.env.TRUSONA_SECRET

const createFauxDevice = () => {
  const options = {
    url: 'https://buster.staging.trusona.net/faux_devices',
    method: 'POST',
    json: true,
    body: {"relying_party_id": "0f0348f0-46d6-47c9-ba4d-2e7cd7f82e3e"},
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return request.post(options);
}

describe('Trusona', () => {
  let trusona
  let fauxDevice

  beforeEach(async () => {
    trusona = new Trusona(token, secret);
    fauxDevice = await createFauxDevice();
  });

  describe('createUserDevice', () => {
    it('should bind a user identifier to a device', async () => {
      const response = await trusona.createUserDevice(uuid(), fauxDevice.id);
      assert.exists(response.activation_code);
    });
  });

  describe('activateUserDevice', () => {
    let inactiveDevice

    beforeEach(async () => {
      inactiveDevice = await trusona.createUserDevice(uuid(), fauxDevice.id);
    })

    it('should activate an inactive device', async () => {
      const response = await trusona.activateUserDevice(inactiveDevice.activation_code)
      assert.isTrue(response.active)
    })
  })

  describe('Creating an Essential Trusonafication', () => {
    let inactiveDevice
    let activeDevice

    beforeEach(async () => {
      inactiveDevice = await trusona.createUserDevice(uuid(), fauxDevice.id);
      activeDevice = await trusona.activateUserDevice(inactiveDevice.activation_code)
    })

    it('should create a new essential trusonafication', async () => {
      const trusonafication = Trusonafication.essential
        .deviceIdentifier(activeDevice.device_identifier)
        .action("login")
        .resource("jd")
        .build();

      console.log(trusonafication)
      const response = await trusona.createTrusonafication(trusonafication)
      assert.exists(response.id)
    })
  })


  // describe('Creating an Essential Trusonafication, without user presence or a prompt', () => {
  //   let inactiveDevice
  //   let activeDevice

  //   beforeEach(async () => {
  //     inactiveDevice = await trusona.createUserDevice(uuid(), fauxDevice.id);
  //     activeDevice = await trusona.activateUserDevice(inactiveDevice.activation_code)
  //   })

  //   it('should create a new essential trusonafication', async () => {
  //     const trusonafication = new Trusonafication(activeDevice.device_identifier, "login", "jd", false, false, "", "");
  //     const response = await trusona.createTrusonafication(trusonafication)
  //     assert.exists(response.id)
  //   })
  // })

  // describe('Creating an Essential Trusonafication, with a TruCode', () => {
  //   let inactiveDevice
  //   let activeDevice

  //   beforeEach(async () => {
  //     inactiveDevice = await trusona.createUserDevice(uuid(), fauxDevice.id);
  //     activeDevice = await trusona.activateUserDevice(inactiveDevice.activation_code)
  //   })

  //   it('should create a new essential trusonafication', async () => {
  //     const trusonafication = new Trusonafication(activeDevice.device_identifier, "login", "jd", false, false, "", "73CC202D-F866-4C72-9B43-9FCF5AF149BD");
  //     const response = await trusona.createTrusonafication(trusonafication)
  //     assert.exists(response.id)
  //   })
  // })

  // describe('Creating an Essential Trusonafication, with the user\'s identifier', () => {
  //   let inactiveDevice
  //   let activeDevice

  //   beforeEach(async () => {
  //     inactiveDevice = await trusona.createUserDevice(uuid(), fauxDevice.id);
  //     activeDevice = await trusona.activateUserDevice(inactiveDevice.activation_code)
  //   })

  //   it('should create a new essential trusonafication', async () => {
  //     const trusonafication = new Trusonafication(activeDevice.device_identifier, "login", "jd", false, false, activeDevice.device_identifier, "");
  //     const response = await trusona.createTrusonafication(trusonafication)
  //     assert.exists(response.id)
  //   })
  // })
})


