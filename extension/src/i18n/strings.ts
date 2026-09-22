// vscode.l10n.t() is locked to VS Code's own display-language setting for
// the whole session, chosen once at startup -- there is no API to make it
// follow a value the extension picks at runtime. That's fine for text
// that should follow the IDE (command palette entries, settings
// descriptions -- still handled by package.nls.*.json, a separate
// mechanism). It does NOT work for this product's actual requirement:
// students on a shared lab machine, one shared VS Code installation, each
// choosing their own feedback language from the sidebar. This table is
// that: a manually-maintained, runtime-switchable replacement for every
// string whose language should follow the student's own choice, not VS
// Code's. See docs/SPEC_ADDENDUM.md §13.

export type Language = 'en' | 'tr' | 'es';

let currentLanguage: Language = 'en';

export function setLanguage(language: Language): void {
  currentLanguage = language;
}

export function getLanguage(): Language {
  return currentLanguage;
}

const TABLES: Record<Language, Record<string, string>> = {
  en: {
    'Too many attempts. Try again in {0}s.': 'Too many attempts. Try again in {0}s.',
    'Signing in…': 'Signing in…',
    'Welcome, {0}!': 'Welcome, {0}!',
    'That username is not valid.': 'That username is not valid.',
    'That password is not valid.': 'That password is not valid.',
    'Incorrect password for this username.': 'Incorrect password for this username.',
    'Could not reach the server. Check your connection and try again.':
      'Could not reach the server. Check your connection and try again.',
    'Too many attempts, wait a moment.': 'Too many attempts, wait a moment.',
    'Sign-in is temporarily unavailable. Please tell your instructor.':
      'Sign-in is temporarily unavailable. Please tell your instructor.',
    'Something went wrong while signing in.': 'Something went wrong while signing in.',
    'Sign in first.': 'Sign in first.',
    'Change feedback language': 'Change feedback language',
    'Explanations asked for': 'Explanations asked for',
    'Errors you worked out yourself': 'Errors you worked out yourself',
    'Errors you fixed without asking': 'Errors you fixed without asking',
    'Days using this': 'Days using this',
    'Total active time': 'Total active time',
    'Lines written': 'Lines written',
    'Lines deleted': 'Lines deleted',
    'Files created': 'Files created',
    Untitled: 'Untitled',
    'Choose a language': 'Choose a language',
    'Change text size': 'Change text size',
    'Choose a text size': 'Choose a text size',
    Normal: 'Normal',
    Large: 'Large',
    'Please respond to the consent prompt to continue.': 'Please respond to the consent prompt to continue.',
    'Getting feedback…': 'Getting feedback…',
    'Could not start a session. Check your connection.': 'Could not start a session. Check your connection.',
    'The request took too long. Please try again.': 'The request took too long. Please try again.',
    'Request failed: {0}': 'Request failed: {0}',
    'Something went wrong.': 'Something went wrong.',
    'Open a file and select some code first.': 'Open a file and select some code first.',
    'Could not update your language preference.': 'Could not update your language preference.',
    'What does this mean?': 'What does this mean?',
    'I agree': 'I agree',
    'No thanks': 'No thanks',
    CONSENT_TEXT:
      'AI Code Feedback sends the code you highlight, any related error, and your course context to an AI service to generate an explanation -- only when you click to ask for one. Nothing is sent automatically. Your interactions are stored for this research study. You can withdraw at any time from the AI Code Feedback sidebar; withdrawing deletes your stored interaction history.',
    'Ask about this selection': 'Ask about this selection',
    'Ask about this': 'Ask about this',
    'Ask about 1 selected line': 'Ask about 1 selected line',
    'Ask about {0} selected lines': 'Ask about {0} selected lines',
    'What does this do?': 'What does this do?',
    'Why does this work?': 'Why does this work?',
    "What's wrong here?": "What's wrong here?",
    'Show me a simpler example': 'Show me a simpler example',
    'Something else…': 'Something else…',
    'Ask about your selection': 'Ask about your selection',
    'What would you like to know?': 'What would you like to know?',
    'What do you want to ask?': 'What do you want to ask?',
    'Keep it under 300 characters.': 'Keep it under 300 characters.',
  },
  tr: {
    'Too many attempts. Try again in {0}s.': 'Çok fazla deneme yapıldı. {0} saniye sonra tekrar dene.',
    'Signing in…': 'Giriş yapılıyor…',
    'Welcome, {0}!': 'Hoş geldin, {0}!',
    'That username is not valid.': 'Bu kullanıcı adı geçerli değil.',
    'That password is not valid.': 'Bu şifre geçerli değil.',
    'Incorrect password for this username.': 'Bu kullanıcı adı için şifre yanlış.',
    'Could not reach the server. Check your connection and try again.':
      'Sunucuya ulaşılamadı. Bağlantını kontrol edip tekrar dene.',
    'Too many attempts, wait a moment.': 'Çok fazla deneme yapıldı, biraz bekle.',
    'Sign-in is temporarily unavailable. Please tell your instructor.':
      'Giriş şu anda kullanılamıyor. Lütfen eğitmenine haber ver.',
    'Something went wrong while signing in.': 'Giriş yapılırken bir sorun oluştu.',
    'Sign in first.': 'Önce giriş yap.',
    'Change feedback language': 'Geri bildirim dilini değiştir',
    'Explanations asked for': 'İstenen açıklama sayısı',
    'Errors you worked out yourself': 'Kendin çözdüğün hatalar',
    'Errors you fixed without asking': 'Sormadan düzelttiğin hatalar',
    'Days using this': 'Kullandığın gün sayısı',
    'Total active time': 'Toplam aktif kullanım süresi',
    'Lines written': 'Yazılan satır sayısı',
    'Lines deleted': 'Silinen satır sayısı',
    'Files created': 'Oluşturulan dosya sayısı',
    Untitled: 'Başlıksız',
    'Choose a language': 'Bir dil seç',
    'Change text size': 'Metin boyutunu değiştir',
    'Choose a text size': 'Bir metin boyutu seç',
    Normal: 'Normal',
    Large: 'Büyük',
    'Please respond to the consent prompt to continue.': 'Devam etmek için onay isteğini yanıtla.',
    'Getting feedback…': 'Geri bildirim alınıyor…',
    'Could not start a session. Check your connection.': 'Oturum başlatılamadı. Bağlantını kontrol et.',
    'The request took too long. Please try again.': 'İstek çok uzun sürdü. Lütfen tekrar dene.',
    'Request failed: {0}': 'İstek başarısız oldu: {0}',
    'Something went wrong.': 'Bir şeyler ters gitti.',
    'Open a file and select some code first.': 'Önce bir dosya aç ve biraz kod seç.',
    'Could not update your language preference.': 'Dil tercihin güncellenemedi.',
    'What does this mean?': 'Bu ne anlama geliyor?',
    'I agree': 'Kabul ediyorum',
    'No thanks': 'Hayır, teşekkürler',
    CONSENT_TEXT:
      "AI Code Feedback, bir açıklama istediğinde seçtiğin kodu, ilgili hatayı ve ders bağlamını bir yapay zekâ servisine gönderir -- yalnızca sen istediğinde. Hiçbir şey otomatik olarak gönderilmez. Etkileşimlerin bu araştırma çalışması için saklanır. İstediğin zaman AI Code Feedback kenar çubuğundan katılımını geri çekebilirsin; geri çekmek saklanan etkileşim geçmişini siler.",
    'Ask about this selection': 'Bu seçim hakkında soru sor',
    'Ask about this': 'Bunun hakkında sor',
    'Ask about 1 selected line': '1 seçili satır hakkında sor',
    'Ask about {0} selected lines': '{0} seçili satır hakkında sor',
    'What does this do?': 'Bu ne işe yarıyor?',
    'Why does this work?': 'Bu neden çalışıyor?',
    "What's wrong here?": 'Burada ne yanlış?',
    'Show me a simpler example': 'Bana daha basit bir örnek göster',
    'Something else…': 'Başka bir şey…',
    'Ask about your selection': 'Seçimin hakkında sor',
    'What would you like to know?': 'Ne öğrenmek istersin?',
    'What do you want to ask?': 'Ne sormak istiyorsun?',
    'Keep it under 300 characters.': "300 karakterin altında tut.",
  },
  es: {
    'Too many attempts. Try again in {0}s.': 'Demasiados intentos. Vuelve a intentarlo en {0}s.',
    'Signing in…': 'Iniciando sesión…',
    'Welcome, {0}!': '¡Bienvenido/a, {0}!',
    'That username is not valid.': 'Ese nombre de usuario no es válido.',
    'That password is not valid.': 'Esa contraseña no es válida.',
    'Incorrect password for this username.': 'Contraseña incorrecta para este nombre de usuario.',
    'Could not reach the server. Check your connection and try again.':
      'No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.',
    'Too many attempts, wait a moment.': 'Demasiados intentos, espera un momento.',
    'Sign-in is temporarily unavailable. Please tell your instructor.':
      'El inicio de sesión no está disponible temporalmente. Avisa a tu profesor.',
    'Something went wrong while signing in.': 'Ocurrió un problema al iniciar sesión.',
    'Sign in first.': 'Primero inicia sesión.',
    'Change feedback language': 'Cambiar idioma de retroalimentación',
    'Explanations asked for': 'Explicaciones solicitadas',
    'Errors you worked out yourself': 'Errores que resolviste tú mismo/a',
    'Errors you fixed without asking': 'Errores que arreglaste sin preguntar',
    'Days using this': 'Días usando esto',
    'Total active time': 'Tiempo activo total',
    'Lines written': 'Líneas escritas',
    'Lines deleted': 'Líneas eliminadas',
    'Files created': 'Archivos creados',
    Untitled: 'Sin título',
    'Choose a language': 'Elige un idioma',
    'Change text size': 'Cambiar tamaño del texto',
    'Choose a text size': 'Elige un tamaño de texto',
    Normal: 'Normal',
    Large: 'Grande',
    'Please respond to the consent prompt to continue.': 'Responde al aviso de consentimiento para continuar.',
    'Getting feedback…': 'Obteniendo retroalimentación…',
    'Could not start a session. Check your connection.': 'No se pudo iniciar la sesión. Comprueba tu conexión.',
    'The request took too long. Please try again.': 'La solicitud tardó demasiado. Inténtalo de nuevo.',
    'Request failed: {0}': 'La solicitud falló: {0}',
    'Something went wrong.': 'Algo salió mal.',
    'Open a file and select some code first.': 'Abre un archivo y selecciona algo de código primero.',
    'Could not update your language preference.': 'No se pudo actualizar tu preferencia de idioma.',
    'What does this mean?': '¿Qué significa esto?',
    'I agree': 'Acepto',
    'No thanks': 'No, gracias',
    CONSENT_TEXT:
      'AI Code Feedback envía el código que seleccionas, cualquier error relacionado y el contexto de tu curso a un servicio de IA para generar una explicación -- solo cuando tú lo solicitas. Nada se envía automáticamente. Tus interacciones se almacenan para este estudio de investigación. Puedes retirarte en cualquier momento desde la barra lateral de AI Code Feedback; retirarte elimina tu historial de interacciones guardado.',
    'Ask about this selection': 'Preguntar sobre esta selección',
    'Ask about this': 'Preguntar sobre esto',
    'Ask about 1 selected line': 'Preguntar sobre 1 línea seleccionada',
    'Ask about {0} selected lines': 'Preguntar sobre {0} líneas seleccionadas',
    'What does this do?': '¿Qué hace esto?',
    'Why does this work?': '¿Por qué funciona esto?',
    "What's wrong here?": '¿Qué está mal aquí?',
    'Show me a simpler example': 'Muéstrame un ejemplo más simple',
    'Something else…': 'Otra cosa…',
    'Ask about your selection': 'Pregunta sobre tu selección',
    'What would you like to know?': '¿Qué te gustaría saber?',
    'What do you want to ask?': '¿Qué quieres preguntar?',
    'Keep it under 300 characters.': 'Máximo 300 caracteres.',
  },
};

/** Same positional-placeholder convention as vscode.l10n.t() ("{0}", "{1}", ...). */
export function t(key: string, ...args: string[]): string {
  const template = TABLES[currentLanguage]?.[key] ?? TABLES.en[key] ?? key;
  return args.reduce((acc: string, arg, i) => acc.split(`{${i}}`).join(arg), template);
}
