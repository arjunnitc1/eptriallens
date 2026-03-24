/**
 * Patient page translations — English, Spanish, French
 * Only static UI strings are translated here.
 * Dynamic content (FAQs, summaries, project names) comes from the API.
 */

const translations = {
  /* ──────────── English ──────────── */
  en: {
    // Loading / error
    loading: 'Loading your information…',
    errorTitle: 'Link not valid',
    errorBody: 'This link may have expired or is invalid. Please contact your research team.',

    // Welcome
    welcomeGreeting: 'Welcome',
    welcomeBody: (projectName) =>
      `This page contains all the information you need about the ${projectName} study. Take your time to watch the video, read the summary, and explore the FAQs. If you have any questions, our chat assistant is here to help, or you can contact the clinical team directly.`,

    // Section headings
    videoHeading: '🎬 Study explainer video',
    summaryHeading: '📖 Study information summary',
    trialDocHeading: '📋 Original trial information document',
    faqHeading: '❓ Frequently asked questions',
    chatHeading: '💬 Study assistant',
    documentsHeading: '📄 Study documents',
    quizHeading: '🧠 Comprehension quiz',
    consentHeading: '✍️ Consent and agreement',

    // Summary accordion labels
    summaryWhy: 'Why this trial',
    summaryWhat: 'What participation involves',
    summaryRisks: 'Risks and benefits',
    summaryTimeline: 'Timeline and visits',
    summaryNext: 'What happens next',
    summaryVideo: 'Video',
    summaryWatchExplainer: '▶ Watch explainer',
    summaryVideoExplainer: 'Video explainer',
    summaryVideoProduction: 'Video content would play here in production',

    // Trial document
    trialDocSubtitle: 'Full participant information sheet & study guide',
    trialDocCollapse: '▲ Collapse',
    trialDocView: '▼ View document',
    trialDocOpenTab: '↗ Open in new tab',
    trialDocDownload: '⬇ Download',

    // FAQ
    faqSearchPlaceholder: 'Search FAQs…',
    faqNoResults: 'No FAQs match your search. Try different keywords or ask the assistant below.',

    // Chat
    chatDisclaimer: 'This assistant provides information about the study, not medical advice.',
    chatDoctorName: 'Dr. Lens',
    chatDoctorRole: 'Study Assistant',
    chatGreeting: "Hello! I'm Dr. Lens, your study information assistant. I can help answer questions about this trial based on the provided materials. What would you like to know?",
    chatPlaceholder: 'Ask Dr. Lens a question...',
    chatListening: 'Listening...',
    chatSend: 'Send',
    chatConnectionError: 'Connection error. Please try again.',
    chatGenericError: 'Sorry, something went wrong. Please try again.',
    chatEscalationTitle: '📞 Contact the clinical team',
    chatEscalationBody: "If Dr. Lens couldn't fully answer your question, submit it to the clinical team for a personal response.",
    chatEscalationPlaceholder: 'Type your question for the clinical team…',
    chatEscalationCancel: 'Cancel',
    chatEscalationSubmit: 'Submit question',
    chatEscalationSuccess: '✅ Your question has been submitted to the clinical team. They will respond as soon as possible.',

    // Documents
    docPISheet: 'Participant Information Sheet',
    docContract: 'Patient Contract',
    docDownload: '⬇ Download',

    // Quiz
    quizIntro: (passing, total) =>
      `Before providing your consent, please answer these questions to confirm you understand the key aspects of this trial. You need to answer at least ${passing} out of ${total} correctly to proceed.`,
    quizSubmit: 'Submit answers',
    quizCorrect: '✓ Correct',
    quizIncorrect: '✗ Incorrect',
    quizPassedTitle: 'Comprehension quiz passed',
    quizPassedBody: 'You have demonstrated understanding of the trial information. You may now proceed to the consent section below.',
    quizResultCorrect: 'correct',
    quizWellDone: 'Well done! You can now proceed to the consent section below.',
    quizRetryMsg: (passing) =>
      `You need at least ${passing} correct answers to proceed. Please review the study information and try again.`,
    quizRetry: '↻ Retry quiz',
    quizAnswerAll: (total) => `Please answer all ${total} questions to submit.`,

    // Consent
    consentLocked: 'Complete the comprehension quiz first',
    consentLockedBody: 'Please complete and pass the comprehension quiz above before providing your consent. This ensures you are fully informed about the trial.',
    consentCheck1: 'I have read and understood the information provided about this study, including the Participant Information Sheet and any other documents.',
    consentCheck2: 'I accept the terms in the patient contract and agree to participate in this study voluntarily. I understand I can withdraw at any time without giving a reason.',
    consentNameLabel: 'Full name (typed signature)',
    consentNamePlaceholder: 'Enter your full name',
    consentDrawnLabel: 'Drawn signature (optional)',
    consentClearSig: 'Clear signature',
    consentDate: 'Date:',
    consentSubmit: 'Submit consent',
    consentSubmitting: 'Submitting…',
    consentSubmitFail: 'Failed to submit consent. Please try again.',
    consentSuccessTitle: 'Consent submitted successfully',
    consentSuccessBody: 'Thank you for providing your consent. The clinical research team has been notified. You will receive confirmation shortly.',
    consentSignedBy: 'Signed by:',
    consentAlreadyTitle: 'Consent submitted',
    consentAlreadyBody: 'Thank you for providing your consent. The clinical team has been notified.',

    // Footer
    footerDisclaimer: 'This platform provides information about the study only and does not constitute medical advice.',
    footerPrivacy: 'Privacy notice placeholder · Data retention placeholder',

    // Accessibility
    a11yTitle: 'Accessibility',
    a11yFontSize: 'Font size',
    a11yHighContrast: 'High contrast',
    a11yDyslexiaFont: 'Dyslexia-friendly font',
    a11yReducedMotion: 'Reduce motion',

    // Language
    langLabel: 'Language',
  },

  /* ──────────── Spanish ──────────── */
  es: {
    loading: 'Cargando su información…',
    errorTitle: 'Enlace no válido',
    errorBody: 'Este enlace puede haber expirado o no es válido. Por favor, contacte a su equipo de investigación.',

    welcomeGreeting: 'Bienvenido/a',
    welcomeBody: (projectName) =>
      `Esta página contiene toda la información que necesita sobre el estudio ${projectName}. Tómese su tiempo para ver el vídeo, leer el resumen y explorar las preguntas frecuentes. Si tiene alguna pregunta, nuestro asistente de chat está aquí para ayudarle, o puede contactar directamente con el equipo clínico.`,

    videoHeading: '🎬 Vídeo explicativo del estudio',
    summaryHeading: '📖 Resumen de la información del estudio',
    trialDocHeading: '📋 Documento original de información del ensayo',
    faqHeading: '❓ Preguntas frecuentes',
    chatHeading: '💬 Asistente del estudio',
    documentsHeading: '📄 Documentos del estudio',
    quizHeading: '🧠 Cuestionario de comprensión',
    consentHeading: '✍️ Consentimiento y acuerdo',

    summaryWhy: 'Por qué este ensayo',
    summaryWhat: 'Qué implica la participación',
    summaryRisks: 'Riesgos y beneficios',
    summaryTimeline: 'Cronograma y visitas',
    summaryNext: 'Qué sucede a continuación',
    summaryVideo: 'Vídeo',
    summaryWatchExplainer: '▶ Ver explicación',
    summaryVideoExplainer: 'Vídeo explicativo',
    summaryVideoProduction: 'El contenido del vídeo se reproduciría aquí en producción',

    trialDocSubtitle: 'Hoja completa de información al participante y guía del estudio',
    trialDocCollapse: '▲ Contraer',
    trialDocView: '▼ Ver documento',
    trialDocOpenTab: '↗ Abrir en nueva pestaña',
    trialDocDownload: '⬇ Descargar',

    faqSearchPlaceholder: 'Buscar preguntas frecuentes…',
    faqNoResults: 'Ninguna pregunta frecuente coincide con su búsqueda. Pruebe con otras palabras clave o pregunte al asistente a continuación.',

    chatDisclaimer: 'Este asistente proporciona información sobre el estudio, no asesoramiento médico.',
    chatDoctorName: 'Dr. Lens',
    chatDoctorRole: 'Asistente del Estudio',
    chatGreeting: '¡Hola! Soy el Dr. Lens, su asistente de información del estudio. Puedo ayudar a responder preguntas sobre este ensayo basándome en los materiales proporcionados. ¿Qué le gustaría saber?',
    chatPlaceholder: 'Haga una pregunta al Dr. Lens...',
    chatListening: 'Escuchando...',
    chatSend: 'Enviar',
    chatConnectionError: 'Error de conexión. Por favor, inténtelo de nuevo.',
    chatGenericError: 'Lo sentimos, algo salió mal. Por favor, inténtelo de nuevo.',
    chatEscalationTitle: '📞 Contactar al equipo clínico',
    chatEscalationBody: 'Si el Dr. Lens no pudo responder completamente a su pregunta, envíela al equipo clínico para una respuesta personalizada.',
    chatEscalationPlaceholder: 'Escriba su pregunta para el equipo clínico…',
    chatEscalationCancel: 'Cancelar',
    chatEscalationSubmit: 'Enviar pregunta',
    chatEscalationSuccess: '✅ Su pregunta ha sido enviada al equipo clínico. Le responderán lo antes posible.',

    docPISheet: 'Hoja de Información al Participante',
    docContract: 'Contrato del Paciente',
    docDownload: '⬇ Descargar',

    quizIntro: (passing, total) =>
      `Antes de dar su consentimiento, responda estas preguntas para confirmar que comprende los aspectos clave de este ensayo. Necesita acertar al menos ${passing} de ${total} para continuar.`,
    quizSubmit: 'Enviar respuestas',
    quizCorrect: '✓ Correcto',
    quizIncorrect: '✗ Incorrecto',
    quizPassedTitle: 'Cuestionario de comprensión aprobado',
    quizPassedBody: 'Ha demostrado comprensión de la información del ensayo. Ahora puede proceder a la sección de consentimiento a continuación.',
    quizResultCorrect: 'correctas',
    quizWellDone: '¡Bien hecho! Ahora puede proceder a la sección de consentimiento a continuación.',
    quizRetryMsg: (passing) =>
      `Necesita al menos ${passing} respuestas correctas para continuar. Revise la información del estudio e inténtelo de nuevo.`,
    quizRetry: '↻ Reintentar cuestionario',
    quizAnswerAll: (total) => `Por favor, responda todas las ${total} preguntas para enviar.`,

    consentLocked: 'Complete el cuestionario de comprensión primero',
    consentLockedBody: 'Complete y apruebe el cuestionario de comprensión anterior antes de dar su consentimiento. Esto asegura que está completamente informado/a sobre el ensayo.',
    consentCheck1: 'He leído y comprendido la información proporcionada sobre este estudio, incluida la Hoja de Información al Participante y cualquier otro documento.',
    consentCheck2: 'Acepto los términos del contrato del paciente y acepto participar en este estudio voluntariamente. Entiendo que puedo retirarme en cualquier momento sin dar una razón.',
    consentNameLabel: 'Nombre completo (firma escrita)',
    consentNamePlaceholder: 'Introduzca su nombre completo',
    consentDrawnLabel: 'Firma dibujada (opcional)',
    consentClearSig: 'Borrar firma',
    consentDate: 'Fecha:',
    consentSubmit: 'Enviar consentimiento',
    consentSubmitting: 'Enviando…',
    consentSubmitFail: 'Error al enviar el consentimiento. Por favor, inténtelo de nuevo.',
    consentSuccessTitle: 'Consentimiento enviado con éxito',
    consentSuccessBody: 'Gracias por dar su consentimiento. El equipo de investigación clínica ha sido notificado. Recibirá confirmación en breve.',
    consentSignedBy: 'Firmado por:',
    consentAlreadyTitle: 'Consentimiento enviado',
    consentAlreadyBody: 'Gracias por dar su consentimiento. El equipo clínico ha sido notificado.',

    footerDisclaimer: 'Esta plataforma proporciona información sobre el estudio únicamente y no constituye asesoramiento médico.',
    footerPrivacy: 'Aviso de privacidad · Retención de datos',

    a11yTitle: 'Accesibilidad',
    a11yFontSize: 'Tamaño de fuente',
    a11yHighContrast: 'Alto contraste',
    a11yDyslexiaFont: 'Fuente para dislexia',
    a11yReducedMotion: 'Reducir animaciones',

    langLabel: 'Idioma',
  },

  /* ──────────── French ──────────── */
  fr: {
    loading: 'Chargement de vos informations…',
    errorTitle: 'Lien non valide',
    errorBody: "Ce lien a peut-être expiré ou n'est pas valide. Veuillez contacter votre équipe de recherche.",

    welcomeGreeting: 'Bienvenue',
    welcomeBody: (projectName) =>
      `Cette page contient toutes les informations dont vous avez besoin sur l'étude ${projectName}. Prenez votre temps pour regarder la vidéo, lire le résumé et explorer les FAQ. Si vous avez des questions, notre assistant de chat est là pour vous aider, ou vous pouvez contacter directement l'équipe clinique.`,

    videoHeading: '🎬 Vidéo explicative de l\'étude',
    summaryHeading: '📖 Résumé des informations de l\'étude',
    trialDocHeading: '📋 Document original d\'information sur l\'essai',
    faqHeading: '❓ Questions fréquemment posées',
    chatHeading: '💬 Assistant de l\'étude',
    documentsHeading: '📄 Documents de l\'étude',
    quizHeading: '🧠 Questionnaire de compréhension',
    consentHeading: '✍️ Consentement et accord',

    summaryWhy: 'Pourquoi cet essai',
    summaryWhat: 'Ce qu\'implique la participation',
    summaryRisks: 'Risques et avantages',
    summaryTimeline: 'Calendrier et visites',
    summaryNext: 'Que se passe-t-il ensuite',
    summaryVideo: 'Vidéo',
    summaryWatchExplainer: '▶ Voir l\'explication',
    summaryVideoExplainer: 'Vidéo explicative',
    summaryVideoProduction: 'Le contenu vidéo serait lu ici en production',

    trialDocSubtitle: 'Fiche complète d\'information du participant et guide de l\'étude',
    trialDocCollapse: '▲ Réduire',
    trialDocView: '▼ Voir le document',
    trialDocOpenTab: '↗ Ouvrir dans un nouvel onglet',
    trialDocDownload: '⬇ Télécharger',

    faqSearchPlaceholder: 'Rechercher dans les FAQ…',
    faqNoResults: 'Aucune FAQ ne correspond à votre recherche. Essayez d\'autres mots-clés ou posez la question à l\'assistant ci-dessous.',

    chatDisclaimer: 'Cet assistant fournit des informations sur l\'étude, pas des conseils médicaux.',
    chatDoctorName: 'Dr. Lens',
    chatDoctorRole: 'Assistant de l\'Étude',
    chatGreeting: 'Bonjour ! Je suis le Dr. Lens, votre assistant d\'information sur l\'étude. Je peux vous aider à répondre aux questions sur cet essai en me basant sur les documents fournis. Que souhaitez-vous savoir ?',
    chatPlaceholder: 'Posez une question au Dr. Lens...',
    chatListening: 'Écoute en cours...',
    chatSend: 'Envoyer',
    chatConnectionError: 'Erreur de connexion. Veuillez réessayer.',
    chatGenericError: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
    chatEscalationTitle: '📞 Contacter l\'équipe clinique',
    chatEscalationBody: 'Si le Dr. Lens n\'a pas pu répondre entièrement à votre question, soumettez-la à l\'équipe clinique pour une réponse personnalisée.',
    chatEscalationPlaceholder: 'Tapez votre question pour l\'équipe clinique…',
    chatEscalationCancel: 'Annuler',
    chatEscalationSubmit: 'Soumettre la question',
    chatEscalationSuccess: '✅ Votre question a été soumise à l\'équipe clinique. Ils vous répondront dès que possible.',

    docPISheet: 'Fiche d\'Information du Participant',
    docContract: 'Contrat du Patient',
    docDownload: '⬇ Télécharger',

    quizIntro: (passing, total) =>
      `Avant de donner votre consentement, veuillez répondre à ces questions pour confirmer que vous comprenez les aspects clés de cet essai. Vous devez répondre correctement à au moins ${passing} questions sur ${total} pour continuer.`,
    quizSubmit: 'Soumettre les réponses',
    quizCorrect: '✓ Correct',
    quizIncorrect: '✗ Incorrect',
    quizPassedTitle: 'Questionnaire de compréhension réussi',
    quizPassedBody: 'Vous avez démontré votre compréhension des informations de l\'essai. Vous pouvez maintenant passer à la section de consentement ci-dessous.',
    quizResultCorrect: 'correctes',
    quizWellDone: 'Bien joué ! Vous pouvez maintenant passer à la section de consentement ci-dessous.',
    quizRetryMsg: (passing) =>
      `Vous avez besoin d'au moins ${passing} réponses correctes pour continuer. Veuillez revoir les informations de l'étude et réessayer.`,
    quizRetry: '↻ Réessayer le questionnaire',
    quizAnswerAll: (total) => `Veuillez répondre aux ${total} questions pour soumettre.`,

    consentLocked: 'Complétez d\'abord le questionnaire de compréhension',
    consentLockedBody: 'Veuillez compléter et réussir le questionnaire de compréhension ci-dessus avant de donner votre consentement. Cela garantit que vous êtes pleinement informé(e) sur l\'essai.',
    consentCheck1: 'J\'ai lu et compris les informations fournies sur cette étude, y compris la Fiche d\'Information du Participant et tout autre document.',
    consentCheck2: 'J\'accepte les termes du contrat du patient et j\'accepte de participer à cette étude volontairement. Je comprends que je peux me retirer à tout moment sans donner de raison.',
    consentNameLabel: 'Nom complet (signature dactylographiée)',
    consentNamePlaceholder: 'Entrez votre nom complet',
    consentDrawnLabel: 'Signature dessinée (facultatif)',
    consentClearSig: 'Effacer la signature',
    consentDate: 'Date :',
    consentSubmit: 'Soumettre le consentement',
    consentSubmitting: 'Envoi en cours…',
    consentSubmitFail: 'Échec de la soumission du consentement. Veuillez réessayer.',
    consentSuccessTitle: 'Consentement soumis avec succès',
    consentSuccessBody: 'Merci d\'avoir donné votre consentement. L\'équipe de recherche clinique a été informée. Vous recevrez une confirmation sous peu.',
    consentSignedBy: 'Signé par :',
    consentAlreadyTitle: 'Consentement soumis',
    consentAlreadyBody: 'Merci d\'avoir donné votre consentement. L\'équipe clinique a été informée.',

    footerDisclaimer: 'Cette plateforme fournit des informations sur l\'étude uniquement et ne constitue pas un avis médical.',
    footerPrivacy: 'Avis de confidentialité · Conservation des données',

    a11yTitle: 'Accessibilité',
    a11yFontSize: 'Taille de police',
    a11yHighContrast: 'Contraste élevé',
    a11yDyslexiaFont: 'Police dyslexie',
    a11yReducedMotion: 'Réduire les animations',

    langLabel: 'Langue',
  },
};

export default translations;
