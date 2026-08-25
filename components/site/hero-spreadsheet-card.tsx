import {
  IconCheck,
  IconBolt,
  IconTrendingUp,
  IconMathFunction,
  IconFileSpreadsheet,
} from "@tabler/icons-react"

export function HeroSpreadsheetCard() {
  return (
    <div className="relative w-full max-w-lg lg:max-w-none">
      {/* Ambient background glow */}
      <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-emerald-500/25 via-teal-500/20 to-emerald-600/25 opacity-70 blur-2xl transition duration-500 group-hover:opacity-100" />

      {/* Main Glass Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-2xl transition-all">
        {/* Spreadsheet App Top Bar */}
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-400/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80 inline-block" />
            </div>
            <span className="ml-2 hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <IconFileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Financial_Model_v4.xlsx</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AutoSave ON
            </span>
          </div>
        </div>

        {/* Formula Bar */}
        <div className="flex items-center gap-2 border-b border-border/60 bg-background/60 px-3.5 py-2 text-xs font-mono">
          <div className="flex items-center gap-1 rounded bg-muted/70 px-2 py-1 font-semibold text-muted-foreground">
            <IconMathFunction className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>D4</span>
          </div>
          <span className="text-muted-foreground font-bold">fx</span>
          <div className="flex-1 overflow-x-auto whitespace-nowrap text-foreground font-semibold text-xs tracking-tight">
            <span className="text-emerald-600 dark:text-emerald-400">=XLOOKUP</span>
            <span className="text-muted-foreground">(</span>
            <span className="text-blue-600 dark:text-blue-400">&quot;Enterprise&quot;</span>
            <span className="text-muted-foreground">, </span>
            <span className="text-amber-600 dark:text-amber-400">B2:B6</span>
            <span className="text-muted-foreground">, </span>
            <span className="text-purple-600 dark:text-purple-400">D2:D6</span>
            <span className="text-muted-foreground">)</span>
          </div>
        </div>

        {/* Spreadsheet Data Grid */}
        <div className="overflow-x-auto p-3 sm:p-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/50 text-[11px] font-semibold text-muted-foreground">
                <th className="w-8 pb-2 text-center font-mono text-muted-foreground/60">#</th>
                <th className="pb-2 pl-2 font-medium">A (Region)</th>
                <th className="pb-2 pl-2 font-medium">B (Plan)</th>
                <th className="pb-2 pl-2 font-medium">C (Users)</th>
                <th className="pb-2 pl-2 font-medium">D (Revenue)</th>
                <th className="pb-2 pl-2 text-right font-medium">E (Growth)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono text-[11px]">
              <tr className="hover:bg-muted/20">
                <td className="py-2 text-center text-muted-foreground/50">2</td>
                <td className="py-2 pl-2 text-foreground font-sans font-medium">North America</td>
                <td className="py-2 pl-2 text-muted-foreground font-sans">Starter</td>
                <td className="py-2 pl-2 text-foreground">1,240</td>
                <td className="py-2 pl-2 text-foreground">$14,880</td>
                <td className="py-2 pl-2 text-right text-emerald-600 dark:text-emerald-400 font-semibold">+12.4%</td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="py-2 text-center text-muted-foreground/50">3</td>
                <td className="py-2 pl-2 text-foreground font-sans font-medium">Europe HQ</td>
                <td className="py-2 pl-2 text-muted-foreground font-sans">Professional</td>
                <td className="py-2 pl-2 text-foreground">3,890</td>
                <td className="py-2 pl-2 text-foreground">$46,680</td>
                <td className="py-2 pl-2 text-right text-emerald-600 dark:text-emerald-400 font-semibold">+18.2%</td>
              </tr>
              {/* Highlighted Active Target Row */}
              <tr className="bg-emerald-500/10 dark:bg-emerald-500/15 font-semibold transition-colors">
                <td className="py-2 text-center text-emerald-600 dark:text-emerald-400">4</td>
                <td className="py-2 pl-2 text-foreground font-sans">Global Ops</td>
                <td className="py-2 pl-2 text-blue-600 dark:text-blue-400 font-sans">Enterprise</td>
                <td className="py-2 pl-2 text-foreground">8,450</td>
                <td className="py-2 pl-2 relative">
                  <span className="inline-block rounded border-2 border-emerald-500 bg-background/90 px-1.5 py-0.5 text-emerald-700 dark:text-emerald-300 shadow-sm">
                    $128,450
                  </span>
                </td>
                <td className="py-2 pl-2 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="inline-flex items-center gap-0.5">
                    <IconTrendingUp className="h-3 w-3 inline" />
                    +34.6%
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="py-2 text-center text-muted-foreground/50">5</td>
                <td className="py-2 pl-2 text-foreground font-sans font-medium">Asia Pacific</td>
                <td className="py-2 pl-2 text-muted-foreground font-sans">Professional</td>
                <td className="py-2 pl-2 text-foreground">2,150</td>
                <td className="py-2 pl-2 text-foreground">$25,800</td>
                <td className="py-2 pl-2 text-right text-emerald-600 dark:text-emerald-400 font-semibold">+8.7%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer info bar inside card */}
        <div className="flex items-center justify-between border-t border-border/50 bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">Sheet1:</span>
            <span>Summary Matrix</span>
          </span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
            Formula Verified ✓
          </span>
        </div>
      </div>

      {/* Floating Badge 1: 100% Tested Formulas */}
      <div className="absolute -bottom-3 -left-3 hidden sm:flex items-center gap-2 rounded-xl border border-border/80 bg-background/95 px-3 py-2 text-xs font-semibold shadow-xl backdrop-blur-md">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <IconCheck className="h-3.5 w-3.5" />
        </div>
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold text-foreground">100% Tested Formulas</p>
          <p className="text-[10px] text-muted-foreground font-normal">Excel 365 & Sheets Compatible</p>
        </div>
      </div>

      {/* Floating Badge 2: 10x Faster Productivity */}
      <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-2 rounded-xl border border-border/80 bg-background/95 px-3 py-2 text-xs font-semibold shadow-xl backdrop-blur-md">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <IconBolt className="h-3.5 w-3.5" />
        </div>
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold text-foreground">Work 10x Faster</p>
          <p className="text-[10px] text-muted-foreground font-normal">Ready-to-Use Templates</p>
        </div>
      </div>
    </div>
  )
}
