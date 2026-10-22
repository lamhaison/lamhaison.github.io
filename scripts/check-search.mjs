import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { filterQuestions } from '../assets/score.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(
  readFileSync(resolve(root, 'data/questions.json'), 'utf8')
);
const questions = data.questions;

function top(query) {
  const hits = filterQuestions(questions, { query });
  return hits[0]?.id || '';
}

const expected = [
  ['on call', 'who-is-on-call-today'],
  ['24x7', 'power-management-exemption'],
  ['python', 'install-software-on-a-vm'],
  ['ctr', 'transfer-ctr-to-cms'],
  ['3-5', 'sla-means-completion'],
  ['myid', 'cloud-patch-baseline-hygiene-access'],
  ['cloudpatchbaselinehygiene', 'cloud-patch-baseline-hygiene-access'],
  ['powertag', 'powertag-24x7-vm-off-exemption-expired'],
  ['checkexemption', 'powertag-24x7-vm-off-exemption-expired'],
  ['break-fix', 'incident-vs-servicenow-request'],
];

let failed = 0;

for (const [query, id] of expected) {
  const actual = top(query);

  if (actual !== id) {
    console.error(
      `FAIL ${JSON.stringify(query)} -> ${actual}, expected ${id}`
    );
    failed += 1;
  } else {
    console.log(`ok ${JSON.stringify(query)} -> ${id}`);
  }
}

const splunk = filterQuestions(
  questions,
  { query: 'splunk' }
)
  .slice(0, 3)
  .map((q) => q.id);

if (
  !splunk.includes('monitoring-options') ||
  !splunk.includes('cloud-patch-baseline-hygiene-access')
) {
  console.error(`FAIL splunk ranking: ${splunk.join(', ')}`);
  failed += 1;
} else {
  console.log(`ok splunk hits ${splunk.join(', ')}`);
}

const onCall = filterQuestions(
  questions,
  { query: 'on call' }
).map((q) => q.id);

if (
  !onCall[0] ||
  onCall[0] !== 'who-is-on-call-today' ||
  onCall.includes('windows-patching-scope')
) {
  console.error(`FAIL on call ranking: ${onCall.join(', ')}`);
  failed += 1;
} else {
  console.log(`ok on call hits ${onCall.join(', ')}`);
}

if (
  filterQuestions(questions, { query: 'zzzz-no-such' }).length !== 0
) {
  console.error('FAIL nonsense query returned hits');
  failed += 1;
}

const monitoring = questions.find(
  (q) => q.id === 'monitoring-options'
);

if (!monitoring?.answerHtml.includes('<table')) {
  console.error('FAIL monitoring answer is missing a table');
  failed += 1;
}

const what = questions.find(
  (q) => q.id === 'what-is-cms'
);

if (
  !what ||
  what.answerHtml.includes('<Accordion') ||
  what.answerHtml.includes('Callout')
) {
  console.error('FAIL what-is-cms still contains MDX tags');
  failed += 1;
}

for (const question of questions) {
  const linked =
    question.answerHtml.includes(`#${question.id}`) ||
    question.pageUrl.startsWith('http');

  if (
    !question.question ||
    !question.searchLine.startsWith('[') ||
    !linked
  ) {
    console.error(`FAIL incomplete record ${question.id}`);
    failed += 1;
  }

  if (question.answerHtml.includes('<script')) {
    console.error(`FAIL script in ${question.id}`);
    failed += 1;
  }
}