const emailGenerator = (poll_id, question) => { // recibe el id de la encuesta y los datos de la pregunta para construir el body
    //console.log('question : ', question);
    //console.log('poll_id : ', poll_id);
    const head = `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style='margin: 0; padding: 0;'>
            <table align="center" border="1" cellpadding='0' cellspacing='0' width="80%" style="border-collapse:collapse;">
                <tr>
                    <td align="center" bgcolor="#243665" style="padding: 10px 0 10px 0;">
                        <img src="../../../browser/public/medilink.gif" alt="Encuestas Mmedilink S.A." width="150" height="80" style="display: block;" />
                        <b style="color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px">Encuesta de Satisfacción</b>
                    </td>
                </tr>
                <tr>  
                    <td bgcolor="#243665" style="padding: 40px 30px 40px 30px;">
                        <table border="1" cellpadding="0" cellspacing="0" width="100%">
                            <tr bgcolor="#9494b0">
                                <td style="padding: 10px 0 10px 0;">
                                    <div style="color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px">Pregunta</div>
                                </td>
                            </tr>
                            <tr bgcolor="#9494b0">
                                <td style="padding: 10px 0 10px 0;">
                                    <div style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px">Aclaración</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#243665" style="padding: 40px 20% 40px 20%;">
                        <div style="vertical-align: top; display: inline-block; direction: ltr; font-size: 13px; text-align: left; width: 100%;">
                            <table border="1" cellpadding="0" cellspacing="0" width="100%">
    `;
    const footer = `
                            </table>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#243665" style="display: flex; padding: 10px 30px 10px 30px;">
                        <table border="1" cellpadding="0" cellspacing="0" width="100%">
                            <tr  bgcolor="#53638c">
                                <td>
                                    <div style="color: #ffffff; font-family: Arial, sans-serif; font-size: 10px; line-height: 20px">&reg; Medilink S.A. 2018<br/></div>
                                </td>
                                <td align="right">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td>
                                                <a href="">
                                                    <img src="../../../browser/public/twitter.gif" alt="Twitter" width="38" height="38" style="display: block;" border="0" />
                                                </a>
                                            </td>
                                            <td style="font-size: 0; line-height: 0;">&nbsp;</td>
                                            <td>
                                                <a href="">
                                                    <img src="../../../browser/public/facebook.gif" alt="Facebook" width="38" height="38" style="display: block; border=0" />
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html> 
    `;
    let questions = '';
    for (let x=1; x < question.scale; x++) {
        questions = questions.concat(`
        <tr> 
            <td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"> 
                <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%; border-spacing: 0px;" align="center" border="0" width="100%">
                    <tr> 
                        <td style="border:none;border-bottom:1px solid #8b9cb1;border-left:1px solid #8b9cb1;border-radius:3px 0px 0px 3px;border-top:1px solid #8b9cb1;color:#8b9cb1;cursor:auto;padding:0px;" align="center" valign="middle" bgcolor="#fdfbf5">
                            <a href="/medilink.caffeinasw.com/api/answer/${poll_id}/data?response=${x}" style="text-decoration:none;background:#8b9cb1;color:#ffffff;font-family:Font, 'Karla', Helvetica, Arial;font-size:12px;font-weight:normal;line-height:4;text-transform:none;margin:0;padding:0;display:block;" target="_blank">${x}</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        `);
    };
    return head.concat(questions, footer);
};

module.exports = emailGenerator;
