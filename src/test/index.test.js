const axios = require("axios");

// const API_URL = "http://localhost:8080/api";
const API_URL = "https://benaiah-lendsqr-be-test.onrender.com/api";

function generateRandomUser() {
  const names = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eva",
    "Frank",
    "Grace",
    "Helen",
    "Ivy",
    "Jack",
  ];

  const randomName = `${
    names[Math.floor(Math.random() * names.length)]
  }-${Math.floor(Math.random() * 10e2)}`;
  const randomEmail = `user${Math.floor(Math.random() * 10e2)}@example.com`;

  return { name: randomName, email: randomEmail };
}

function generateUsers() {
  const user1 = generateRandomUser();
  let user2 = generateRandomUser();

  // Ensure user2 is different from user1
  while (user2.email === user1.email) {
    user2 = generateRandomUser();
  }

  return [user1, user2];
}

const user1 = {
  username: generateUsers()[0].name,
  email: generateUsers()[0].email,
  password: "myPassword2021",
};

const user2 = {
  username: generateUsers()[1].name,
  email: generateUsers()[1].email,
  password: "myPassword2021",
};

const LoginCredential = {
  email: user1.email,
  password: user1.password,
};

let AUTH_TOKEN = null;
const updatePin = { pin: "123456" };
const fundWallet = { pin: "123456", amount: 1000000 };
const withdrawFund = { pin: "123456", amount: 2000 };
const transferFunds = {
  pin: "123456",
  amount: 20000,
  recepient_email: user2.email,
};

describe("Authentication", () => {
  test("should create 'first' user.", async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, user1);
      const res = response.data;
      if (res.errorStatus) {
        throw new Error(res?.data.message);
      }

      expect(res.errorStatus).toBe(false);
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  });

  test("should create 'second' user.", async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, user2);
      const res = response.data;
      if (res.errorStatus) {
        throw new Error(res?.data.message);
      }

      expect(res.errorStatus).toBe(false);
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  });

  test("should log a user in.", async () => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        LoginCredential
      );
      const res = response.data;
      if (res.errorStatus) {
        throw new Error(res?.data.message);
      }
      // update token
      AUTH_TOKEN = res?.data?.accessToken;

      expect(res.errorStatus).toBe(false);
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  });
});

describe("User", () => {
  // retrieve logged in user info
  test("should return a user details.", async () => {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      const res = response.data;
      if (res.errorStatus) {
        throw new Error(res?.data.message);
      }

      expect(res.errorStatus).toBe(false);
    } catch (error) {
      throw new Error(error?.response?.data?.message ?? error.message);
    }
  });

  // update transaction pin
  test("should update user transaction pin.", async () => {
    try {
      const response = await axios({
        url: `${API_URL}/user/transactionPin`,
        method: "PATCH",
        data: updatePin,
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      const res = response.data;
      if (res.errorStatus) {
        throw new Error(res?.data.message);
      }

      expect(res.errorStatus).toBe(false);
    } catch (error) {
      throw new Error(error?.response?.data?.message ?? error.message);
    }
  });

  // fetch transactions
  test("should fetch all users transactions.", async () => {
    try {
      const response = await axios({
        url: `${API_URL}/user/transactions`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      const res = response.data;
      if (res.errorStatus) {
        throw new Error(res?.data.message);
      }

      expect(res.errorStatus).toBe(false);
    } catch (error) {
      throw new Error(error?.response?.data?.message ?? error.message);
    }
  });
});

describe("Wallet", () => {
  // fund wallet
  test("should fund wallet successfully.", async () => {
    try {
      const response = await axios({
        url: `${API_URL}/wallet`,
        method: "POST",
        data: fundWallet,
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      const res = response.data;
      if (res.errorStatus) {
        throw new Error(res?.data.message);
      }

      expect(res.errorStatus).toBe(false);
    } catch (error) {
      throw new Error(error?.response?.data?.message ?? error.message);
    }
  });

  // transfer funds
  test("should transfer funds from one user to another successfully.", async () => {
    try {
      const response = await axios({
        url: `${API_URL}/wallet/transfer`,
        method: "POST",
        data: transferFunds,
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      const res = response.data;
      if (res.errorStatus) {
        throw new Error(res?.data.message);
      }

      expect(res.errorStatus).toBe(false);
    } catch (error) {
      throw new Error(error?.response?.data?.message ?? error.message);
    }
  });

  // should withdraw from wallet
  test("should withdraw from wallet.", async () => {
    try {
      const response = await axios({
        url: `${API_URL}/wallet/withdraw`,
        method: "POST",
        data: withdrawFund,
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      const res = response.data;
      if (res.errorStatus) {
        throw new Error(res?.data.message);
      }

      expect(res.errorStatus).toBe(false);
    } catch (error) {
      throw new Error(error?.response?.data?.message ?? error.message);
    }
  });
});
