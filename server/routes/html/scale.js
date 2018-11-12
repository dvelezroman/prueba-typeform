const body = (url, question) => {
    //console.log('question : ', question);
    let width1 = Math.floor(570 / question.scale);
    let width2 = Math.floor(96 / question.scale);
    // console.log('widht1: ', width1);
    // console.log('width2: ',width2);
    let head_html_7 = `
        <!doctype html> 
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"> 
            <head> <title></title> 
                <!--[if !mso]><!-- --> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!--<![endif]--> 
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
                <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
                <style type="text/css"> #outlook a { padding: 0; } .ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; } .ExternalClass * { line-height: 100%; } body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; } table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; } img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; } p { display: block; margin: 13px 0; } </style> <!--[if !mso]><!--> <style type="text/css"> @media only screen and (max-width:480px) { @-ms-viewport { width: 320px; } @viewport { width: 320px; } } </style> 
                <!--<![endif]--> <!--[if mso]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <![endif]--> 
                <!--[if lte mso 11]> <style type="text/css"> .outlook-group-fix { width:100% !important; } </style> <![endif]--> 
                <!--[if !mso]><!--> <link href="https://fonts.googleapis.com/css?family=Karla" rel="stylesheet" type="text/css"> <style type="text/css"> @import url(https: //fonts.googleapis.com/css?family=Karla); </style> <!--<![endif]--> 
                <style type="text/css"> .hidden { display: none !important; width: 0 !important; height: 0 !important; max-height: 0 !important; } @media all and (max-width: 480px) { .mj-column-per-13 { width: 100% !important; } .mj-column-per-32 { width: 100% !important; } .mj-column-per-100 { width: 100% !important; } .desktop-labels { display: none !important; width: 0 !important; height: 0 !important; max-height: 0 !important; } .opinionScale>table>tbody>tr>td { padding: 0px 25px !important; } .titleText div { font-size: 19px !important; } .description { padding: 0px !important; } .descriptionText { font-size: 14px !important; } .opinionScaleStep { padding: 5px 0px !important; } .opinionScaleStep a { line-height: 50px !important; } .opinionScaleStep table tbody tr td tbody tr td { font-size: 16px !important; border-right: 1px solid #e4ba3f !important; border-radius: 2px !important; } .mobile-label { display: block !important; width: auto !important; height: auto !important; max-height: none !important; padding: 10px 0px 5px 0px !important; } } </style> 
                <style type="text/css"> @media only screen and (min-width:480px) { .mj-column-per-100 { width: 100% !important; } .mj-column-per-13 { width: 13.714285714285714% !important; } .mj-column-per-32 { width: 32% !important; } } </style> 
            </head>`;
    let head_html_5 = `
        <!doctype html> <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"> 
        <head> <title></title> <!--[if !mso]><!-- --> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!--<![endif]--> 
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
            <style type="text/css"> #outlook a { padding: 0; } .ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; } .ExternalClass * { line-height: 100%; } body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; } table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; } img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; } p { display: block; margin: 13px 0; } </style> 
            <!--[if !mso]><!--> <style type="text/css"> @media only screen and (max-width:480px) { @-ms-viewport { width: 320px; } @viewport { width: 320px; } } </style> <!--<![endif]--> 
            <!--[if mso]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <![endif]--> 
            <!--[if lte mso 11]> <style type="text/css"> .outlook-group-fix { width:100% !important; } </style> <![endif]--> 
            <!--[if !mso]><!--> <link href="https://fonts.googleapis.com/css?family=Karla" rel="stylesheet" type="text/css"> <style type="text/css"> @import url(https: //fonts.googleapis.com/css?family=Karla); </style> <!--<![endif]--> 
            <style type="text/css"> .hidden { display: none !important; width: 0 !important; height: 0 !important; max-height: 0 !important; } @media all and (max-width: 480px) { .mj-column-per-19 { width: 100% !important; } .mj-column-per-32 { width: 100% !important; } .mj-column-per-100 { width: 100% !important; } .desktop-labels { display: none !important; width: 0 !important; height: 0 !important; max-height: 0 !important; } .opinionScale>table>tbody>tr>td { padding: 0px 25px !important; } .titleText div { font-size: 19px !important; } .description { padding: 0px !important; } .descriptionText { font-size: 14px !important; } .opinionScaleStep { padding: 5px 0px !important; } .opinionScaleStep a { line-height: 50px !important; } .opinionScaleStep table tbody tr td tbody tr td { font-size: 16px !important; border-right: 1px solid #e4ba3f !important; border-radius: 2px !important; } .mobile-label { display: block !important; width: auto !important; height: auto !important; max-height: none !important; padding: 10px 0px 5px 0px !important; } } </style> 
            <style type="text/css"> @media only screen and (min-width:480px) { .mj-column-per-100 { width: 100% !important; } .mj-column-per-19 { width: 19.2% !important; } .mj-column-per-32 { width: 32% !important; } } </style> 
        </head>`;
    let body_question_title = `
        <body> 
            <div class="mj-container container" style="border-radius: 5px; background-color: #FFFFFF; width: 100%;"> <!--[if mso | IE]> 
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;"> 
                <tr> 
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--> 
                <div style="margin:0px auto;max-width:600px;background:#FFFFFF;"> 
                <table role="presentation" cellpadding="0" cellspacing="0" style="font-size: 0px; width: 100%; background: #FFFFFF; border-spacing: 0px;" align="center" border="0" width="100%"> 
                <tbody> 
                <tr> 
                <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:30px 0px 10px 0px;"> <!--[if mso | IE]> 
                <table role="presentation" border="0" cellpadding="0" cellspacing="0"> 
                <tr> 
                <td style="width:600px;" class="title-outlook"> <![endif]--> 
                <div style="margin: 0px auto; max-width: 600px; width: 96%;" class="title"> 
                <table role="presentation" cellpadding="0" cellspacing="0" style="font-size: 0px; width: 100%; border-spacing: 0px;" align="center" border="0" width="100%"> 
                <tbody> 
                <tr> 
                <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px 28px 20px 28px;"> <!--[if mso | IE]> 
                <table role="presentation" border="0" cellpadding="0" cellspacing="0"> <tr> <td style="vertical-align:top;width:600px;"> <![endif]--> 
                <div class="mj-column-per-100 outlook-group-fix" style="vertical-align: top; display: inline-block; direction: ltr; font-size: 13px; text-align: left; width: 100%;"> 
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="border-spacing: 0px;"> 
                <tbody> 
                <tr class="titleText"> 
                <td style="word-wrap:break-word;font-size:0px;padding:0px;" align="left"> 
                <div style="cursor:auto;color:#b89837;font-family:Font, 'Karla', Helvetica, Arial;font-size:22px;line-height:1.4;text-align:left;">${question.title}</div> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]> </td></tr></table> <![endif]--> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]> </td> </tr> 
                <tr> 
                <td style="width:600px;" class="-outlook description-outlook"> <![endif]--> 
                <div style="margin: 0px auto; max-width: 600px; width: 96%;" class=" description"> 
                <table role="presentation" cellpadding="0" cellspacing="0" style="font-size: 0px; width: 100%; border-spacing: 0px;" align="center" border="0" width="100%"> 
                <tbody> 
                <tr> 
                <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px 28px 20px 28px;"> <!--[if mso | IE]> 
                <table role="presentation" border="0" cellpadding="0" cellspacing="0"> 
                <tr> 
                <td style="vertical-align:top;width:600px;"> <![endif]--> 
                <div class="mj-column-per-100 outlook-group-fix" style="vertical-align: top; display: inline-block; direction: ltr; font-size: 13px; text-align: left; width: 100%;"> 
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="border-spacing: 0px;"> 
                <tbody> 
                <tr class="descriptionText"> 
                <td style="word-wrap:break-word;font-size:0px;padding:0px;" align="left"> 
                <div style="cursor:auto;color:#b89837;font-family:Font, 'Karla', Helvetica, Arial;font-size:16px;line-height:22px;text-align:left;">${question.description}</div> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]> </td></tr></table> <![endif]--> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]> </td> </tr> 
                <tr> 
                <td style="width:600px;" class="mobile-label-outlook"> <![endif]--> 
                <div style="margin: 0px auto; max-width: 600px; display: none; width: 0; height: 0; max-height: 0;" class="mobile-label"> 
                <table role="presentation" cellpadding="0" cellspacing="0" style="font-size: 0px; width: 100%; border-spacing: 0px;" align="center" border="0" width="100%"> 
                <tbody> 
                <tr> 
                <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px 0px 5px 0px;"> <!--[if mso | IE]> 
                <table role="presentation" border="0" cellpadding="0" cellspacing="0"> <tr> <td style="vertical-align:undefined;width:600px;"> <![endif]--> 
                <div style="cursor:auto;color:#e4ba3f;font-family:Font, 'Karla', Helvetica, Arial;font-size:13px;font-weight:200;line-height:22px;text-align:center;"> <!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0"> 
                <tr> 
                <td style="display:none;mso-hide:all;width:600px;"> <![endif]--> <!--[if mso | IE]> </td></tr></table> <![endif]--> </div> <!--[if mso | IE]> </td></tr></table> <![endif]--> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]> </td> </tr> 
                <tr> 
                <td style="width:600px;" class="opinionScale-outlook"> <![endif]--> 
                <div style="margin:0px auto;max-width:600px;" class="opinionScale"> 
                <table role="presentation" cellpadding="0" cellspacing="0" style="font-size: 0px; width: 100%; border-spacing: 0px;" align="center" border="0" width="100%"> 
                <tbody> 
                <tr> 
                <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px 28px;"> <!--[if mso | IE]> 
                <table role="presentation" border="0" cellpadding="0" cellspacing="0"> 
                <tr>
                <td style="vertical-align:top;width:114px;" class="opinionScaleStep-outlook"> <![endif]-->`;
    // armo las preguntas
    let body_questions = '';
    //let string = "";
    let scale_5 = `<div class="mj-column-per-19 outlook-group-fix opinionScaleStep" style="vertical-align: top; display: inline-block; direction: ltr; font-size: 13px; text-align: left; width: 19.2%;"> `;
    let scale_7 = `<div class="mj-column-per-13 outlook-group-fix opinionScaleStep" style="vertical-align: top; display: inline-block; direction: ltr; font-size: 13px; text-align: left; width: 13.714285714285714%;">`;
    for (let x = 1; x <= question.scale; x++) {
        let string = "";
        string = (question.scale === 5) ? scale_5 : scale_7;
        string = string.concat(`
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="border-spacing: 0px;"> 
        <tbody> <tr> 
        <td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"> 
        <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%; border-spacing: 0px;" align="center" border="0" width="100%"> <tbody> <tr> 
        <td style="border:none;border-bottom:1px solid #e4ba3f;border-left:1px solid #e4ba3f;border-radius:3px 0px 0px 3px;border-top:1px solid #e4ba3f;color:#e4ba3f;cursor:auto;padding:0px;" align="center" valign="middle" bgcolor="#fdfbf5">
        <a href="${url}?prefilled_answer=${x}" style="text-decoration:none;background:#fdfbf5;color:#e4ba3f;font-family:Font, 'Karla', Helvetica, Arial;font-size:15px;font-weight:normal;line-height:4;text-transform:none;margin:0;padding:0;display:block;" target="_blank">${x}</a>
        </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div>`);
        if (x < question.scale) {
            string = string.concat(`<!--[if mso | IE]> </td><td style="vertical-align:top;width:114px;" class="opinionScaleStep-outlook"> <![endif]-->`);
        }        
        body_questions = body_questions.concat(string); // voy concatenando las preguntas según la escala seleccionada
    };
    if (question.scale === 5) return head_html_5.concat(body_question_title ,body_questions);
    if (question.scale === 7) return head_html_7.concat(body_question_title ,body_questions); // concatenado todo el head y el body lo devuelvo
}

module.exports = body;