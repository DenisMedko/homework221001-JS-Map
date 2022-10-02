class ClientLevel {
  #levelName;
  constructor(levelName) {
    this.levelName = levelName;
  }
  get levelName() {
    return this.#levelName;
  }
  set levelName(levelName) {
    this.#levelName = levelName;
  }
}

const CLIENT_LEVEL_BASIC = new ClientLevel('basic');
const CLIENT_LEVEL_PRO = new ClientLevel('pro');
const CLIENT_LEVEL_GOLD = new ClientLevel('gold');
const CLIENT_LEVEL_PLATINUM = new ClientLevel('platinum');

class Client {
  #fullName;
  #clientLevel;
  #bankOfActiveCard;
  constructor(fullName, clientLevel) {
    this.fullName = fullName;
    this.clientLevel = clientLevel;
  }
  get fullName() {
    return this.#fullName;
  }
  set fullName(fullName) {
    this.#fullName = fullName;
  }
  get clientLevel() {
    return this.#clientLevel;
  }
  set clientLevel(clientLevel) {
    this.#clientLevel = clientLevel;
  }
  get bankOfActiveCard() {
    return this.#bankOfActiveCard;
  }
  set bankOfActiveCard(bank) {
    this.#bankOfActiveCard = bank;
  }
  getDiscount() {
    if(this.#bankOfActiveCard === undefined) {
      return 0;  
    }
    return this.#bankOfActiveCard.getDiscount(this);
  }
  getBalance() {
    if(this.#bankOfActiveCard === undefined) {
      throw new Error(`Set the bank of client ${this.fullName}`);  
    }
    return this.#bankOfActiveCard.getClientBalance(this);
  }
  setBalance(sum) {
    if(this.#bankOfActiveCard === undefined) {
      throw new Error(`Set the bank of client ${this.fullName}`);  
    }
    return this.#bankOfActiveCard.setClientBalance(this, sum);
  }
}
class Bank {
  #bankName;
  #clientLevels;
  #clientsAccounts;
  constructor(bankName) {
    this.bankName = bankName;
    this.#clientLevels = new Map();
    this.#clientsAccounts = new Map();
  }
  get bankName() {
    return this.#bankName;
  }
  set bankName(bankName) {
    this.#bankName = bankName;
  }

  addClientLevel(clientLevel, discount) { 
    this.#clientLevels.set(clientLevel, discount);
  }
  
  getDiscount(client) {
    return this.#clientLevels.has(client.clientLevel) ? this.#clientLevels.get(client.clientLevel) : 0;
  }
  setClientBalance(client, sum) {
    this.#clientsAccounts.set(client, sum);  
  }

  getClientBalance(client) {
    return this.#clientsAccounts.has(client) ? this.#clientsAccounts.get(client) : 0;
  }

}

const calculateCost = (client, price) => {
  const discount = client.getDiscount();
  return price * (1 - discount/100);
}

const purchase = (client, price) => {
  const balance = client.getBalance();
  if (price <= balance) {
    client.setBalance(balance - price);
    return client.getBalance(); 
  } else {
    throw new Error(`Not enough money, the lack of money is : ${Math.abs(balance - price)}`);
  }
}

const client1 = new Client('Adam Smith', CLIENT_LEVEL_BASIC);
const client2 = new Client('David Ricardo', CLIENT_LEVEL_PRO);
const client3 = new Client('Karl Marx', CLIENT_LEVEL_GOLD);
const client4 = new Client('John Maynard Keynes', CLIENT_LEVEL_PLATINUM);

const bank1 = new Bank('Goldman Sachs');
bank1.addClientLevel(CLIENT_LEVEL_BASIC, 5);
bank1.addClientLevel(CLIENT_LEVEL_PRO, 10);
bank1.addClientLevel(CLIENT_LEVEL_GOLD, 15);
bank1.addClientLevel(CLIENT_LEVEL_PLATINUM, 20);

const bank2 = new Bank('Bank of America');
bank2.addClientLevel(CLIENT_LEVEL_BASIC, 3);
bank2.addClientLevel(CLIENT_LEVEL_PRO, 4);
bank2.addClientLevel(CLIENT_LEVEL_GOLD, 5);
bank2.addClientLevel(CLIENT_LEVEL_PLATINUM, 6);

const bank3 = new Bank('J.P. Morgan');
bank3.addClientLevel(CLIENT_LEVEL_BASIC, 7);
bank3.addClientLevel(CLIENT_LEVEL_PRO, 10);

bank1.setClientBalance(client1, 1000);
//client1.bankOfActiveCard = bank1;
const finalPrice = calculateCost(client1, 1000);
try {
  const newBalance = purchase(client1, finalPrice);
  console.log(`Transaction success, balance is : ${newBalance}`);
} catch (e) {
  console.error(e.message);
}

bank2.setClientBalance(client1, 1000);
client1.bankOfActiveCard = bank2;
const finalPrice1 = calculateCost(client1, 1000);
try {
  const newBalance1 = purchase(client1, finalPrice1);
  console.log(`Transaction success, balance is : ${newBalance1}`);
} catch (e) {
  console.error(e.message);
}

bank2.setClientBalance(client1, 1000);
client2.bankOfActiveCard = bank2;
const finalPrice2 = calculateCost(client2, 100);
try {
  const newBalance2 = purchase(client2, finalPrice2);
  console.log(`Transaction success, balance is : ${newBalance2}`);
} catch (e) {
  console.error(e.message);
}


