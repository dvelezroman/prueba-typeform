const emailGenerator = (poll_id, question, client) => {
	// recibe el id de la encuesta y los datos de la pregunta para construir el body
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
            <table align="center" border="0" cellpadding='0' cellspacing='0' width="80%" style="border-radius:5px 5px 5px 5px; border: 1px solid #cccccc; border-collapse:collapse;">
                <tr>
                    <td align="center" bgcolor="#243665" style="border-radius:5px 5px 5px 5px; padding: 10px 0 10px 0;">
                        <img src="http://medilink.caffeinasw.com/medilink.gif" alt="Encuestas Mmedilink S.A." width="150" height="80" style="display: block;" />
                        <b style="color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px">Encuesta de Satisfacción</b>
                    </td>
                </tr>
                <tr>  
                    <td bgcolor="#ffffff" style="border-radius:5px 5px 5px 5px; padding: 10px 10px 10px 10px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr bgcolor="#9494b0">
                                <td style="padding: 5px;">
                                    <div style="color: #ffffff; font-family: Arial, sans-serif; border-radius:5px 5px 5px 5px; font-size: 12px; line-height: 14px">Estimado(a): ${
																			client.name
																		}</div>
                                    <div style="color: #ffffff; font-family: Arial, sans-serif; border-radius:5px 5px 5px 5px; font-size: 12px; line-height: 14px">Especialidad atendida: ${
																			client.group
																		}</div>
                                </td>
                            </tr>
                            <tr bgcolor="#9494b0">
                                <td style="padding: 5px;">
                                    <div style="color: #ffffff; font-family: Arial, sans-serif; border-radius:5px 5px 5px 5px; font-size: 12px; line-height: 14px">${
																			question.title
																		}</div>
                                </td>
                            </tr>
                            <tr bgcolor="#9494b0">
                                <td style="padding: 5px;">
                                    <div style="color: #ffffff; font-family: Arial, sans-serif; border-radius:5px 5px 5px 5px; font-size: 10px; line-height: 12px">${
																			question.description
																		}</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" style="border-radius:5px 5px 5px 5px; padding: 10px 20% 10px 20%;">
                        <div style="vertical-align: top; display: inline-block; direction: ltr; font-size: 13px; text-align: left; width: 100%;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
    `;
	const footer = `
                            </table>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#243665" style="display: flex; border-radius:5px 5px 5px 5px; padding: 10px 10px 10px 10px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr  bgcolor="#53638c">
                                <td align="right">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td>
                                                <a href="">
                                                    <img src="http://medilink.caffeinasw.com/twitter.gif" alt="Twitter" width="28" height="28" style="display: block;" border="0" />
                                                </a>
                                            </td>
                                            <td style="font-size: 0; line-height: 0;">&nbsp;</td>
                                            <td>
                                                <a href="">
                                                    <img src="http://medilink.caffeinasw.com/facebook.gif" alt="Facebook" width="28" height="28" style="display: block; border=0" />
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
        <footer>
            <p>Enviado por : Medilink S.A. Has recibido este mensaje porque recibiste los servicios de Medilink S.A. Todo el contenido de este boletín es enviado a nuestros clientes con el objetivo exclusivamente informativo. Política de Privacidad: Las direcciones de e-mail facilitadas por nuestros clientes son utilizadas exclusivamente para el boletín y en ningún caso son suministradas a terceros. Si no desea recibir estos mesajes, por favor escribir un mail a Servicio al CLiente: <a href="mailto:info@medilink.com.ec"> info@medilink.com.ec</a></p>
        </footer>
        </html> 
    `;
	let questions = "";
	if (question.type === "opinion_scale") {
		for (let x = 1; x <= question.scale; x++) {
			questions = questions.concat(`
                <tr> 
                    <td style="word-wrap:break-word;font-size:0px;padding:5px;" align="center"> 
                        <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%; border-spacing: 0px;" align="center" border="0" width="100%">
                            <tr> 
                                <td style="border:none;border-bottom:1px solid #8b9cb1;border-left:1px solid #8b9cb1;border-radius:5px 5px 5px 5px;border-top:1px solid #8b9cb1;color:#8b9cb1;cursor:auto;padding:0px;" align="center" valign="middle" bgcolor="#fdfbf5">
                                    <a href="http://medilink.caffeinasw.com/api/polls/answer/${poll_id}/${
				client.hcu
			}/data/${x}/office/${client.office}/order/${
				client.ref
			}" style="text-decoration:none;background:#8b9cb1;color:#ffffff;font-family:Font, 'Karla', Helvetica, Arial;font-size:12px;font-weight:normal;line-height:4;text-transform:none;margin:0;padding:0;display:block;" target="_blank">${x}</a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `);
		}
	} else if (question.type === "yes_no") {
		questions = questions.concat(`
            <tr> 
                <td style="word-wrap:break-word;font-size:0px;padding:10px;" align="center"> 
                    <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%; border-spacing: 0px;" align="center" border="0" width="100%">
                        <tr> 
                            <td style="border:none;border-bottom:1px solid #8b9cb1;border-left:1px solid #8b9cb1;border-radius:5px 5px 5px 5px;border-top:1px solid #8b9cb1;color:#8b9cb1;cursor:auto;padding:0px;" align="center" valign="middle" bgcolor="#fdfbf5">
                                <a href="http://medilink.caffeinasw.com/api/polls/answer/${poll_id}/${
			client.hcu
		}/data/1/office/${client.office}/order/${
			client.ref
		}" style="text-decoration:none;background:#8b9cb1;color:#ffffff;font-family:Font, 'Karla', Helvetica, Arial;font-size:12px;font-weight:normal;line-height:4;text-transform:none;margin:0;padding:0;display:block;" target="_blank">SI</a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr> 
                <td style="word-wrap:break-word;font-size:0px;padding:10px;" align="center"> 
                    <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%; border-spacing: 0px;" align="center" border="0" width="100%">
                        <tr> 
                            <td style="border:none;border-bottom:1px solid #8b9cb1;border-left:1px solid #8b9cb1;border-radius:5px 5px 5px 5px;border-top:1px solid #8b9cb1;color:#8b9cb1;cursor:auto;padding:0px;" align="center" valign="middle" bgcolor="#fdfbf5">
                                <a href="http://medilink.caffeinasw.com/api/polls/answer/${poll_id}/${
			client.hcu
		}/data/0/office/${client.office}/order/${
			client.ref
		}" style="text-decoration:none;background:#8b9cb1;color:#ffffff;font-family:Font, 'Karla', Helvetica, Arial;font-size:12px;font-weight:normal;line-height:4;text-transform:none;margin:0;padding:0;display:block;" target="_blank">NO</a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        `);
	} else {
		let choices = question.choices.split(",");
		for (let x = 0; x < choices.length; x++) {
			questions = questions.concat(`
                <tr> 
                    <td style="word-wrap:break-word;font-size:0px;padding:5px;" align="center"> 
                        <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%; border-spacing: 0px;" align="center" border="0" width="100%">
                            <tr> 
                                <td style="border:none;border-bottom:1px solid #8b9cb1;border-left:1px solid #8b9cb1;border-radius:5px 5px 5px 5px;border-top:1px solid #8b9cb1;color:#8b9cb1;cursor:auto;padding:0px;" align="center" valign="middle" bgcolor="#fdfbf5">
                                    <a href="http://medilink.caffeinasw.com/api/polls/answer/${poll_id}/${
				client.hcu
			}/data/${x}/office/${client.office}/order/${
				client.ref
			}" style="text-decoration:none;background:#8b9cb1;color:#ffffff;font-family:Font, 'Karla', Helvetica, Arial;font-size:12px;font-weight:normal;line-height:4;text-transform:none;margin:0;padding:0;display:block;" target="_blank">${
				choices[x]
			}</a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `);
		}
	}

	return head.concat(questions, footer);
};

module.exports = emailGenerator;
