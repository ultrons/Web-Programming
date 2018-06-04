"use strict";
(function() {
    var crypto = require('crypto');

    /*
     * Return a salted and hashed password entry from a
     * clear text password.
     * @param {string} clearTextPassword
     * @return {object} passwordEntry
     * where passwordEntry is an object with two string
     * properties:
     *      salt - The salt used for the password.
     *      hash - The sha1 hash of the password and salt
     */
    var makePasswordEntry = function (clearTextPassword) {
      var salt = String(Date.now());
      var shasum = crypto.createHmac('sha1', salt );
      shasum.update(clearTextPassword);
      var hash = shasum.digest('hex');
      return {
        salt: salt,
        hash: hash
      };
    };
    /*
     * Return true if the specified clear text password
     * and salt generates the specified hash.
     * @param {string} hash
     * @param {string} salt
     * @param {string} clearTextPassword
     * @return {boolean}
     */
   var doesPasswordMatch = function  (hash, salt, clearTextPassword) {
      var shasum = crypto.createHmac('sha1', salt );
      shasum.update(clearTextPassword);
      var hash_c = shasum.digest('hex');
      return (hash_c === hash);
    };

    var cs142password = {
      doesPasswordMatch: doesPasswordMatch,
      makePasswordEntry: makePasswordEntry
    };

    if( typeof exports !== 'undefined' ) {
      // We're being loaded by the Node.js module loader ('require') so we use its
      // conventions of returning the object in exports.
      exports.cs142password = cs142password;
    }
})();
