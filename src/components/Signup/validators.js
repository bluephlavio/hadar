export const validateUsername = value => {
  return true;
}

export const validateEmail = value => {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
}

export const validatePassword = value => {
  return value.length > 5;
}

export const validatePassword2 = (value, password) => {
  return value === password;
}

export default {
  validateUsername,
  validateEmail,
  validatePassword,
  validatePassword2,
}
