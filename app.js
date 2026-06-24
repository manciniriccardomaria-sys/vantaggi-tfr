const RATES = {
  tfrFlow: 0.0691,
  extraDeduction: 0.06,
  iresIrap: 0.279,
  compensative: 0.002 + 0.0028,
  baseRevaluation: 0.015,
  inflationShare: 0.75,
};

const DEFAULTS = {
  employees: "",
  salary: "",
  inflation: "2,40",
  balanceFund: "0",
};

const euroNumber = new Intl.NumberFormat("it-IT", {
  useGrouping: true,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percent = new Intl.NumberFormat("it-IT", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const decimal = new Intl.NumberFormat("it-IT", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const fields = {
  employees: document.querySelector("#employees"),
  salary: document.querySelector("#salary"),
  inflation: document.querySelector("#inflation"),
  balanceFund: document.querySelector("#balanceFund"),
};

const out = {
  summaryTotal: document.querySelector("#summaryTotal"),
  summaryPercent: document.querySelector("#summaryPercent"),
  summaryMatured: document.querySelector("#summaryMatured"),
  summaryGrand: document.querySelector("#summaryGrand"),
  revaluationRate: document.querySelector("#revaluationRate"),
  flowBadge: document.querySelector("#flowBadge"),
  payroll: document.querySelector("#payroll"),
  tfrFlow: document.querySelector("#tfrFlow"),
  extraDeduction: document.querySelector("#extraDeduction"),
  compensative: document.querySelector("#compensative"),
  taxContributionTotal: document.querySelector("#taxContributionTotal"),
  missedRevaluation: document.querySelector("#missedRevaluation"),
  totalSavings: document.querySelector("#totalSavings"),
  savingsPercent: document.querySelector("#savingsPercent"),
  maturedRevaluation: document.querySelector("#maturedRevaluation"),
  maturedTotal: document.querySelector("#maturedTotal"),
  barFiscal: document.querySelector("#barFiscal"),
  barRevaluation: document.querySelector("#barRevaluation"),
  barMatured: document.querySelector("#barMatured"),
  barFiscalValue: document.querySelector("#barFiscalValue"),
  barRevaluationValue: document.querySelector("#barRevaluationValue"),
  barMaturedValue: document.querySelector("#barMaturedValue"),
};

function parseLocaleNumber(value, mode = "decimal") {
  const cleaned = String(value ?? "")
    .trim()
    .replace(/[^\d,.\-]/g, "");

  if (!cleaned || cleaned === "-") return 0;

  const comma = cleaned.lastIndexOf(",");
  const dot = cleaned.lastIndexOf(".");
  let normalized = cleaned;

  if (comma > -1 && dot > -1) {
    const decimalSeparator = comma > dot ? "," : ".";
    const thousandSeparator = decimalSeparator === "," ? "." : ",";
    normalized = cleaned
      .replace(new RegExp(`\\${thousandSeparator}`, "g"), "")
      .replace(decimalSeparator, ".");
  } else if (comma > -1) {
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  } else {
    const dotCount = (cleaned.match(/\./g) || []).length;
    const groupedThousands = /^\d{1,3}(\.\d{3})+$/.test(cleaned);

    if (dotCount > 1 || (mode !== "percent" && groupedThousands)) {
      normalized = cleaned.replace(/\./g, "");
    }
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clampPositive(value) {
  return Math.max(0, value);
}

function formatEuro(value) {
  return `€ ${euroNumber.format(value)}`;
}

function calculate() {
  const employees = clampPositive(parseLocaleNumber(fields.employees.value));
  const salary = clampPositive(parseLocaleNumber(fields.salary.value));
  const inflationRate = clampPositive(parseLocaleNumber(fields.inflation.value, "percent")) / 100;
  const balanceFund = clampPositive(parseLocaleNumber(fields.balanceFund.value));

  const payroll = employees * salary;
  const tfrFlow = payroll * RATES.tfrFlow;
  const extraDeduction = tfrFlow * RATES.extraDeduction * RATES.iresIrap;
  const compensative = payroll * RATES.compensative;
  const taxContributionTotal = extraDeduction + compensative;
  const revaluationRate = RATES.baseRevaluation + RATES.inflationShare * inflationRate;
  const missedRevaluation = tfrFlow * revaluationRate;
  const totalSavings = taxContributionTotal + missedRevaluation;
  const savingsPercent = tfrFlow > 0 ? totalSavings / tfrFlow : 0;
  const maturedRevaluation = balanceFund * revaluationRate;
  const maturedTotal = maturedRevaluation;
  const grandTotal = totalSavings + maturedTotal;

  render({
    payroll,
    tfrFlow,
    extraDeduction,
    compensative,
    taxContributionTotal,
    revaluationRate,
    missedRevaluation,
    totalSavings,
    savingsPercent,
    maturedRevaluation,
    maturedTotal,
    grandTotal,
  });
}

function render(values) {
  out.summaryTotal.textContent = formatEuro(values.totalSavings);
  out.summaryPercent.textContent = percent.format(values.savingsPercent);
  out.summaryMatured.textContent = formatEuro(values.maturedTotal);
  out.summaryGrand.textContent = formatEuro(values.grandTotal);
  out.revaluationRate.textContent = percent.format(values.revaluationRate);
  out.flowBadge.textContent = `Flusso TFR: ${formatEuro(values.tfrFlow)}`;

  out.payroll.textContent = formatEuro(values.payroll);
  out.tfrFlow.textContent = formatEuro(values.tfrFlow);
  out.extraDeduction.textContent = formatEuro(values.extraDeduction);
  out.compensative.textContent = formatEuro(values.compensative);
  out.taxContributionTotal.textContent = formatEuro(values.taxContributionTotal);
  out.missedRevaluation.textContent = formatEuro(values.missedRevaluation);
  out.totalSavings.textContent = formatEuro(values.totalSavings);
  out.savingsPercent.textContent = percent.format(values.savingsPercent);
  out.maturedRevaluation.textContent = formatEuro(values.maturedRevaluation);
  out.maturedTotal.textContent = formatEuro(values.maturedTotal);

  out.barFiscalValue.textContent = formatEuro(values.taxContributionTotal);
  out.barRevaluationValue.textContent = formatEuro(values.missedRevaluation);
  out.barMaturedValue.textContent = formatEuro(values.maturedTotal);

  const largest = Math.max(values.taxContributionTotal, values.missedRevaluation, values.maturedTotal, 1);
  out.barFiscal.style.width = `${Math.max(2, (values.taxContributionTotal / largest) * 100)}%`;
  out.barRevaluation.style.width = `${Math.max(2, (values.missedRevaluation / largest) * 100)}%`;
  out.barMatured.style.width = `${Math.max(2, (values.maturedTotal / largest) * 100)}%`;
}

function formatInputsOnBlur(event) {
  const input = event.currentTarget;
  if (!input.value.trim()) return;

  const mode = input.id === "inflation" ? "percent" : "decimal";
  const value = clampPositive(parseLocaleNumber(input.value, mode));

  if (input.id === "employees") {
    input.value = decimal.format(Math.round(value));
    return;
  }

  if (input.id === "inflation") {
    input.value = decimal.format(value);
    return;
  }

  input.value = decimal.format(value);
}

Object.values(fields).forEach((field) => {
  field.addEventListener("input", calculate);
  field.addEventListener("blur", formatInputsOnBlur);
});

document.querySelector("#resetButton").addEventListener("click", () => {
  Object.entries(DEFAULTS).forEach(([name, value]) => {
    fields[name].value = value;
  });
  calculate();
});

document.querySelector("#printButton").addEventListener("click", () => {
  window.print();
});

calculate();
