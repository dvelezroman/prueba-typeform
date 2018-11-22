const scale = require("./html/scale");
const yes_no = require("./html/yes_no");
const choices = require("./html/choices");
const footer = require("./html/footer");
const emailGenerator = require('./html/emailGenerator');

// aqui se construye el html que se embebe en el mail

const html = (url, question) => {
  let string = "";
  //console.log('BODY: ', body(url, question));
  if (question.type === 'opinion_scale'){
    string = string.concat(emailGenerator(url, question));
    //string = string.concat(scale(url, question), footer);
  }else if (question.type === 'yes_no') {
    string = string.concat(yes_no(url, question), footer);
  }else {
    string = string.concat(choices(url, question), footer);
  };
  //console.log('HTML : ', string);
  return string;
};

module.exports = {
    html
}
