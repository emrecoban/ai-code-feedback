<script setup lang="ts">
// The files in src/public/downloads, listed from downloads.json (written by
// scripts/codebook.mjs). Every data file is synthetic.
import { withBase } from 'vitepress'
import downloads from '../../data/downloads.json'
import type { T3 } from '../../data/terms'
import { useLang } from '../composables'

const { l, tr, num } = useLang()
const t = (en: string, trk: string, es: string): T3 => ({ en, tr: trk, es })
const CONTENTS: Record<string, T3> = {
  'codebook.csv': t('Codebook: every data item, with labels in three languages, values and source', 'Kod kitabı: her veri öğesi, üç dilde etiketler, değerler ve kaynak', 'Libro de códigos: cada dato, con etiquetas en tres idiomas, valores y origen'),
  'codebook.xlsx': t('The same codebook, plus a sheet for the variables of the wide file', 'Aynı kod kitabı, ayrıca geniş dosyanın değişkenleri için bir sayfa', 'El mismo libro de códigos, con una hoja para las variables del archivo ancho'),
  'synthetic_events_long.csv': t('Long format: one row per research event', 'Uzun biçim: her araştırma olayı için bir satır', 'Formato largo: una fila por evento de investigación'),
  'synthetic_questions_long.csv': t('Long format: one row per question, without stored text', 'Uzun biçim: her soru için bir satır, saklanan metin olmadan', 'Formato largo: una fila por pregunta, sin texto guardado'),
  'synthetic_students_wide.csv': t('Wide format: one row per student, with test and TAM scores', 'Geniş biçim: her öğrenci için bir satır, test ve TAM puanlarıyla', 'Formato ancho: una fila por estudiante, con puntuaciones del test y del TAM'),
  'synthetic_labels_en.sps': t('SPSS syntax, labels in English', 'SPSS sözdizimi, İngilizce etiketler', 'Sintaxis de SPSS, etiquetas en inglés'),
  'synthetic_labels_tr.sps': t('SPSS syntax, labels in Turkish', 'SPSS sözdizimi, Türkçe etiketler', 'Sintaxis de SPSS, etiquetas en turco'),
  'synthetic_labels_es.sps': t('SPSS syntax, labels in Spanish', 'SPSS sözdizimi, İspanyolca etiketler', 'Sintaxis de SPSS, etiquetas en español'),
  'README.txt': t('Short description of the files', 'Dosyaların kısa açıklaması', 'Descripción breve de los archivos'),
}
const size = (bytes: number) => `${num(bytes / 1024, bytes < 10240 ? 1 : 0)} KB`
</script>

<template>
  <div class="downloads">
    <table>
      <thead>
        <tr><th>{{ tr('file') }}</th><th>{{ tr('contents') }}</th><th>{{ tr('rows') }}</th><th>{{ tr('size') }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="f in downloads.files" :key="f.file">
          <td><a :href="withBase(`/downloads/${f.file}`)" download>{{ f.file }}</a></td>
          <td>{{ CONTENTS[f.file]?.[l] }}</td>
          <td>{{ 'rows' in f ? num(f.rows as number) : '–' }}</td>
          <td>{{ size(f.bytes) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.downloads {
  overflow-x: auto;
}
.downloads table {
  font-size: 13px;
}
</style>
