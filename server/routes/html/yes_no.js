const body = (url, question) => {
    let string = `
    <div class="typeform-widget" data-url="https://caffeinasw.typeform.com/to/Ua64V8" style="width: 100%; height: 500px;"></div> 
    <script> (
        function() { 
            var qs,js,q,s,d=document, gi=d.getElementById, ce=d.createElement, gt=d.getElementsByTagName, id="typef_orm", b="https://embed.typeform.com/"; 
            if(!gi.call(d,id)) { 
                js=ce.call(d,"script"); 
                js.id=id; 
                js.src=b+"embed.js"; 
                q=gt.call(d,"script")[0]; 
                q.parentNode.insertBefore(js,q) 
            } 
        })() 
    </script> 
    </div>


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