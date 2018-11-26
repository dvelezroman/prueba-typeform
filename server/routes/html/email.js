const emailGenerator = require('./emailGenerator');

// aqui se construye el html que se embebe en el mail

const html = (url, question, client) => {
  let string = "";
  let poll_id = url;
  string = string.concat(emailGenerator(poll_id, question, client));
  return string;
};

module.exports = {
    html
}
