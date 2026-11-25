"use strict";

// =============================================================================
//  Gerador de senhas. Usa window.crypto (CSPRNG) em vez de Math.random(),
//  que não é seguro para senhas.
// =============================================================================

const CHARSETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%&*()_-+=[]{}:;.,<>/?",
};

// Caracteres fáceis de confundir
const AMBIGUOUS = new Set("il1Lo0O|`'\"".split(""));

const $ = (id) => document.getElementById(id);

const els = {
  current: $("current"),
  copy: $("copy"),
  length: $("length"),
  lengthValue: $("length-value"),
  generate: $("generate"),
  download: $("download"),
  clear: $("clear"),
  list: $("list"),
  empty: $("empty"),
  strengthFill: $("strength-fill"),
  strengthLabel: $("strength-label"),
  toast: $("toast"),
  requireEach: $("require_each"),
  avoidAmbiguous: $("avoid_ambiguous"),
};

const history = [];

/** Inteiro aleatório uniforme em [0, max) sem viés de módulo, via CSPRNG. */
function randomInt(max) {
  const limit = Math.floor(0xffffffff / max) * max;
  const buf = new Uint32Array(1);
  let value;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % max;
}

function pick(chars) {
  return chars[randomInt(chars.length)];
}

/** Embaralhamento de Fisher–Yates usando o CSPRNG. */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function selectedSets() {
  const names = ["lowercase", "uppercase", "numbers", "symbols"];
  const sets = [];
  for (const name of names) {
    if (!$(name).checked) continue;
    let chars = CHARSETS[name];
    if (els.avoidAmbiguous.checked) {
      chars = [...chars].filter((c) => !AMBIGUOUS.has(c)).join("");
    }
    if (chars.length) sets.push(chars);
  }
  return sets;
}

function generatePassword() {
  const length = Number(els.length.value);
  const sets = selectedSets();
  if (sets.length === 0) {
    toast("Selecione pelo menos um tipo de caractere.");
    return null;
  }

  const requireEach = els.requireEach.checked;
  if (requireEach && sets.length > length) {
    toast("Tamanho pequeno demais para incluir um de cada tipo.");
    return null;
  }

  const pool = sets.join("");
  const chars = [];

  // Garante pelo menos um de cada conjunto marcado
  if (requireEach) {
    for (const set of sets) chars.push(pick(set));
  }
  while (chars.length < length) chars.push(pick(pool));

  return shuffle(chars).join("");
}

// Estimativa de entropia: log2(tamanho do alfabeto) * comprimento
function estimateStrength(password) {
  const sets = selectedSets();
  const poolSize = sets.reduce((sum, s) => sum + s.length, 0) || 1;
  const bits = password.length * Math.log2(poolSize);
  let label, level;
  if (bits < 40) [label, level] = ["Fraca", 1];
  else if (bits < 60) [label, level] = ["Razoável", 2];
  else if (bits < 80) [label, level] = ["Forte", 3];
  else [label, level] = ["Muito forte", 4];
  return { bits: Math.round(bits), label, level };
}

function renderStrength(password) {
  const { bits, label, level } = estimateStrength(password);
  els.strengthFill.className = `level-${level}`;
  els.strengthFill.style.width = `${Math.min(100, (level / 4) * 100)}%`;
  els.strengthLabel.textContent = `${label} · ~${bits} bits`;
}

let toastTimer;
function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast("Copiado!");
  } catch {
    toast("Não foi possível copiar.");
  }
}

function renderHistory() {
  els.empty.style.display = history.length ? "none" : "block";
  els.list.innerHTML = "";
  history.forEach((pass, index) => {
    const li = document.createElement("li");
    li.className = "list-item";

    const code = document.createElement("code");
    code.textContent = pass;

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "icon-btn";
    copyBtn.title = "Copiar";
    copyBtn.setAttribute("aria-label", "Copiar senha");
    copyBtn.textContent = "⧉";
    copyBtn.addEventListener("click", () => copyText(pass));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "icon-btn";
    delBtn.title = "Remover";
    delBtn.setAttribute("aria-label", "Remover senha");
    delBtn.textContent = "✕";
    delBtn.addEventListener("click", () => {
      history.splice(index, 1);
      renderHistory();
    });

    li.append(code, copyBtn, delBtn);
    els.list.appendChild(li);
  });
}

function onGenerate() {
  const password = generatePassword();
  if (!password) return;
  els.current.textContent = password;
  renderStrength(password);
  history.unshift(password);
  renderHistory();
}

function onDownload() {
  if (history.length === 0) {
    toast("Nada para baixar.");
    return;
  }
  const blob = new Blob([history.join("\n") + "\n"], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "passwords.txt";
  a.click();
  URL.revokeObjectURL(url);
}

// Eventos
els.generate.addEventListener("click", onGenerate);
els.download.addEventListener("click", onDownload);
els.clear.addEventListener("click", () => {
  history.length = 0;
  renderHistory();
});
els.copy.addEventListener("click", () => {
  const text = els.current.textContent;
  if (text && text !== "Clique em Gerar") copyText(text);
});
els.length.addEventListener("input", () => {
  els.lengthValue.textContent = els.length.value;
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.tagName !== "BUTTON") onGenerate();
});

renderHistory();
