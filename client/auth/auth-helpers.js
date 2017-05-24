module.exports = {
  getToken() {
    return localStorage.token;
  },
  logout() {
    var deleteCookie = function ( name ) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };
    deleteCookie('token');
    delete localStorage.token;
  },
  loggedIn() {
    return !!localStorage.token;
  }
};
