This README file is available in three languages: English, Türkçe, and Español.

---

## English

### AI Code Feedback Extension

#### What is it?

AI Code Feedback is a Visual Studio Code extension that explains your own code to you — when you ask it to. Instead of handing over a corrected answer, it answers in four steps and lets you decide how far down you want to go.

It is written for university students who are still learning the language they are working in.

#### How does it work?

Nothing is ever sent automatically. When an error or a warning appears in your code, a **"What does this mean?"** link appears next to it. You can also highlight any piece of code and ask about it directly. Only when you click does the extension send the relevant part of your code, the related error message, and your question.

The answer always arrives as four steps:

1. **Decode** — what the error or the code actually says, in plain language. No solution, no code.
2. **Locate** — a question that points your attention at the relevant line, without answering it.
3. **Concept** — the underlying rule, with a short example that uses different names and a different scenario than your own code.
4. **Fix** — the specific change, and why it works.

Decode and Locate appear immediately. The rule and the fix stay closed until you choose to open them, so the answer is available but never forced on you.

#### Purpose

This extension was developed as part of a university research project at Universidad Rey Juan Carlos (URJC), to study how AI assistance affects the way students actually work through programming problems — when they ask for help, what they do before asking, and whether the explanation sticks.

#### Features

- "What does this mean?" beside both errors and warnings
- Ask about any selection: what does this do, why does this work, what's wrong here, show me a simpler example — or a question in your own words
- A four-step hint ladder you open at your own pace
- A progress panel with your own totals, a short summary of your recent activity, and a practice suggestion
- Recent activity list: hover a card for details, click it to read an old explanation again
- Interface and feedback in English, Türkçe or Español, switchable at any time — each student on a shared machine can pick their own
- Larger text option
- No API key needed

#### Getting started

1. Install the extension from the VS Code Marketplace
2. Open the AI Code Feedback panel from the activity bar and sign in — a username and password is enough, and the first sign-in creates your account
3. Read the consent notice and choose whether to take part in the study
4. Start writing code. When an error or warning appears, click "What does this mean?"

#### Data and privacy

This extension is part of a research study, so it is worth being precise about what leaves your machine.

- When you ask for an explanation, the extension sends the selected code, the related error message, and your question. Likely secrets (API keys, tokens, private keys) and e-mail addresses are stripped out before anything is sent.
- Your interactions are stored for the study, together with some editor activity: active time, lines written and deleted, files created, and how you moved through the four steps.
- Nothing is sent while you are simply typing.
- You can withdraw at any time from the AI Code Feedback panel. Withdrawing deletes your stored interaction history.

#### Upgrading from 0.0.1

Version 0.2.0 is a complete rewrite. Settings from the previous version are no longer used — in particular, **`aiFeedback.apiKey` still holds your old provider key in plain text in `settings.json`, and you should delete it.** Keys are no longer stored on your machine. The extension now requires VS Code 1.90 or newer.

#### Contact

If you encounter any issues or have questions about this extension, please contact:
e.coban.2024@alumnos.urjc.es

---

## Türkçe

### AI Kod Geri Bildirim Eklentisi

#### Nedir?

AI Kod Geri Bildirim, kendi kodunu sana açıklayan bir Visual Studio Code eklentisidir — ama yalnızca sen istediğinde. Düzeltilmiş bir cevabı önüne koymak yerine, dört adımda yanıt verir ve ne kadarını göreceğine sen karar verirsin.

Üzerinde çalıştığı dili henüz öğrenmekte olan üniversite öğrencileri için tasarlanmıştır.

#### Nasıl çalışır?

Hiçbir şey otomatik olarak gönderilmez. Kodunda bir hata veya uyarı belirdiğinde, yanında bir **"Bu ne anlama geliyor?"** bağlantısı çıkar. Ayrıca istediğin kod parçasını seçip doğrudan onun hakkında da soru sorabilirsin. Eklenti, yalnızca sen tıkladığında kodunun ilgili bölümünü, ilgili hata mesajını ve sorunu gönderir.

Cevap her zaman dört adım hâlinde gelir:

1. **Çöz** — hatanın ya da kodun gerçekte ne söylediği, sade bir dille. Çözüm yok, kod yok.
2. **Bul** — dikkatini ilgili satıra yönlendiren, ama cevabını vermeyen bir soru.
3. **Kavram** — altta yatan kural ve senin kodundan farklı isimler ve farklı bir senaryo kullanan kısa bir örnek.
4. **Düzeltme** — yapılacak belirli değişiklik ve neden işe yaradığı.

Çöz ve Bul hemen görünür. Kural ve düzeltme ise sen açmayı seçene kadar kapalı kalır; yani cevap elinin altındadır ama önüne zorla konmaz.

#### Amaç

Bu eklenti, Universidad Rey Juan Carlos (URJC) üniversitesinde yürütülen bir araştırma projesi kapsamında geliştirilmiştir. Amaç, yapay zekâ desteğinin öğrencilerin programlama problemlerini çözme biçimini nasıl etkilediğini incelemektir: ne zaman yardım istiyorlar, istemeden önce ne deniyorlar ve açıklama kalıcı oluyor mu.

#### Özellikler

- Hem hatalar hem de uyarılar için "Bu ne anlama geliyor?"
- Seçtiğin kod hakkında soru sorma: bu ne işe yarıyor, bu neden çalışıyor, burada ne yanlış, bana daha basit bir örnek göster — ya da kendi cümlelerinle bir soru
- Kendi hızında açtığın dört adımlı ipucu merdiveni
- Kendi sayıların, son etkinliğinin kısa bir özeti ve bir alıştırma önerisi içeren ilerleme paneli
- Son etkinlik listesi: ayrıntı için kartın üzerine gel, eski bir açıklamayı yeniden okumak için tıkla
- Arayüz ve geri bildirim İngilizce, Türkçe veya İspanyolca — istediğin an değiştirilebilir; ortak kullanılan bir bilgisayarda her öğrenci kendi dilini seçebilir
- Daha büyük metin seçeneği
- API anahtarı gerekmez

#### Başlarken

1. Eklentiyi VS Code marketinden yükle
2. Etkinlik çubuğundan AI Code Feedback panelini aç ve giriş yap — bir kullanıcı adı ve şifre yeterli, ilk girişte hesabın otomatik oluşturulur
3. Onay metnini oku ve çalışmaya katılmak isteyip istemediğine karar ver
4. Kod yazmaya başla. Bir hata veya uyarı belirdiğinde "Bu ne anlama geliyor?" bağlantısına tıkla

#### Veri ve gizlilik

Bu eklenti bir araştırma çalışmasının parçası olduğundan, bilgisayarından neyin çıktığı konusunda net olmakta fayda var.

- Bir açıklama istediğinde eklenti seçtiğin kodu, ilgili hata mesajını ve sorunu gönderir. Gizli bilgi olma ihtimali olan değerler (API anahtarları, tokenlar, özel anahtarlar) ve e-posta adresleri, hiçbir şey gönderilmeden önce temizlenir.
- Etkileşimlerin çalışma için saklanır; bunlarla birlikte bir miktar editör etkinliği de kaydedilir: aktif süre, yazılan ve silinen satırlar, oluşturulan dosyalar ve dört adım boyunca nasıl ilerlediğin.
- Sen sadece kod yazarken hiçbir şey gönderilmez.
- İstediğin an AI Code Feedback panelinden katılımını geri çekebilirsin. Geri çekmek, saklanan etkileşim geçmişini siler.

#### 0.0.1 sürümünden yükseltme

0.2.0 sürümü baştan yazılmıştır. Önceki sürümün ayarları artık kullanılmıyor — özellikle **`aiFeedback.apiKey` ayarı eski sağlayıcı anahtarını `settings.json` içinde düz metin olarak tutmaya devam ediyor, bu ayarı silmelisin.** Anahtarlar artık bilgisayarında saklanmıyor. Eklenti artık VS Code 1.90 veya daha yeni bir sürüm gerektiriyor.

#### İletişim

Bu eklentiyle ilgili herhangi bir sorunla karşılaşırsan veya sorularınız varsa, lütfen şu adrese başvur:
e.coban.2024@alumnos.urjc.es

---

## Español

### Extensión de Comentarios de Código con IA

#### ¿Qué es?

AI Code Feedback es una extensión de Visual Studio Code que te explica tu propio código — cuando tú se lo pides. En lugar de darte la respuesta ya corregida, responde en cuatro pasos y tú decides hasta dónde quieres llegar.

Está pensada para estudiantes universitarios que todavía están aprendiendo el lenguaje con el que trabajan.

#### ¿Cómo funciona?

Nunca se envía nada de forma automática. Cuando aparece un error o una advertencia en tu código, aparece junto a él un enlace **"¿Qué significa esto?"**. También puedes seleccionar cualquier fragmento de código y preguntar directamente sobre él. Solo cuando haces clic, la extensión envía la parte relevante de tu código, el mensaje de error correspondiente y tu pregunta.

La respuesta llega siempre en cuatro pasos:

1. **Decodificar** — qué dice realmente el error o el código, en lenguaje sencillo. Sin solución y sin código.
2. **Ubicar** — una pregunta que dirige tu atención a la línea relevante, sin responderla.
3. **Concepto** — la regla de fondo, con un ejemplo breve que usa nombres distintos y un escenario distinto al de tu código.
4. **Corrección** — el cambio concreto y por qué funciona.

Decodificar y Ubicar aparecen de inmediato. La regla y la corrección permanecen cerradas hasta que decidas abrirlas: la respuesta está disponible, pero nunca se te impone.

#### Propósito

Esta extensión fue desarrollada como parte de un proyecto de investigación universitaria en la Universidad Rey Juan Carlos (URJC), para estudiar cómo la asistencia de la IA afecta la forma en que los estudiantes resuelven problemas de programación: cuándo piden ayuda, qué intentan antes de pedirla y si la explicación realmente se asienta.

#### Características

- "¿Qué significa esto?" tanto en errores como en advertencias
- Preguntar sobre cualquier selección: qué hace esto, por qué funciona esto, qué está mal aquí, muéstrame un ejemplo más simple — o una pregunta con tus propias palabras
- Una escalera de pistas de cuatro pasos que abres a tu propio ritmo
- Un panel de progreso con tus propias cifras, un breve resumen de tu actividad reciente y una sugerencia de práctica
- Lista de actividad reciente: pasa el cursor por una tarjeta para ver detalles, haz clic para volver a leer una explicación anterior
- Interfaz y comentarios en inglés, turco o español, cambiables en cualquier momento — en un ordenador compartido cada estudiante puede elegir el suyo
- Opción de texto más grande
- No se necesita clave API

#### Primeros pasos

1. Instala la extensión desde el mercado de VS Code
2. Abre el panel de AI Code Feedback desde la barra de actividad e inicia sesión — basta con un nombre de usuario y una contraseña, y el primer inicio de sesión crea tu cuenta
3. Lee el aviso de consentimiento y decide si quieres participar en el estudio
4. Empieza a escribir código. Cuando aparezca un error o una advertencia, haz clic en "¿Qué significa esto?"

#### Datos y privacidad

Esta extensión forma parte de un estudio de investigación, así que conviene ser preciso sobre qué sale de tu ordenador.

- Cuando pides una explicación, la extensión envía el código seleccionado, el mensaje de error correspondiente y tu pregunta. Los posibles secretos (claves API, tokens, claves privadas) y las direcciones de correo electrónico se eliminan antes de enviar nada.
- Tus interacciones se almacenan para el estudio, junto con algo de actividad del editor: tiempo activo, líneas escritas y eliminadas, archivos creados y cómo avanzaste por los cuatro pasos.
- No se envía nada mientras simplemente escribes.
- Puedes retirarte en cualquier momento desde el panel de AI Code Feedback. Retirarte elimina tu historial de interacciones almacenado.

#### Actualizar desde la versión 0.0.1

La versión 0.2.0 es una reescritura completa. Los ajustes de la versión anterior ya no se utilizan — en particular, **`aiFeedback.apiKey` sigue conteniendo tu antigua clave del proveedor en texto plano en `settings.json`, y deberías eliminarla.** Las claves ya no se guardan en tu ordenador. La extensión requiere ahora VS Code 1.90 o posterior.

#### Contacto

Si encuentras algún problema o tienes preguntas sobre esta extensión, por favor contacta a:
e.coban.2024@alumnos.urjc.es
