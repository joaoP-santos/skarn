import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { ref, computed, nextTick } from 'vue';
import { translate } from '../utils/translations.js';

function game(file, locale, exposed) {
  const source = readFileSync(new URL(`../pages/math/${file}.vue`, import.meta.url), 'utf8')
    .split('<script setup>')[1].split('</script>')[0].replace(/^import .*;$/gm, '');
  return vm.runInNewContext(`${source}\n({ ${exposed} })`, {
    ref, computed, onMounted: () => {}, definePageMeta: () => {}, useHead: () => {},
    useLanguage: () => ({ t: (message, values) => translate(locale, message, values) }),
    requestAnimationFrame: () => {},
  });
}

test('English is the default; Portuguese and numeric placeholders are preserved', () => {
  assert.equal(translate(undefined, 'Frações'), 'Fractions');
  assert.equal(translate('pt', 'Frações'), 'Frações');
  assert.equal(translate('en', 'Pontuação: {0}', [0]), 'Score: 0');
  assert.equal(translate('pt', 'Pontuação: {0}', [12]), 'Pontuação: 12');
  assert.equal(translate('en', 'Depth-first search'), 'Depth-first search');
});

test('language preference defaults to English and persists before reloading', async () => {
  const source = readFileSync(new URL('../composables/useLanguage.js', import.meta.url), 'utf8')
    .replace(/^import .*;$/gm, '').replace('export function', 'function');
  let preference; let options; let reloads = 0;
  const useLanguage = vm.runInNewContext(`${source}\nuseLanguage`, {
    translate, computed, nextTick,
    useCookie: (name, config) => {
      assert.equal(name, 'skarn-language'); options = config;
      return preference ||= ref(config.default());
    },
    window: { location: { reload: () => { assert.equal(preference.value, 'pt'); reloads++; } } },
  });
  const language = useLanguage();
  assert.equal(language.locale.value, 'en');
  assert.equal(options.path, '/');
  await language.setLanguage('xx');
  assert.equal(reloads, 0);
  await language.setLanguage('pt');
  assert.equal(reloads, 1);
  assert.equal(useLanguage().locale.value, 'pt');
  assert.equal(useLanguage().t('Frações'), 'Frações');
});

for (const locale of ['en', 'pt']) {
  test(`multiplication feedback and next-round controls work in ${locale}`, () => {
    const g = game('multi-table', locale, 'answer, buttonMessage, buttonPress, getResult: () => displayResult');
    g.answer.value = '1'; g.buttonPress();
    assert.equal(g.getResult(), translate(locale, 'Não é bem isso!'));
    g.answer.value = '0'; g.buttonPress();
    assert.equal(g.getResult(), translate(locale, 'Isso aí!'));
    assert.equal(g.buttonMessage.value, translate(locale, 'Próximo'));
    g.buttonPress();
    assert.equal(g.buttonMessage.value, translate(locale, 'Verificar'));
    assert.equal(g.answer.value, '');
  });
  test(`number-line success, error and game-over feedback work in ${locale}`, () => {
    const g = game('number-line', locale, 'selectedPoint, targetNumber, submitAnswer, resultMessage, gameState, lives, score');
    g.targetNumber.value = 2.5; g.selectedPoint.value = 2.5; g.submitAnswer();
    assert.equal(g.resultMessage.value, translate(locale, 'Correto!'));
    assert.equal(g.score.value, 1);
    g.gameState.value = 'waiting'; g.selectedPoint.value = 3; g.submitAnswer();
    assert.equal(g.resultMessage.value, translate(locale, 'Incorreto! O número correto era {0}', [2.5]));
    g.gameState.value = 'waiting'; g.lives.value = 1; g.submitAnswer();
    assert.equal(g.resultMessage.value, translate(locale, 'Game Over! Sua pontuação final: {0}', [1]));
    assert.equal(g.lives.value, 3);
  });
}
