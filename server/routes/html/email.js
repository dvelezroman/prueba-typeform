const emailGenerator = require('./emailGenerator');

// aqui se construye el html que se embebe en el mail

const html = (url, question) => {
  let string = "";
  let poll_id = url.split('/');
  string = string.concat(emailGenerator(poll_id[4], question));
  return string;
};

module.exports = {
    html
}
