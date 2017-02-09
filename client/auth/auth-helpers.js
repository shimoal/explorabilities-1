module.exports = {
  getToken() {
    return localStorage.token;
  },
  logout() {
    console.log(localStorage);
    delete localStorage.token;
  },
  loggedIn() {
    return !!localStorage.token;
  }
};
