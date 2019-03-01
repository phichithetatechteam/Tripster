module.exports = {
// using regex, checks if the username is alphanumeric and if the length is less than or equal to 30 characters long
  isValidUserName: function (userName) {
    if (userName && /^[a-z0-9]+$/i.test(userName) && 0 < userName.length <= 30) {
      return true
    }
  },
  // using regex, checks if the first_name or last_name is alpbabets only
  isValidFirstOrLastName: function (firstOrLastName) {
    if (firstOrLastName && /^[a-zA-Z]+$/.test(firstOrLastName) && 0 <= firstOrLastName.length <= 20) {
      return true
    }
  },
  // using regex, checks if age is greater than 0 and only numeric
  isValidAge: function (age) {
    if (age && /^\d+$/.test(age) && 0 < age.length <= 3 && age > 0) {
      return true
    }
  }
}
