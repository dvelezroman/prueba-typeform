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


// CON SI 

//parsed:

// form[yes-no:dfvs7P3g6AEw]: 1
// form[token]: fcd05737b16577f95c61d75d02cec2ee$2y$11$e2dJZC0zIXZQK1pxbSZbL.P5ECcmG.seVAWMIhc6TwNfFrsyXvBMO
// form[landed_at]: 1542169966
// form[language]: en

//raw:

// `form%5Byes-no%3A${dfvs7P3g6AEw}%5D=1&form%5Btoken%5D=${fcd05737b16577f95c61d75d02cec2ee%242y%2411%24e2dJZC0zIXZQK1pxbSZbL.P5ECcmG.seVAWMIhc6TwNfFrsyXvBMO}&form%5Blanded_at%5D=1542169966&form%5Blanguage%5D=en`

// CON NO 

//form%5Byes-no%3Adfvs7P3g6AEw%5D=0&form%5Btoken%5D=2f6b28e948a2992003dffc60873d1481%242y%2411%24e2dJZC0zIXZQK1pxbSZbL.OKftihMBsBPDSmlp4fJIs%2FDeg4.wKRO&form%5Blanded_at%5D=1542169710&form%5Blanguage%5D=en