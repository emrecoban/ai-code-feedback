// Project facts, stored once. The home page renders all three languages from
// this file. Correct a fact here and every language changes.
//
// Placeholders: { todo: { en, tr, es } } is shown as a visible TODO badge and
// { confirm: { en, tr, es } } as a CONFIRM badge. Search for "todo:" and "confirm:".

import type { T3 } from './terms'

// The note inside a placeholder is written in all three languages, so no
// English appears on the Turkish and Spanish pages.
export type Fact = string | { todo: T3 } | { confirm: T3; value?: string }
type L3<T = Fact> = { en: T; tr: T; es: T }

export const project = {
  name: 'AI Code Feedback',
  marketplaceId: 'EmreCOBAN.ai-code-feedback',
  marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=EmreCOBAN.ai-code-feedback',
  principle: {
    en: 'The system may notice, only the student may ask.',
    tr: 'Sistem fark edebilir, ama yalnızca öğrenci sorabilir.',
    es: 'El sistema puede darse cuenta, pero solo el estudiante puede preguntar.',
  } as T3,
  summary: {
    en: 'AI Code Feedback is a VS Code extension for beginner programming students. It gives AI-generated formative feedback on their own code, and only when they ask for it. This site lists the data the extension collects and explains how each item can be used in research.',
    tr: 'AI Code Feedback, programlamaya yeni başlayan öğrenciler için bir VS Code eklentisidir. Öğrencinin kendi koduna yapay zekâ ile biçimlendirici geri bildirim verir ve bunu yalnızca öğrenci istediğinde yapar. Bu site, eklentinin topladığı verileri listeler ve her birinin araştırmada nasıl kullanılabileceğini açıklar.',
    es: 'AI Code Feedback es una extensión de VS Code para estudiantes que empiezan a programar. Ofrece retroalimentación formativa generada por IA sobre su propio código, y solo cuando el estudiante la pide. Este sitio enumera los datos que recoge la extensión y explica cómo se puede usar cada uno en la investigación.',
  } as T3,
  versions: [
    {
      version: '0.0.1',
      date: '2025-08-20',
      label: { en: 'first version', tr: 'ilk sürüm', es: 'primera versión' } as T3,
    },
    {
      version: '0.2.0',
      date: '2026-09-22',
      label: { en: 'complete rewrite', tr: 'baştan yazılan sürüm', es: 'reescritura completa' } as T3,
    },
  ],
  // Taken from the code and the extension README (0.2.0).
  features: {
    en: [
      '"What does this mean?" next to errors and warnings in the editor.',
      'Questions about selected code: four ready questions or the student\'s own question.',
      'Every answer is a four-step hint ladder: Decode, Locate, Concept and Fix. The last two steps open only when the student asks.',
      'A progress panel with the student\'s own totals, a short summary and a practice suggestion.',
      'Interface and feedback in English, Turkish and Spanish, chosen by each student.',
      'In-use research data stored in Supabase and shown in a real-time dashboard for instructors and researchers.',
    ],
    tr: [
      'Editördeki hata ve uyarıların yanında "Bu ne anlama geliyor?" bağlantısı.',
      'Seçilen kod hakkında soru: dört hazır soru ya da öğrencinin kendi sorusu.',
      'Her yanıt dört adımlı bir ipucu merdivenidir: Çöz, Bul, Kavram ve Düzeltme. Son iki adım yalnızca öğrenci isterse açılır.',
      'Öğrencinin kendi toplamlarını, kısa bir özeti ve bir alıştırma önerisini gösteren ilerleme paneli.',
      'Her öğrencinin seçtiği dilde (İngilizce, Türkçe, İspanyolca) arayüz ve geri bildirim.',
      'Kullanım sırasında Supabase’e kaydedilen araştırma verisi ve bu veriyi öğretim elemanları ile araştırmacılara anlık gösteren bir panel.',
    ],
    es: [
      '"¿Qué significa esto?" junto a los errores y advertencias del editor.',
      'Preguntas sobre el código seleccionado: cuatro preguntas preparadas o una pregunta propia.',
      'Cada respuesta es una escalera de cuatro pasos: Descifrar, Ubicar, Concepto y Corrección. Los dos últimos solo se abren si el estudiante lo pide.',
      'Un panel de progreso con los totales del estudiante, un breve resumen y una propuesta de práctica.',
      'Interfaz y explicaciones en inglés, turco o español, a elección de cada estudiante.',
      'Datos de investigación recogidos durante el uso, guardados en Supabase y mostrados en un panel en tiempo real para el profesorado y los investigadores.',
    ],
  } as L3<string[]>,
  developer: {
    name: 'Emre Çoban',
    orcid: '0000-0001-9142-3858',
    github: 'emrecoban',
    email: 'e.coban.2024@alumnos.urjc.es',
    role: {
      en: 'PhD student, PhD Program in Information and Communication Technologies, Universidad Rey Juan Carlos (URJC), Madrid, Spain',
      tr: 'Doktora öğrencisi, Bilgi ve İletişim Teknolojileri Doktora Programı, Universidad Rey Juan Carlos (URJC), Madrid, İspanya',
      es: 'Doctorando, Programa de Doctorado en Tecnologías de la Información y las Comunicaciones, Universidad Rey Juan Carlos (URJC), Madrid, España',
    } as T3,
    thesis: 'An AI-Based Methodology for Improving Programming Education',
    supervisor: {
      en: 'Assoc. Prof. Raquel Belén Hijón Neira (URJC)',
      tr: 'Doç. Dr. Raquel Belén Hijón Neira (URJC)',
      es: 'Prof.ª Titular Raquel Belén Hijón Neira (URJC)',
    } as T3,
    position: {
      en: 'Lecturer, Department of Computer Technologies, Vocational School of Technical Sciences, Ardahan University, Türkiye',
      tr: 'Öğretim Görevlisi, Bilgisayar Teknolojileri Bölümü, Teknik Bilimler Meslek Yüksekokulu, Ardahan Üniversitesi, Türkiye',
      es: 'Profesor, Departamento de Tecnologías Informáticas, Escuela Profesional de Ciencias Técnicas, Universidad de Ardahan, Türkiye',
    } as T3,
  },
  publications: [
    {
      id: 'coban2026educon',
      authorsApa: 'Çoban, E., & Hijón-Neira, R.',
      authorsIeee: 'E. Çoban and R. Hijón-Neira',
      authorsBib: '\\c{C}oban, E. and Hij\\\'{o}n-Neira, R.',
      title: 'AI Code Feedback: An AI-Based Companion for Enhancing Introductory Programming Education',
      titleApa: 'AI Code Feedback: An AI-based companion for enhancing introductory programming education',
      conference: 'IEEE Global Engineering Education Conference (EDUCON 2026)',
      proceedingsApa: '2026 IEEE Global Engineering Education Conference (EDUCON)',
      proceedingsIeee: 'Proc. 2026 IEEE Global Eng. Educ. Conf. (EDUCON)',
      place: 'Cairo, Egypt',
      dates: '27–30 April 2026',
      year: 2026,
      pages: { todo: { en: 'page numbers (the paper is not indexed yet)', tr: 'sayfa numaraları (bildiri henüz dizinlenmedi)', es: 'páginas (el artículo aún no está indexado)' } } as Fact,
      doi: '10.1109/EDUCON67543.2026.11574260',
    },
  ],
  // Design facts only, no results. Order confirmed by the developer.
  phases: [
    {
      when: '2025-08-20',
      title: { en: 'Version 0.0.1 (first version) released', tr: '0.0.1 sürümü (ilk sürüm) yayımlandı', es: 'Publicada la versión 0.0.1 (primera versión)' } as T3,
      text: {
        en: 'Published on the Visual Studio Marketplace as EmreCOBAN.ai-code-feedback.',
        tr: 'Visual Studio Marketplace’te EmreCOBAN.ai-code-feedback adıyla yayımlandı.',
        es: 'Publicada en Visual Studio Marketplace como EmreCOBAN.ai-code-feedback.',
      } as L3,
    },
    {
      when: { en: 'September–December 2025', tr: 'Eylül–Aralık 2025', es: 'Septiembre–diciembre de 2025' } as T3,
      title: { en: 'Pilot study', tr: 'Pilot çalışma', es: 'Estudio piloto' } as T3,
      text: {
        en: 'Ardahan, Programming Basics course, N = 30. Python exercises, pre-test and post-test, TAM survey. Students left the extension to ask follow-up questions in browser AI tools, and this shaped version 0.2.0.',
        tr: 'Ardahan, Programlama Temelleri dersi, N = 30. Python alıştırmaları, ön test ve son test, TAM anketi. Öğrenciler ek sorular için eklentiden çıkıp tarayıcıdaki yapay zekâ araçlarına gitti. Bu gözlem 0.2.0 sürümünü biçimlendirdi.',
        es: 'Ardahan, asignatura Fundamentos de Programación, N = 30. Ejercicios de Python, pretest y postest, cuestionario TAM. Los estudiantes salían de la extensión para hacer preguntas de seguimiento en herramientas de IA del navegador, y esto dio forma a la versión 0.2.0.',
      } as L3,
      open: [{ confirm: { en: 'number of groups (one group, or two groups with the same exercises)', tr: 'grup sayısı (tek grup mu, aynı alıştırmaları yapan iki grup mu)', es: 'número de grupos (un grupo o dos grupos con los mismos ejercicios)' } }] as Fact[],
    },
    {
      when: { todo: { en: 'term of Study 1 and Study 2', tr: 'Çalışma 1 ve Çalışma 2’nin dönemi', es: 'periodo del Estudio 1 y del Estudio 2' } } as Fact,
      title: { en: 'Study 1 (Spain) and Study 2 (Türkiye), at the same time', tr: 'Çalışma 1 (İspanya) ve Çalışma 2 (Türkiye), aynı dönemde', es: 'Estudio 1 (España) y Estudio 2 (Türkiye), en paralelo' } as T3,
      text: {
        en: 'Study 1: Java course, Madrid (n = 21) and Móstoles (n = 47) campuses, N = 68, experimental and control conditions, pre-test and post-test, TAM survey. Study 2: Python course, single group, N = 25, eight weeks, pre-test and post-test, TAM survey.',
        tr: 'Çalışma 1: Java dersi, Madrid (n = 21) ve Móstoles (n = 47) kampüsleri, N = 68, deney ve kontrol koşulları, ön test ve son test, TAM anketi. Çalışma 2: Python dersi, tek grup, N = 25, sekiz hafta, ön test ve son test, TAM anketi.',
        es: 'Estudio 1: asignatura de Java, campus de Madrid (n = 21) y Móstoles (n = 47), N = 68, condiciones experimental y de control, pretest y postest, cuestionario TAM. Estudio 2: asignatura de Python, grupo único, N = 25, ocho semanas, pretest y postest, cuestionario TAM.',
      } as L3,
      open: [
        { todo: { en: 'Study 1: n of the experimental and the control group', tr: 'Çalışma 1: deney ve kontrol gruplarının n değeri', es: 'Estudio 1: n del grupo experimental y del grupo de control' } },
        { todo: { en: 'Study 2: institution', tr: 'Çalışma 2: kurum', es: 'Estudio 2: institución' } },
      ] as Fact[],
    },
    {
      when: { en: '27–30 April 2026', tr: '27–30 Nisan 2026', es: '27–30 de abril de 2026' } as T3,
      title: { en: 'Paper presented at IEEE EDUCON 2026', tr: 'Bildiri IEEE EDUCON 2026’da sunuldu', es: 'Artículo presentado en IEEE EDUCON 2026' } as T3,
      text: {
        en: 'Cairo, Egypt. This completed the first phase of the thesis.',
        tr: 'Kahire, Mısır. Böylece tezin ilk aşaması tamamlandı.',
        es: 'El Cairo, Egipto. Con ello se completó la primera fase de la tesis.',
      } as L3,
    },
    {
      when: { en: '2026', tr: '2026', es: '2026' } as T3,
      title: { en: 'Multi-study manuscript', tr: 'Çok çalışmalı makale', es: 'Manuscrito multiestudio' } as T3,
      text: {
        en: 'The results of Study 1 and Study 2 were combined into one multi-study manuscript for journal publication.',
        tr: 'Çalışma 1 ve Çalışma 2’nin sonuçları, dergide yayımlanmak üzere tek bir çok çalışmalı makalede birleştirildi.',
        es: 'Los resultados del Estudio 1 y del Estudio 2 se combinaron en un único manuscrito multiestudio para su publicación en una revista.',
      } as L3,
    },
    {
      when: '2026-09-22',
      title: { en: 'Version 0.2.0 (complete rewrite) released', tr: '0.2.0 sürümü (baştan yazılan sürüm) yayımlandı', es: 'Publicada la versión 0.2.0 (reescritura completa)' } as T3,
      text: {
        en: 'Feedback only when the student asks, research data recorded during use in Supabase, and a real-time dashboard. Live on the Marketplace.',
        tr: 'Geri bildirim yalnızca öğrenci istediğinde verilir. Kullanım sırasında araştırma verisi Supabase’e kaydedilir ve anlık bir panelde gösterilir. Marketplace’te yayında.',
        es: 'Explicaciones solo cuando el estudiante las pide, datos de investigación recogidos durante el uso en Supabase y un panel en tiempo real. Disponible en el Marketplace.',
      } as L3,
    },
  ],
  // Not shown on the site until the manuscript is accepted.
  hidden: {
    manuscriptAuthors: 'E. Çoban, R. Hijón-Neira, R. Gallardo Cava',
  },
}

/** The ethics page stays out of the published build until this is true
 * (withdrawal and consent enforcement are being fixed in the code first). */
export const ethicsPagePublished = false
