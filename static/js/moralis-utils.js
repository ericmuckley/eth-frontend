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