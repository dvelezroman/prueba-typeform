const workspace = "juq9jm";
const theme = "PWGRSx";

export const createDataForm = (
  title,
  questions,
  themeId = theme,
  workspaceId = workspace
) => {
  let fields = questions.map((question, i) => ({
    ref: `${question.ref} ${i}`,
    title: question.title,
    type: "rating",
    properties: {
      description: question.description,
      steps: 10,
      shape: "star"
    },
    validations: {
      required: false
    },
    attachment: {
      type: "video",
      href: "https://www.youtube.com/watch?v=Uui3oT-XBxs",
      scale: 0.8
    }
  }));

  const data = {
    title: title,
    settings: {
      language: "en",
      is_public: false,
      progress_bar: "percentage",
      show_progress_bar: true,
      show_typeform_branding: true,
      meta: {
        allow_indexing: true,
        description: "Cool meta description"
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
          description: "Descripción de bienvenida",
          show_button: true,
          button_text: "empezar"
        }
      }
    ],
    thankyou_screens: [
      {
        ref: "nice-readable-thank-you-ref",
        title: "Muchas Gracias",
        properties: {
          show_button: true,
          button_text: "iniciar",
          button_mode: "redirect",
          redirect_url: "https://www.typeform.com",
          share_icons: false
        }
      }
    ],
    fields
  };
  return data;
};
