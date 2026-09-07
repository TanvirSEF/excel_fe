export interface ParsedDataSet {
  values: number[]
  invalid: string[]
}

export function parseDataSet(raw: string): ParsedDataSet {
  const tokens = raw.split(/[\s,;]+/).filter(Boolean)
  const values: number[] = []
  const invalid: string[] = []
  for (const token of tokens) {
    const value = Number(token)
    if (Number.isFinite(value)) values.push(value)
    else invalid.push(token)
  }
  return { values, invalid }
}

export function sum(xs: number[]): number {
  return xs.reduce((total, x) => total + x, 0)
}

export function mean(xs: number[]): number {
  return sum(xs) / xs.length
}

export function variance(xs: number[], sample: boolean): number {
  const m = mean(xs)
  const ss = sum(xs.map((x) => (x - m) ** 2))
  return ss / (xs.length - (sample ? 1 : 0))
}

export function sd(xs: number[], sample: boolean): number {
  return Math.sqrt(variance(xs, sample))
}

export function geometricMean(xs: number[]): number | null {
  if (xs.length === 0 || xs.some((x) => x <= 0)) return null
  const logMean = mean(xs.map((x) => Math.log(x)))
  const result = Math.exp(logMean)
  return Number.isFinite(result) ? result : null
}

export function harmonicMean(xs: number[]): number | null {
  if (xs.length === 0 || xs.some((x) => x <= 0)) return null
  const reciprocalSum = sum(xs.map((x) => 1 / x))
  if (reciprocalSum === 0) return null
  return xs.length / reciprocalSum
}

export function weightedMean(pairs: { value: number; weight: number }[]): number | null {
  const weightSum = sum(pairs.map((p) => p.weight))
  if (weightSum === 0) return null
  return sum(pairs.map((p) => p.value * p.weight)) / weightSum
}

export interface VariationResult {
  mean: number
  sd: number
  variance: number
  cvPercent: number
}

export function coefficientOfVariation(xs: number[], sample: boolean): VariationResult | null {
  const m = mean(xs)
  if (m === 0) return null
  const v = variance(xs, sample)
  const s = Math.sqrt(v)
  return { mean: m, sd: s, variance: v, cvPercent: (s / Math.abs(m)) * 100 }
}

export interface PooledVarianceResult {
  n1: number
  n2: number
  v1: number
  v2: number
  pooled: number
  pooledSd: number
}

export function pooledVariance(a: number[], b: number[]): PooledVarianceResult | null {
  if (a.length < 2 || b.length < 2) return null
  const v1 = variance(a, true)
  const v2 = variance(b, true)
  const pooled =
    ((a.length - 1) * v1 + (b.length - 1) * v2) / (a.length + b.length - 2)
  return { n1: a.length, n2: b.length, v1, v2, pooled, pooledSd: Math.sqrt(pooled) }
}

export interface AnovaGroupStat {
  n: number
  mean: number
  sd: number
}

export interface OneWayAnovaResult {
  groupStats: AnovaGroupStat[]
  grandMean: number
  ssBetween: number
  ssWithin: number
  dfBetween: number
  dfWithin: number
  msBetween: number
  msWithin: number
  f: number
  p: number
}

export function oneWayAnova(groups: number[][]): OneWayAnovaResult | null {
  const valid = groups.filter((g) => g.length >= 2)
  if (valid.length < 2) return null
  const groupStats = valid.map((g) => ({ n: g.length, mean: mean(g), sd: sd(g, true) }))
  const all = valid.flat()
  const grand = mean(all)
  const ssBetween = sum(valid.map((g) => g.length * (mean(g) - grand) ** 2))
  const ssWithin = sum(valid.map((g) => sum(g.map((x) => (x - mean(g)) ** 2))))
  const dfBetween = valid.length - 1
  const dfWithin = all.length - valid.length
  const msBetween = ssBetween / dfBetween
  const msWithin = ssWithin / dfWithin
  const f = msBetween / msWithin
  return {
    groupStats,
    grandMean: grand,
    ssBetween,
    ssWithin,
    dfBetween,
    dfWithin,
    msBetween,
    msWithin,
    f,
    p: fUpperTail(f, dfBetween, dfWithin),
  }
}

export interface TwoWayAnovaResult {
  rowMeans: number[]
  colMeans: number[]
  grandMean: number
  ssRows: number
  ssCols: number
  ssError: number
  dfRows: number
  dfCols: number
  dfError: number
  msRows: number
  msCols: number
  msError: number
  fRows: number
  fCols: number
  pRows: number
  pCols: number
}

export interface TwoWayAnovaReplicatedResult extends TwoWayAnovaResult {
  ssInteraction: number
  dfInteraction: number
  msInteraction: number
  fInteraction: number
  pInteraction: number
}

export function twoWayAnova(matrix: number[][]): TwoWayAnovaResult | null {
  const rows = matrix.length
  const cols = matrix[0]?.length ?? 0
  if (rows < 2 || cols < 2) return null
  const all = matrix.flat()
  const grand = mean(all)
  const rowMeans = matrix.map((row) => mean(row))
  const colMeans = Array.from({ length: cols }, (_, j) =>
    mean(matrix.map((row) => row[j]))
  )
  const ssRows = cols * sum(rowMeans.map((m) => (m - grand) ** 2))
  const ssCols = rows * sum(colMeans.map((m) => (m - grand) ** 2))
  const ssError = sum(
    matrix.flatMap((row, i) =>
      row.map((x, j) => (x - rowMeans[i] - colMeans[j] + grand) ** 2)
    )
  )
  const dfRows = rows - 1
  const dfCols = cols - 1
  const dfError = dfRows * dfCols
  const msRows = ssRows / dfRows
  const msCols = ssCols / dfCols
  const msError = ssError / dfError
  const fRows = msRows / msError
  const fCols = msCols / msError
  return {
    rowMeans,
    colMeans,
    grandMean: grand,
    ssRows,
    ssCols,
    ssError,
    dfRows,
    dfCols,
    dfError,
    msRows,
    msCols,
    msError,
    fRows,
    fCols,
    pRows: fUpperTail(fRows, dfRows, dfError),
    pCols: fUpperTail(fCols, dfCols, dfError),
  }
}

export function twoWayAnovaReplicated(
  cells: number[][][]
): TwoWayAnovaReplicatedResult | null {
  const rows = cells.length
  const cols = cells[0]?.length ?? 0
  const n = cells[0]?.[0]?.length ?? 0
  if (rows < 2 || cols < 2 || n < 2) return null
  if (cells.some((row) => row.some((cell) => cell.length !== n))) return null
  const all = cells.flat(2)
  const grand = mean(all)
  const rowMeans = cells.map((row) => mean(row.flat()))
  const colMeans = Array.from({ length: cols }, (_, j) =>
    mean(cells.map((row) => row[j]).flat())
  )
  const cellMeans = cells.map((row) => row.map(mean))
  const ssRows = cols * n * sum(rowMeans.map((m) => (m - grand) ** 2))
  const ssCols = rows * n * sum(colMeans.map((m) => (m - grand) ** 2))
  const ssInteraction = n * sum(
    cellMeans.flatMap((row, i) =>
      row.map((m, j) => (m - rowMeans[i] - colMeans[j] + grand) ** 2)
    )
  )
  const ssError = sum(
    cells.flatMap((row, i) =>
      row.flatMap((cell, j) => cell.map((x) => (x - cellMeans[i][j]) ** 2))
    )
  )
  const dfRows = rows - 1
  const dfCols = cols - 1
  const dfInteraction = dfRows * dfCols
  const dfError = rows * cols * (n - 1)
  const msRows = ssRows / dfRows
  const msCols = ssCols / dfCols
  const msInteraction = ssInteraction / dfInteraction
  const msError = ssError / dfError
  const base = {
    rowMeans,
    colMeans,
    grandMean: grand,
    ssRows,
    ssCols,
    ssError,
    dfRows,
    dfCols,
    dfError,
    msRows,
    msCols,
    msError,
    fRows: msRows / msError,
    fCols: msCols / msError,
    pRows: fUpperTail(msRows / msError, dfRows, dfError),
    pCols: fUpperTail(msCols / msError, dfCols, dfError),
  }
  const fInteraction = msInteraction / msError
  return {
    ...base,
    ssInteraction,
    dfInteraction,
    msInteraction,
    fInteraction,
    pInteraction: fUpperTail(fInteraction, dfInteraction, dfError),
  }
}

const ERF_P = 0.3275911
const ERF_A = [0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429]

export function erfApprox(x: number): number {
  const sign = x < 0 ? -1 : 1
  const ax = Math.abs(x)
  const t = 1 / (1 + ERF_P * ax)
  const poly =
    ((((ERF_A[4] * t + ERF_A[3]) * t + ERF_A[2]) * t + ERF_A[1]) * t + ERF_A[0]) * t
  const y = 1 - poly * Math.exp(-ax * ax)
  return sign * y
}

export function normalCdf(z: number): number {
  return 0.5 * (1 + erfApprox(z / Math.SQRT2))
}

const ACKLAM_A = [
  -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
  1.38357751867269e2, -3.066479806614716e1, 2.506628277459239e0,
]
const ACKLAM_B = [
  -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
  6.680131188771972e1, -1.328068155288572e1,
]
const ACKLAM_C = [
  -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838e0,
  -2.549732539343734e0, 4.374664141464968e0, 2.938163982698783e0,
]
const ACKLAM_D = [
  7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996e0,
  3.754408661907416e0,
]
const ACKLAM_P_LOW = 0.02425

export function inverseNormalCdf(p: number): number | null {
  if (p <= 0 || p >= 1) return null

  const tailApprox = (q: number) => {
    const numerator =
      ((((((ACKLAM_C[0] * q + ACKLAM_C[1]) * q + ACKLAM_C[2]) * q + ACKLAM_C[3]) * q +
        ACKLAM_C[4]) *
        q +
        ACKLAM_C[5]))
    const denominator =
      ((((ACKLAM_D[0] * q + ACKLAM_D[1]) * q + ACKLAM_D[2]) * q + ACKLAM_D[3]) * q + 1)
    return numerator / denominator
  }

  if (p < ACKLAM_P_LOW) return tailApprox(Math.sqrt(-2 * Math.log(p)))
  if (p > 1 - ACKLAM_P_LOW) return -tailApprox(Math.sqrt(-2 * Math.log(1 - p)))

  const q = p - 0.5
  const r = q * q
  const numerator =
    ((((((ACKLAM_A[0] * r + ACKLAM_A[1]) * r + ACKLAM_A[2]) * r + ACKLAM_A[3]) * r +
      ACKLAM_A[4]) *
      r +
      ACKLAM_A[5]) *
      q)
  const denominator =
    (((((ACKLAM_B[0] * r + ACKLAM_B[1]) * r + ACKLAM_B[2]) * r + ACKLAM_B[3]) * r +
      ACKLAM_B[4]) *
      r +
      1)
  return numerator / denominator
}

const LANCZOS_G = 7
const LANCZOS_COEFFS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028,
  771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
]

export function lnGamma(x: number): number {
  if (x < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - lnGamma(1 - x)
  }
  const z = x - 1
  let a = LANCZOS_COEFFS[0]
  const t = z + LANCZOS_G + 0.5
  for (let i = 1; i < LANCZOS_COEFFS.length; i++) {
    a += LANCZOS_COEFFS[i] / (z + i)
  }
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a)
}

function betacf(a: number, b: number, x: number): number {
  const EPS = 1e-15
  const FPMIN = 1e-300
  const MAXIT = 200
  const qab = a + b
  const qap = a + 1
  const qam = a - 1
  let c = 1
  let d = 1 - (qab * x) / qap
  if (Math.abs(d) < FPMIN) d = FPMIN
  d = 1 / d
  let h = d
  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2))
    d = 1 + aa * d
    if (Math.abs(d) < FPMIN) d = FPMIN
    c = 1 + aa / c
    if (Math.abs(c) < FPMIN) c = FPMIN
    d = 1 / d
    h *= d * c
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2))
    d = 1 + aa * d
    if (Math.abs(d) < FPMIN) d = FPMIN
    c = 1 + aa / c
    if (Math.abs(c) < FPMIN) c = FPMIN
    d = 1 / d
    const del = d * c
    h *= del
    if (Math.abs(del - 1) < EPS) break
  }
  return h
}

export function regularizedIncompleteBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const bt = Math.exp(
    lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x)
  )
  if (x < (a + 1) / (a + b + 2)) return (bt * betacf(a, b, x)) / a
  return 1 - (bt * betacf(b, a, 1 - x)) / b
}

export function fUpperTail(f: number, d1: number, d2: number): number {
  if (f <= 0) return 1
  const x = d2 / (d2 + d1 * f)
  return regularizedIncompleteBeta(x, d2 / 2, d1 / 2)
}

export function pValueFromZ(z: number, twoTailed: boolean): number {
  const tail = 0.5 * (1 - erfApprox(Math.abs(z) / Math.SQRT2))
  return twoTailed ? 2 * tail : tail
}
