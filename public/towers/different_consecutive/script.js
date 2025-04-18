const t = [0, 2, 1];
const possibleColors = ['red', 'green', 'blue', 'gold', 'purple', 'orange', 'pink', 'turquoise', 'gray'];
let colors = ['red', 'green', 'blue'];
let codes = [];
let n = colors.length;
let m = 3;

let towerDiv = null;
let colorsDiv = null;
let tabsDiv = null;
let arrayDiv = null;
let codeDiv = null;
let variablesDiv = null;
let arrayElems = null;
let answersDiv = null;

let returnVal = null;

function writeAnswer(k) {
  let answer = '';
  for (let i = 0; i <= k; i++) {
    answer = `${answer} ${t[i]}`;
  }

  const answerDiv = document.createElement('div');
  answerDiv.textContent = answer;

  answersDiv.appendChild(answerDiv);
}

function createLineOfCode(line, activated) {
  const lineDiv = document.createElement('div');
  if (activated) {
    lineDiv.classList.add('activated');
  }
  let i = 0;
  while (line[i] === '\t') {
    const tab = document.createElement('span');
    tab.classList.add('tab');
    tab.textContent = '..';
    lineDiv.appendChild(tab);
    i++;
  }
  const text = document.createElement('span');
  text.textContent = line;
  lineDiv.appendChild(text);

  return lineDiv;
}

function showCode(code) {
  codeDiv.textContent = '';
  for (let i = 0; i < code.lines.length; i++) {
    codeDiv.appendChild(createLineOfCode(code.lines[i], i === code.activeLine));
  }
}

function createVariableDiv(id, name, value) {
  const arrayElem = document.createElement('div');
  arrayElem.classList.add('elem');
  arrayElem.id = id;
  arrayElem.classList.add('inactive');

  const indexElem = document.createElement('div');
  indexElem.classList.add('index');
  indexElem.textContent = name;

  arrayElem.appendChild(indexElem);

  const valueElem = document.createElement('div');
  valueElem.classList.add('value');
  valueElem.textContent = value;

  arrayElem.appendChild(valueElem);

  return arrayElem;
}

function redrawVariables(i) {
  variablesDiv.textContent = '';
  Object.keys(codes[i].variables).forEach((key) => {
    const div = createVariableDiv(`v_${key}`, key, codes[i].variables[key]);
    div.classList.remove('inactive');
    variablesDiv.appendChild(div);
  });
}

function showTab(i) {
  if (i >= codes.length) {
    window.alert('The required tab is not open');
    return;
  }
  if (i === -1) {
    window.alert('The program has terminated');
    return;
  }

  const tabs = document.getElementsByClassName('tab');

  for (let j = 0; j < tabs.length; j++) {
    tabs[j].classList.remove('selected');
  }

  tabs[i].classList.add('selected');

  showCode(codes[i]);
  redrawVariables(i);
}

function closeLastTab() {
  showTab(codes.length - 1);

  codes.pop();
}

function redrawTower(k, guess) {
  towerDiv.textContent = '';
  if (!guess) {
    const block = document.createElement('div');
    towerDiv.appendChild(block);
  }
  for (let i = m; i > k; i--) {
    const block = document.createElement('div');
    block.style.visibility = 'hidden';
    block.classList.add('block');
    block.textContent = t[i];
    towerDiv.appendChild(block);
  }
  for (let i = k; i >= 0; i--) {
    const block = document.createElement('div');
    if (i === k && guess) {
      block.style.border = `3px dashed ${colors[t[i]]}`;
    } else {
      block.style['background-color'] = colors[t[i]];
    }
    block.classList.add('block');
    block.textContent = t[i];
    towerDiv.appendChild(block);
  }
}

function redrawArrayElements(k) {
  for (let i = 0; i <= k; i++) {
    console.log(arrayElems);
    arrayElems[i].classList.remove('inactive');
    arrayElems[i].lastChild.textContent = t[i];
  }
  for (let i = k + 1; i < m; i++) {
    arrayElems[i].classList.add('inactive');
  }
}

class Code {
  constructor(k) {
    this.variables = { k };
    this.tabName = `k = ${k}`;
    this.lines = [
      'void backtracking(int t[], int k) {',
      '\tif (k == m) {',
      '\t\t print(t, k);',
      '\t\t return;',
      '\t}',
      '\tfor(int i = 0; i < n; i++) {',
      '\t\t t[k] = i;',
      '\t\tif (ok(t, k)) {',
      '\t\t\t backtrack(t, k + 1);',
      '\t\t}',
      '\t}',
      '}',
    ];
    this.activeLine = 1;
    this.lineActions = [
      () => {
        window.alert('This should have been unreachable.');
      },
      () => {
        if (this.variables.k === m) {
          this.activeLine = 2;
        } else {
          this.activeLine = 5;
        }
      },
      () => {
        writeAnswer(this.variables.k - 1);
        this.activeLine++;
      },
      () => {
        closeLastTab();
        this.activeLine++;
      },
      () => {
        window.alert('This should have been unreachable.');
      },
      () => {
        if (typeof this.variables.i === 'undefined') {
          this.variables.i = 0;
          this.activeLine++;
        } else {
          this.variables.i += 1;
          if (this.variables.i === n) {
            this.activeLine = 11;
          } else {
            this.activeLine++;
          }
        }
      },
      () => {
        t[this.variables.k] = this.variables.i;
        redrawTower(this.variables.k, true);
        redrawArrayElements(this.variables.k);
        this.activeLine++;
      },
      () => {
        // Jo meghivasa
        if (returnVal === null) {
          const newCode = new Code();
          newCode.ok(this.variables.k);
          codes.push(newCode);
        } else if (returnVal) {
          this.activeLine++;
          returnVal = null;
        } else {
          this.activeLine += 2;
          returnVal = null;
        }
      },
      () => {
        codes.push(new Code(this.variables.k + 1));
        redrawTower(this.variables.k, false);
        this.activeLine++;
      },
      () => {
        // If vége
        redrawTower(this.variables.k, true);
        this.activeLine++;
      },
      () => {
        // For vége
        this.activeLine = 5;
      },
      () => {
        // Függvény vége
        closeLastTab();
      },
    ];
  }

  ok(k) {
    this.variables = { k };
    this.tabName = `ok(t, ${k})`;
    this.lines = [
      'bool ok(int t[], int k) {',
      '\tif (k == 0) {',
      '\t\t return true;',
      '\t}',
      '\tif (t[k-1] == t[k]) {',
      '\t\t return false;',
      '\t}',
      '\treturn true;',
      '}',
    ];
    this.activeLine = 1;
    this.lineActions = [
      () => {
        window.alert('This should have been unreachable.');
      },
      () => {
        if (this.variables.k === 0) {
          this.activeLine++;
        } else {
          this.activeLine += 3;
        }
      },
      () => {
        returnVal = true;
        closeLastTab();
        this.activeLine++;
      },
      () => {
        window.alert('This should have been unreachable.');
      },
      () => {
        if (t[this.variables.k] === t[this.variables.k - 1]) {
          this.activeLine++;
        } else {
          this.activeLine += 3;
        }
      },
      () => {
        returnVal = false;
        closeLastTab();
        this.activeLine++;
      },
      () => {
        window.alert('This should have been unreachable.');
      },
      () => {
        returnVal = true;
        closeLastTab();
        this.activeLine++;
      },
      () => {
        // Függvény vége
        window.alert('This should have been unreachable.');
      },
    ];
  }
}

function createColorDiv(color, content) {
  const block = document.createElement('div');
  block.style['background-color'] = color;
  block.textContent = content;

  return block;
}

function prepareColorsDiv() {
  colorsDiv.textContent = '';

  colorsDiv.appendChild(createColorDiv('none', 'Colors: '));

  for (let i = 0; i < colors.length; i++) {
    colorsDiv.appendChild(createColorDiv(colors[i], i));
  }
}

function prepareArrayDiv() {
  arrayDiv.textContent = '';
  for (let i = 0; i < m; i++) {
    arrayDiv.appendChild(createVariableDiv(`t_${i}`, `t[${i}]`, -1));
  }
}

function prepare() {
  prepareColorsDiv();
  prepareArrayDiv();
}

function redrawTabs() {
  tabsDiv.textContent = '';

  for (let i = 0; i < codes.length; i++) {
    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.textContent = codes[i].tabName;
    tab.addEventListener('click', () => {
      showTab(i);
    });

    tabsDiv.appendChild(tab);
  }
}

function nextStep() {
  codes[codes.length - 1].lineActions[codes[codes.length - 1].activeLine]();
  console.log(codes);
  redrawTabs();
  showTab(codes.length - 1);
}

function startGame() {
  const newN = parseInt(document.getElementById('input_n').value, 10);

  if (newN >= possibleColors.length || newN < 1) {
    window.alert(`N must be between 1 and ${possibleColors.length - 1} (inclusive)`);
    return;
  }

  n = newN;
  colors = possibleColors.slice(0, n);

  const newM = parseInt(document.getElementById('input_m').value, 10);

  if (newM < 1) {
    window.alert(`M must at least 1`);
    return;
  }
  if (newM > 5) {
    window.alert('For large values of M the layout may break');
  }

  m = newM;

  codes = [];
  answersDiv.textContent = '';

  prepare();
  document.getElementById('startButton').textContent = 'Restart';

  arrayElems = Array.from(document.getElementById('result_array').getElementsByClassName('elem'));

  const c = new Code(0);
  codes.push(c);
  redrawTabs();
  showTab(0);
  redrawTower(-1, false);
}

let intervalId = null;

function startAuto() {
  const val = parseInt(document.getElementById('input_time').value, 10);
  intervalId = setInterval(nextStep, val);
}

function stopAuto() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  towerDiv = document.getElementById('tower');
  colorsDiv = document.getElementById('possible_colors');
  tabsDiv = document.getElementById('tabs');
  arrayDiv = document.getElementById('result_array');
  answersDiv = document.getElementById('answers');
  codeDiv = document.getElementById('function');
  variablesDiv = document.getElementById('variables');

  startGame();

  document.getElementById('startButton').addEventListener('click', startGame);
  document.getElementById('nextButton').addEventListener('click', nextStep);
  document.getElementById('startAutoButton').addEventListener('click', startAuto);
  document.getElementById('stopAutoButton').addEventListener('click', stopAuto);
});
