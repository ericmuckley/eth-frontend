//const INFURA_URI = "https://mainnet.infura.io/v3/9104b3a76b4b46b29c1cc489338980b8";
//const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URI));
//const myAddress = "0x91a42eCF59abB8350A0A64c8D3f5eb3bD08cc6c2";


const serverUrl = "https://mysaxj65vywx.usemoralis.com:2053/server";
const appId = "iPXKdV96rgPUw4gJAxNnJw5gPRBKeGOwX8vFtQHZ";
Moralis.start({ serverUrl, appId });


document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;
document.getElementById("btn-get-stats").onclick = getStats;



// Logging in and out
async function login() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate();
  };
  console.log("logged in user:", user);
  getStats();
};
async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}

function getStats() {
  const user = Moralis.User.current();
  if (user) {
    getUserTransactions(user);
  }
}
async function getUserTransactions(user) {
  // create query
  const query = new Moralis.Query("EthTransactions");
  query.equalTo("from_address", user.get("ethAddress"));
  // run query
  const results = await query.find();
  console.log("user transactions:", results);
}

getStats();