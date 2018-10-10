const workspace = "juq9jm";
const theme = "PWGRSx";

export const createDataForm = (
  title,
  questions,
  themeId = theme,
  workspaceId = workspace
) => {
  let fields = questions.map((question, i) => {
    let field = {
      ref: `${question.ref}`,
      title: `${question.title}`,
      type: `${question.type}` // aqui se debe permitir cambiar el tipo de pregunta
    };
    if (question.type === "rating") {
      // segun el tipo de pregunta se arma esta parte del field
      field = {
        ref: `${question.ref}`,
        title: `${question.title}`,
        type: `${question.type}`,
        properties: {
          description: question.description,
          steps: question.scale,
          shape: question.shape
        }
      };
    } else if (question.type === "multiple_choice") {
      let choices = question.choices.split(",").map(choice => ({
        label: choice,
        ref: `${choice}_ref`
      }));
      field = {
        ref: `${question.ref}`,
        title: `${question.title}`,
        type: `${question.type}`,
        properties: {
          description: question.description,
          choices: choices,
          allow_multiple_selection: question.allow_indexing
        }
      };
    } else if (question.type === "opinion_scale") {
      field = {
        ref: `${question.ref}`,
        title: `${question.title}`,
        type: `${question.type}`,
        properties: {
          description: question.description,
          steps: question.scale
        }
      };
    } else {
      field = {
        ref: `${question.ref}`,
        title: `${question.title}`,
        type: `${question.type}`
      };
    }
    return field;
  });

  const data = {
    title: title,
    settings: {
      language: "en",
      is_public: true,
      progress_bar: "percentage",
      show_progress_bar: true,
      show_typeform_branding: true,
      meta: {
        allow_indexing: true
      }
    },
    theme: {
      href: `https://api.typeform.com/themes/${theme}`
    },
    workspace: {
      href: `https://api.typeform.com/workspaces/${workspace}`
    },
    welcome_screens: [
      {
        ref: "nice-readable-welcome-ref",
        title: "Bienvenido",
        properties: {
          description:
            "Por favor ayudenos respondiendo las siguientes preguntas",
          show_button: true,
          button_text: "Empezar"
        }
      }
    ],
    fields
  };
  return data;
};
