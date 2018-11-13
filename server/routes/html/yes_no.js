const body = (url, question) => {
    let string = `
    <!doctype html> 
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"> 
        <head> <title></title> 
            <!--[if !mso]><!-- --> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!--<![endif]--> 
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
            <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
        </head>
        <body>
            <div>
                <h2>${question.title}</h2>
            </div>
            <div>
                <h3>${question.description}</h3>
            </div>
            <div>
                <a href="${url}"><h2>Ir a la encuesta...</h2></a>
            </div>
        </body>
    </html>
    `;
    return string;
}

module.exports = body;
