"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import { LogoIcon } from "@/components/atoms/LogoIcon";

// ── Types ────────────────────────────────────────────────────────────────────

interface GlobalStats {
  totalUsers: number;
  totalSessions: number;
  completedCycles: number;
  usersWithT48: number;
  systemRetentionRate: number;
  iri: { globalAvg: number; best: number; worst: number };
  hypothesis: {
    target: number;
    current: number;
    validated: boolean;
    status: string;
  };
  difficultyDistribution: { level: string; count: number }[];
  byEvaluationType: { type: string; avgIri: number; totalSessions: number }[];
}

interface UserRow {
  id: number;
  username: string;
  email: string;
  registeredAt: string;
  totalSessions: number;
  completedCycles: number;
  completionRate: number;
  avgIri: number;
  bestIri: number;
  currentStreak: number;
  lastActivity: string | null;
  classification: string;
}

interface UserDetail {
  user: { id: number; username: string; email: string; registeredAt: string };
  streak: {
    currentStreak: number;
    bestStreak: number;
    averageIri: number;
    bestIri: number;
    totalSessions: number;
    totalT48Completed: number;
  };
  summary: {
    totalSessions: number;
    completedSessions: number;
    completionRate: number;
    avgIri: number;
    bestIri: number;
    currentStreak: number;
    bestStreak: number;
  };
  sessions: {
    sessionId: number;
    title: string;
    difficultyLevel: string;
    evaluationType: string;
    status: string;
    scoreT0: number | null;
    scoreT48: number | null;
    iri: number | null;
  }[];
}

// Query 1 — Ciclo espaciado
interface CicloEspaciadoRow {
  user_id: number;
  username: string;
  total_sessions: string;
  registered_at: string;
  ciclo_status: string;
  avg_iri: string;
}

// Query 2 — Ranking IRI
interface RankingIriRow {
  user_id: number;
  username: string;
  total_sessions: string;
  sesiones_completadas: string;
  avg_iri: string;
  best_iri: string;
  worst_iri: string;
  nivel_mas_usado: string | null;
  clasificacion: string;
}

// Query 3 — Retención por tipo evaluación
interface RetencionEvalRow {
  tipo_evaluacion: string;
  total_sesiones: string;
  sesiones_con_t0: string;
  sesiones_con_t48: string;
  avg_iri: string;
  tasa_completacion_pct: string;
  mejora_promedio: string;
}

// Query 4 — Racha activa
interface RachaActivaRow {
  username: string;
  current_streak: string;
  best_streak: string;
  total_sessions: string;
  total_t48_completed: string;
  avg_iri: string;
  best_iri: string;
  tasa_completacion_pct: string;
  estado_racha: string;
}

// Query 5 — Evolución IRI semanal
interface EvolucionIriRow {
  semana_inicio: string;
  sesiones_completadas: string;
  usuarios_activos: string;
  avg_iri_semana: string;
  avg_score_t0: string;
  avg_score_t48: string;
  avg_mejora: string;
  iri_acumulado: string;
  estado_hipotesis: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CORRECT_PASSWORD = "readflow_admin_2026";
const PURPLE = "#5B6AEB";
const PURPLE_LIGHT = "#A5ADFC";
const GREEN = "#22c55e";
const AMBER = "#f59e0b";
const RED = "#ef4444";

const CLASSIFICATION_COLORS: Record<string, string> = {
  "Alto rendimiento": "#22c55e",
  "Rendimiento medio": "#5B6AEB",
  "Necesita mejorar": "#f59e0b",
  "Sin datos": "#6b7280",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function classColor(cls: string) {
  return CLASSIFICATION_COLORS[cls] ?? "#6b7280";
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-background-secondary rounded-2xl border border-border p-5 flex flex-col gap-1">
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
        {label}
      </span>
      <span
        className="text-3xl font-bold text-foreground"
        style={accent ? { color: accent } : {}}
      >
        {value}
      </span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}

function HypothesisGauge({
  current,
  target,
}: {
  current: number;
  target: number;
}) {
  const pct = Math.min((current / target) * 100, 100);
  const validated = current >= target;
  const color = validated ? GREEN : current >= target * 0.7 ? AMBER : RED;

  return (
    <div className="bg-background-secondary rounded-2xl border border-border p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">
          Validación de Hipótesis
        </h3>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: color + "22", color }}
        >
          {validated ? "✓ VALIDADA" : "PENDIENTE"}
        </span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        La hipótesis se valida cuando el IRI promedio global ≥ {target} (mejora
        del 20% en retención).
      </p>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">IRI actual</span>
          <span className="font-bold" style={{ color }}>
            {current}
          </span>
        </div>
        <div className="relative h-4 bg-hover rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: color }}
          />
          {/* Target line */}
          <div
            className="absolute inset-y-0 w-0.5 bg-foreground/30"
            style={{ left: "100%" }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>Meta: {target}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-2">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{current}</div>
          <div className="text-xs text-muted-foreground">IRI Actual</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{target}</div>
          <div className="text-xs text-muted-foreground">Meta</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold" style={{ color }}>
            {pct.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">Progreso</div>
        </div>
      </div>
    </div>
  );
}

// ── Password Gate ──────────────────────────────────────────────────────────────

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (value === CORRECT_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setValue("");
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center gap-3 justify-center">
          <LogoIcon size={32} className="text-foreground" />
          <h1 className="text-xl font-medium text-foreground">
            ReadFlow Admin
          </h1>
        </div>
        <div className="bg-background-secondary border border-border rounded-2xl p-6 space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Acceso restringido · Ingresa tu token de administrador
          </p>
          <form onSubmit={submit} className="space-y-3">
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Token de acceso"
              autoFocus
              className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-background text-foreground outline-none transition-colors ${
                error
                  ? "border-red-500"
                  : "border-border focus:border-main-purple"
              }`}
            />
            {error && (
              <p className="text-xs text-red-500 text-center">
                Token incorrecto
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-summary-button text-white rounded-xl py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Custom Tooltips ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background-secondary border border-border rounded-xl px-3 py-2 shadow-md text-sm space-y-1">
      <p className="text-muted-foreground font-medium">{label}</p>
      {payload.map((e: any) => (
        <p key={e.name} style={{ color: e.fill || e.color }}>
          {e.name}: <strong>{e.value}</strong>
        </p>
      ))}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"overview" | "users" | "search" | "queries">("overview");
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState<UserDetail | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [userFilter, setUserFilter] = useState("");
  const [activeQuery, setActiveQuery] = useState<1|2|3|4|5>(1);
  const [queriesData, setQueriesData] = useState<{
    cicloEspaciado: CicloEspaciadoRow[] | null;
    rankingIri: RankingIriRow[] | null;
    retencionEval: RetencionEvalRow[] | null;
    rachaActiva: RachaActivaRow[] | null;
    evolucionIri: EvolucionIriRow[] | null;
  }>({ cicloEspaciado: null, rankingIri: null, retencionEval: null, rachaActiva: null, evolucionIri: null });
  const [loadingQuery, setLoadingQuery] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoadingStats(true);
    setLoadingUsers(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats/global"),
        fetch("/api/admin/users"),
      ]);
      if (statsRes.ok) setGlobalStats(await statsRes.json());
      if (usersRes.ok) {
        const d = await usersRes.json();
        setUsers(d.users ?? []);
      }
    } finally {
      setLoadingStats(false);
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchAll();
  }, [authed, fetchAll]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchEmail.trim()) return;
    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null);
    try {
      const res = await fetch(
        `/api/admin/user?email=${encodeURIComponent(searchEmail.trim())}`,
      );
      if (!res.ok) {
        const d = await res.json();
        setSearchError(d.message ?? "Usuario no encontrado");
      } else {
        setSearchResult(await res.json());
      }
    } catch {
      setSearchError("Error de conexión");
    } finally {
      setSearchLoading(false);
    }
  }

  async function fetchQuery(queryNum: 1|2|3|4|5) {
    setActiveQuery(queryNum);
    const endpointMap: Record<number, string> = {
      1: "/api/admin/queries/ciclo-espaciado",
      2: "/api/admin/queries/ranking-iri",
      3: "/api/admin/queries/retencion-tipo-evaluacion",
      4: "/api/admin/queries/racha-activa",
      5: "/api/admin/queries/evolucion-iri-semanal",
    };
    const keyMap: Record<number, keyof typeof queriesData> = {
      1: "cicloEspaciado",
      2: "rankingIri",
      3: "retencionEval",
      4: "rachaActiva",
      5: "evolucionIri",
    };
    const key = keyMap[queryNum];
    if (queriesData[key] !== null) return; // ya cargado, no re-fetch
    setLoadingQuery(true);
    try {
      const res = await fetch(endpointMap[queryNum]);
      if (res.ok) {
        const d = await res.json();
        setQueriesData(prev => ({ ...prev, [key]: d.data ?? [] }));
      }
    } finally {
      setLoadingQuery(false);
    }
  }

  if (!authed) return <PasswordGate onSuccess={() => setAuthed(true)} />;

  // Derived chart data
  const classificationData = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.classification] = (acc[u.classification] ?? 0) + 1;
    return acc;
  }, {});
  const classPieData = Object.entries(classificationData).map(
    ([name, value]) => ({ name, value }),
  );

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(userFilter.toLowerCase()) ||
      u.email.toLowerCase().includes(userFilter.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background-secondary border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <LogoIcon size={26} className="text-foreground" />
          <span className="font-semibold text-foreground">ReadFlow</span>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-sm text-muted-foreground">
            Panel de Investigación
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-green-500/15 text-green-500 border border-green-500/30 px-2.5 py-1 rounded-full font-medium">
            Admin
          </span>
          <button
            onClick={() => setAuthed(false)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-background-secondary">
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          {(["overview", "users", "search", "queries"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                tab === t
                  ? "border-main-purple text-main-purple"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "overview"
                ? "Resumen global"
                : t === "users"
                  ? "Participantes"
                  : t === "queries"
                    ? "Consultas SQL"
                    : "Buscar usuario"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* OVERVIEW */}
        {tab === "overview" && (
          <>
            {loadingStats ? (
              <div className="text-center py-20 text-muted-foreground text-sm">
                Cargando estadísticas...
              </div>
            ) : globalStats ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KpiCard
                    label="Participantes registrados"
                    value={globalStats.totalUsers}
                  />
                  <KpiCard
                    label="Ciclos completos (T0+T48)"
                    value={globalStats.completedCycles}
                    sub={`de ${globalStats.totalSessions} sesiones totales`}
                  />
                  <KpiCard
                    label="IRI promedio global"
                    value={globalStats.iri.globalAvg}
                    sub={`Mejor: ${globalStats.iri.best} · Peor: ${globalStats.iri.worst}`}
                    accent={
                      globalStats.iri.globalAvg >= 120
                        ? GREEN
                        : globalStats.iri.globalAvg >= 100
                          ? AMBER
                          : RED
                    }
                  />
                  <KpiCard
                    label="Tasa de retención"
                    value={`${globalStats.systemRetentionRate}%`}
                    sub={`${globalStats.usersWithT48} usuarios completaron T48`}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <HypothesisGauge
                    current={globalStats.hypothesis.current}
                    target={globalStats.hypothesis.target}
                  />

                  <div className="bg-background-secondary rounded-2xl border border-border p-6 space-y-4">
                    <h3 className="font-semibold text-foreground">
                      IRI promedio por tipo de evaluación
                    </h3>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={globalStats.byEvaluationType}
                          margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="currentColor"
                            strokeOpacity={0.08}
                            vertical={false}
                          />
                          <XAxis
                            dataKey="type"
                            tick={{
                              fontSize: 10,
                              fill: "currentColor",
                              opacity: 0.5,
                            }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => v.split(" ")[0]}
                          />
                          <YAxis
                            domain={[0, 120]}
                            tick={{
                              fontSize: 10,
                              fill: "currentColor",
                              opacity: 0.5,
                            }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            content={<ChartTooltip />}
                            cursor={{ fill: "currentColor", fillOpacity: 0.04 }}
                          />
                          <ReferenceLine
                            y={120}
                            stroke={GREEN}
                            strokeDasharray="4 4"
                            strokeOpacity={0.6}
                            label={{
                              value: "Meta 120",
                              fill: GREEN,
                              fontSize: 10,
                              position: "right",
                            }}
                          />
                          <Bar
                            dataKey="avgIri"
                            name="IRI Promedio"
                            fill={PURPLE}
                            radius={[6, 6, 0, 0]}
                            maxBarSize={48}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      {globalStats.byEvaluationType.map((et) => (
                        <div
                          key={et.type}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted-foreground truncate max-w-[60%]">
                            {et.type}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">
                              {et.totalSessions} ses.
                            </span>
                            <span className="font-semibold text-foreground w-12 text-right">
                              {et.avgIri > 0 ? `${et.avgIri}` : "—"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-background-secondary rounded-2xl border border-border p-6 space-y-4">
                    <h3 className="font-semibold text-foreground">
                      Distribución por dificultad
                    </h3>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={globalStats.difficultyDistribution}
                          margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="currentColor"
                            strokeOpacity={0.08}
                            vertical={false}
                          />
                          <XAxis
                            dataKey="level"
                            tick={{
                              fontSize: 11,
                              fill: "currentColor",
                              opacity: 0.5,
                            }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{
                              fontSize: 11,
                              fill: "currentColor",
                              opacity: 0.5,
                            }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            content={<ChartTooltip />}
                            cursor={{ fill: "currentColor", fillOpacity: 0.04 }}
                          />
                          <Bar
                            dataKey="count"
                            name="Sesiones"
                            fill={PURPLE_LIGHT}
                            radius={[6, 6, 0, 0]}
                            maxBarSize={48}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-background-secondary rounded-2xl border border-border p-6 space-y-4">
                    <h3 className="font-semibold text-foreground">
                      Clasificación de participantes
                    </h3>
                    {classPieData.length > 0 ? (
                      <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={classPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={85}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {classPieData.map((entry, i) => (
                                <Cell key={i} fill={classColor(entry.name)} />
                              ))}
                            </Pie>
                            <Tooltip content={<ChartTooltip />} />
                            <Legend
                              formatter={(v) => (
                                <span style={{ fontSize: 11, opacity: 0.7 }}>
                                  {v}
                                </span>
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
                        Sin datos de clasificación aún
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-muted-foreground text-sm">
                No se pudieron cargar las estadísticas.
              </div>
            )}
          </>
        )}

        {tab === "users" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Participantes{" "}
                <span className="text-muted-foreground font-normal text-base">
                  ({users.length})
                </span>
              </h2>
              <input
                type="text"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                placeholder="Filtrar por nombre o correo..."
                className="border border-border rounded-xl px-4 py-2 text-sm bg-background text-foreground outline-none focus:border-main-purple transition-colors w-64"
              />
            </div>

            {loadingUsers ? (
              <div className="text-center py-20 text-muted-foreground text-sm">
                Cargando participantes...
              </div>
            ) : (
              <div className="bg-background-secondary rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {[
                          "Nombre",
                          "Email",
                          "Sesiones",
                          "Ciclos",
                          "IRI prom.",
                          "Mejor IRI",
                          "Clasificación",
                          "Registro",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr
                          key={u.id}
                          className="border-b border-border/50 hover:bg-hover transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap max-w-[160px] truncate">
                            {u.username}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                            {u.email}
                          </td>
                          <td className="px-4 py-3 text-center text-foreground">
                            {u.totalSessions}
                          </td>
                          <td className="px-4 py-3 text-center text-foreground">
                            {u.completedCycles}
                          </td>
                          <td
                            className="px-4 py-3 text-center font-semibold"
                            style={{
                              color:
                                u.avgIri >= 120
                                  ? GREEN
                                  : u.avgIri >= 100
                                    ? AMBER
                                    : u.avgIri > 0
                                      ? RED
                                      : undefined,
                            }}
                          >
                            {u.avgIri > 0 ? u.avgIri : "—"}
                          </td>
                          <td className="px-4 py-3 text-center text-foreground">
                            {u.bestIri > 0 ? u.bestIri : "—"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                background: classColor(u.classification) + "22",
                                color: classColor(u.classification),
                              }}
                            >
                              {u.classification}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                            {formatDate(u.registeredAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      No se encontraron participantes con ese filtro.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "search" && (
          <div className="space-y-6 max-w-4xl">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Correo del participante..."
                className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm bg-background text-foreground outline-none focus:border-main-purple transition-colors"
              />
              <button
                type="submit"
                disabled={searchLoading}
                className="bg-summary-button text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {searchLoading ? "Buscando..." : "Buscar"}
              </button>
            </form>

            {searchError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                {searchError}
              </div>
            )}

            {searchResult && (
              <div className="space-y-6">
                {/* User header */}
                <div className="bg-background-secondary rounded-2xl border border-border p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-main-purple/15 flex items-center justify-center text-main-purple font-bold text-lg flex-shrink-0">
                    {searchResult.user.username[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-lg">
                      {searchResult.user.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {searchResult.user.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Registro: {formatDate(searchResult.user.registeredAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KpiCard
                    label="Sesiones"
                    value={searchResult.summary.totalSessions}
                  />
                  <KpiCard
                    label="Ciclos completos"
                    value={searchResult.summary.completedSessions}
                    sub={`${searchResult.summary.completionRate}% tasa`}
                  />
                  <KpiCard
                    label="IRI promedio"
                    value={
                      searchResult.summary.avgIri > 0
                        ? searchResult.summary.avgIri
                        : "—"
                    }
                    accent={
                      searchResult.summary.avgIri >= 120
                        ? GREEN
                        : searchResult.summary.avgIri >= 100
                          ? AMBER
                          : searchResult.summary.avgIri > 0
                            ? RED
                            : undefined
                    }
                  />
                  <KpiCard
                    label="Mejor IRI"
                    value={
                      searchResult.summary.bestIri > 0
                        ? searchResult.summary.bestIri
                        : "—"
                    }
                  />
                </div>

                {searchResult.sessions.length > 0 && (
                  <div className="bg-background-secondary rounded-2xl border border-border p-6 space-y-4">
                    <h3 className="font-semibold text-foreground">
                      Historial de sesiones
                    </h3>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={searchResult.sessions.map((s, i) => ({
                            name: `Ses. ${i + 1}`,
                            T0: s.scoreT0 ?? 0,
                            T48: s.scoreT48 ?? 0,
                            IRI: s.iri ?? 0,
                            title: s.title,
                          }))}
                          margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                          barGap={4}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="currentColor"
                            strokeOpacity={0.08}
                            vertical={false}
                          />
                          <XAxis
                            dataKey="name"
                            tick={{
                              fontSize: 11,
                              fill: "currentColor",
                              opacity: 0.5,
                            }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            domain={[0, 110]}
                            tick={{
                              fontSize: 11,
                              fill: "currentColor",
                              opacity: 0.5,
                            }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            content={<ChartTooltip />}
                            cursor={{ fill: "currentColor", fillOpacity: 0.04 }}
                          />
                          <Bar
                            dataKey="T0"
                            name="Score T0"
                            fill={PURPLE}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={28}
                          />
                          <Bar
                            dataKey="T48"
                            name="Score T48"
                            fill={PURPLE_LIGHT}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={28}
                          />
                          <Bar
                            dataKey="IRI"
                            name="IRI"
                            fill={GREEN}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={28}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            {[
                              "Sesión",
                              "Dificultad",
                              "Evaluación",
                              "T0",
                              "T48",
                              "IRI",
                              "Estado",
                            ].map((h) => (
                              <th
                                key={h}
                                className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {searchResult.sessions.map((s) => (
                            <tr
                              key={s.sessionId}
                              className="border-b border-border/40"
                            >
                              <td className="px-3 py-2.5 text-foreground max-w-[180px] truncate">
                                {s.title}
                              </td>
                              <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                                {s.difficultyLevel}
                              </td>
                              <td className="px-3 py-2.5 text-muted-foreground max-w-[150px] truncate">
                                {s.evaluationType}
                              </td>
                              <td className="px-3 py-2.5 text-center text-foreground">
                                {s.scoreT0 ?? "—"}
                              </td>
                              <td className="px-3 py-2.5 text-center text-foreground">
                                {s.scoreT48 ?? "—"}
                              </td>
                              <td
                                className="px-3 py-2.5 text-center font-semibold"
                                style={{
                                  color:
                                    (s.iri ?? 0) >= 120
                                      ? GREEN
                                      : (s.iri ?? 0) >= 100
                                        ? AMBER
                                        : (s.iri ?? 0) > 0
                                          ? RED
                                          : undefined,
                                }}
                              >
                                {s.iri ?? "—"}
                              </td>
                              <td className="px-3 py-2.5 whitespace-nowrap">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    s.status === "completed"
                                      ? "bg-green-500/15 text-green-500"
                                      : s.status === "t0_completed"
                                        ? "bg-amber-500/15 text-amber-500"
                                        : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {s.status === "completed"
                                    ? "Completo"
                                    : s.status === "t0_completed"
                                      ? "En repaso"
                                      : "Pendiente"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {searchResult.sessions.length === 0 && (
                  <div className="bg-background-secondary rounded-2xl border border-border p-8 text-center text-muted-foreground text-sm">
                    Este participante aún no tiene sesiones de estudio.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "queries" && (
          <div className="space-y-6">
            {/* Header descriptivo */}
            <div className="bg-background-secondary rounded-2xl border border-border p-5">
              <h2 className="font-semibold text-foreground mb-1">Consultas SQL de Análisis</h2>
              <p className="text-sm text-muted-foreground">
                Validación de hipótesis: <em>"Si los usuarios completan el ciclo de repetición espaciada (T0 + T48), entonces su índice de retención (IRI) tendrá una mejora del 20% en promedio."</em>
              </p>
            </div>

            {/* Selector de queries */}
            <div className="flex flex-wrap gap-2">
              {([
                { n: 1 as const, label: "Q1 · Ciclo espaciado" },
                { n: 2 as const, label: "Q2 · Ranking IRI" },
                { n: 3 as const, label: "Q3 · Retención x tipo" },
                { n: 4 as const, label: "Q4 · Racha activa" },
                { n: 5 as const, label: "Q5 · Evolución semanal" },
              ]).map(({ n, label }) => (
                <button
                  key={n}
                  onClick={() => fetchQuery(n)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                    activeQuery === n
                      ? "bg-main-purple/15 text-main-purple border-main-purple/40"
                      : "bg-background-secondary text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Q1 */}
            {activeQuery === 1 && (
              <div className="bg-background-secondary rounded-2xl border border-border p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">Q1 · Tasa de completación del ciclo espaciado</h3>
                  <p className="text-sm text-muted-foreground mt-1">¿Cuántos usuarios completaron al menos un T48? Vinculado directo a la hipótesis.</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["CTE", "JOIN múltiple", "COUNT DISTINCT", "CASE", "Subconsulta correlacionada"].map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-main-purple/10 text-main-purple">{t}</span>
                    ))}
                  </div>
                </div>
                {loadingQuery ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Ejecutando query...</div>
                ) : queriesData.cicloEspaciado === null ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Selecciona la query para ejecutarla.</div>
                ) : queriesData.cicloEspaciado.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Sin resultados — no hay datos en la base aún.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          {["Usuario", "Sesiones", "Estado ciclo", "IRI promedio", "Registro"].map(h => (
                            <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queriesData.cicloEspaciado.map((r, i) => (
                          <tr key={i} className="border-b border-border/40 hover:bg-hover transition-colors">
                            <td className="px-3 py-2.5 font-medium text-foreground">{r.username}</td>
                            <td className="px-3 py-2.5 text-center text-foreground">{r.total_sessions.toString()}</td>
                            <td className="px-3 py-2.5">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.ciclo_status === "Completó ciclo" ? "bg-green-500/15 text-green-500" : "bg-amber-500/15 text-amber-500"}`}>
                                {r.ciclo_status}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-center font-semibold" style={{ color: Number(r.avg_iri) >= 80 ? GREEN : Number(r.avg_iri) >= 60 ? AMBER : Number(r.avg_iri) > 0 ? RED : undefined }}>
                              {Number(r.avg_iri) > 0 ? r.avg_iri.toString() : "—"}
                            </td>
                            <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{formatDate(r.registered_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Q2 */}
            {activeQuery === 2 && (
              <div className="bg-background-secondary rounded-2xl border border-border p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">Q2 · Ranking de usuarios por IRI promedio</h3>
                  <p className="text-sm text-muted-foreground mt-1">Incluye nivel de dificultad más usado. Solo usuarios con al menos 1 sesión T48 completada.</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Subconsulta en SELECT", "GROUP BY + HAVING", "AVG / MAX / MIN", "CASE clasificación"].map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-main-purple/10 text-main-purple">{t}</span>
                    ))}
                  </div>
                </div>
                {loadingQuery ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Ejecutando query...</div>
                ) : queriesData.rankingIri === null ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Selecciona la query para ejecutarla.</div>
                ) : queriesData.rankingIri.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Sin resultados — no hay datos en la base aún.</div>
                ) : (
                  <>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={queriesData.rankingIri.slice(0,10).map(r => ({ name: r.username, avg: Number(r.avg_iri), best: Number(r.best_iri) }))} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} />
                          <Tooltip content={<ChartTooltip />} cursor={{ fill: "currentColor", fillOpacity: 0.04 }} />
                          <Bar dataKey="avg" name="IRI Promedio" fill={PURPLE} radius={[4,4,0,0]} maxBarSize={36} />
                          <Bar dataKey="best" name="Mejor IRI" fill={PURPLE_LIGHT} radius={[4,4,0,0]} maxBarSize={36} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            {["#", "Usuario", "Sesiones T48", "IRI Prom.", "Mejor IRI", "Peor IRI", "Nivel más usado", "Clasificación"].map(h => (
                              <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queriesData.rankingIri.map((r, i) => (
                            <tr key={i} className="border-b border-border/40 hover:bg-hover transition-colors">
                              <td className="px-3 py-2.5 text-muted-foreground">{i + 1}</td>
                              <td className="px-3 py-2.5 font-medium text-foreground">{r.username}</td>
                              <td className="px-3 py-2.5 text-center text-foreground">{r.sesiones_completadas.toString()}</td>
                              <td className="px-3 py-2.5 text-center font-semibold" style={{ color: Number(r.avg_iri) >= 80 ? GREEN : Number(r.avg_iri) >= 60 ? AMBER : RED }}>{r.avg_iri.toString()}</td>
                              <td className="px-3 py-2.5 text-center text-foreground">{r.best_iri?.toString() ?? "—"}</td>
                              <td className="px-3 py-2.5 text-center text-foreground">{r.worst_iri?.toString() ?? "—"}</td>
                              <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{r.nivel_mas_usado ?? "—"}</td>
                              <td className="px-3 py-2.5 whitespace-nowrap">
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: (r.clasificacion === "Alto rendimiento" ? GREEN : r.clasificacion === "Rendimiento medio" ? PURPLE : r.clasificacion === "Necesita mejorar" ? AMBER : RED) + "22", color: r.clasificacion === "Alto rendimiento" ? GREEN : r.clasificacion === "Rendimiento medio" ? PURPLE : r.clasificacion === "Necesita mejorar" ? AMBER : RED }}>
                                  {r.clasificacion}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Q3 */}
            {activeQuery === 3 && (
              <div className="bg-background-secondary rounded-2xl border border-border p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">Q3 · Retención y completación por tipo de evaluación</h3>
                  <p className="text-sm text-muted-foreground mt-1">¿Qué tipo de evaluación genera mejor retención? Solo tipos con al menos 1 sesión.</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["GROUP BY + HAVING", "SUM / COUNT", "Subconsulta en FROM", "Tasa calculada", "NULLIF"].map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-main-purple/10 text-main-purple">{t}</span>
                    ))}
                  </div>
                </div>
                {loadingQuery ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Ejecutando query...</div>
                ) : queriesData.retencionEval === null ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Selecciona la query para ejecutarla.</div>
                ) : queriesData.retencionEval.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Sin resultados — no hay datos en la base aún.</div>
                ) : (
                  <>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={queriesData.retencionEval.map(r => ({ name: r.tipo_evaluacion.split(" ")[0], iri: Number(r.avg_iri) ?? 0, completacion: Number(r.tasa_completacion_pct) ?? 0 }))} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} />
                          <Tooltip content={<ChartTooltip />} cursor={{ fill: "currentColor", fillOpacity: 0.04 }} />
                          <Bar dataKey="iri" name="IRI Promedio" fill={PURPLE} radius={[4,4,0,0]} maxBarSize={48} />
                          <Bar dataKey="completacion" name="% Completación" fill={GREEN} radius={[4,4,0,0]} maxBarSize={48} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            {["Tipo evaluación", "Total ses.", "Con T0", "Con T48", "IRI prom.", "% Completación", "Mejora prom."].map(h => (
                              <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queriesData.retencionEval.map((r, i) => (
                            <tr key={i} className="border-b border-border/40 hover:bg-hover transition-colors">
                              <td className="px-3 py-2.5 text-foreground max-w-50 truncate">{r.tipo_evaluacion}</td>
                              <td className="px-3 py-2.5 text-center text-foreground">{r.total_sesiones.toString()}</td>
                              <td className="px-3 py-2.5 text-center text-foreground">{r.sesiones_con_t0.toString()}</td>
                              <td className="px-3 py-2.5 text-center text-foreground">{r.sesiones_con_t48.toString()}</td>
                              <td className="px-3 py-2.5 text-center font-semibold" style={{ color: Number(r.avg_iri) >= 80 ? GREEN : Number(r.avg_iri) >= 60 ? AMBER : Number(r.avg_iri) > 0 ? RED : undefined }}>{r.avg_iri !== null ? r.avg_iri.toString() : "—"}</td>
                              <td className="px-3 py-2.5 text-center text-foreground">{r.tasa_completacion_pct !== null ? `${r.tasa_completacion_pct}%` : "—"}</td>
                              <td className="px-3 py-2.5 text-center text-foreground">{r.mejora_promedio !== null ? r.mejora_promedio.toString() : "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Q4 */}
            {activeQuery === 4 && (
              <div className="bg-background-secondary rounded-2xl border border-border p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">Q4 · Usuarios con racha activa y métricas de retención</h3>
                  <p className="text-sm text-muted-foreground mt-1">¿Los usuarios con racha alta tienen mejor IRI? Solo usuarios que completaron al menos un T48.</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["CTE", "JOIN múltiple", "Subconsulta en WHERE", "COALESCE", "NULLIF"].map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-main-purple/10 text-main-purple">{t}</span>
                    ))}
                  </div>
                </div>
                {loadingQuery ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Ejecutando query...</div>
                ) : queriesData.rachaActiva === null ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Selecciona la query para ejecutarla.</div>
                ) : queriesData.rachaActiva.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Sin resultados — no hay datos en la base aún.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          {["Usuario", "Racha actual", "Mejor racha", "Sesiones", "T48 complet.", "IRI prom.", "Mejor IRI", "% Completación", "Estado"].map(h => (
                            <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queriesData.rachaActiva.map((r, i) => (
                          <tr key={i} className="border-b border-border/40 hover:bg-hover transition-colors">
                            <td className="px-3 py-2.5 font-medium text-foreground">{r.username}</td>
                            <td className="px-3 py-2.5 text-center font-semibold" style={{ color: Number(r.current_streak) > 0 ? GREEN : undefined }}>{r.current_streak.toString()}</td>
                            <td className="px-3 py-2.5 text-center text-foreground">{r.best_streak.toString()}</td>
                            <td className="px-3 py-2.5 text-center text-foreground">{r.total_sessions.toString()}</td>
                            <td className="px-3 py-2.5 text-center text-foreground">{r.total_t48_completed.toString()}</td>
                            <td className="px-3 py-2.5 text-center font-semibold" style={{ color: Number(r.avg_iri) >= 80 ? GREEN : Number(r.avg_iri) >= 60 ? AMBER : Number(r.avg_iri) > 0 ? RED : undefined }}>{Number(r.avg_iri) > 0 ? r.avg_iri.toString() : "—"}</td>
                            <td className="px-3 py-2.5 text-center text-foreground">{Number(r.best_iri) > 0 ? r.best_iri.toString() : "—"}</td>
                            <td className="px-3 py-2.5 text-center text-foreground">{r.tasa_completacion_pct !== null ? `${r.tasa_completacion_pct}%` : "—"}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.estado_racha === "En racha máxima" ? "bg-green-500/15 text-green-500" : r.estado_racha === "Racha activa" ? "bg-amber-500/15 text-amber-500" : "bg-muted text-muted-foreground"}`}>
                                {r.estado_racha}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Q5 */}
            {activeQuery === 5 && (
              <div className="bg-background-secondary rounded-2xl border border-border p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">Q5 · Evolución del IRI promedio por semana</h3>
                  <p className="text-sm text-muted-foreground mt-1">¿El IRI mejora con el tiempo? Muestra tendencia semanal e IRI acumulado con función de ventana.</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["CTE", "DATE_TRUNC", "GROUP BY", "Window function AVG OVER", "TO_CHAR", "CASE hipótesis"].map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-main-purple/10 text-main-purple">{t}</span>
                    ))}
                  </div>
                </div>
                {loadingQuery ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Ejecutando query...</div>
                ) : queriesData.evolucionIri === null ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Selecciona la query para ejecutarla.</div>
                ) : queriesData.evolucionIri.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Sin resultados — no hay datos en la base aún.</div>
                ) : (
                  <>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={queriesData.evolucionIri.map(r => ({ semana: r.semana_inicio, iri: Number(r.avg_iri_semana), acumulado: Number(r.iri_acumulado), mejora: Number(r.avg_mejora) }))} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} vertical={false} />
                          <XAxis dataKey="semana" tick={{ fontSize: 9, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} />
                          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "currentColor", strokeOpacity: 0.1 }} />
                          <ReferenceLine y={70} stroke={GREEN} strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: "Meta 70", fill: GREEN, fontSize: 10, position: "right" }} />
                          <Line type="monotone" dataKey="iri" name="IRI semanal" stroke={PURPLE} strokeWidth={2} dot={{ r: 3, fill: PURPLE }} />
                          <Line type="monotone" dataKey="acumulado" name="IRI acumulado" stroke={PURPLE_LIGHT} strokeWidth={2} strokeDasharray="4 4" dot={false} />
                          <Line type="monotone" dataKey="mejora" name="Mejora T0→T48" stroke={GREEN} strokeWidth={1.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            {["Semana", "Ses. complet.", "Usuarios", "IRI sem.", "Score T0", "Score T48", "Mejora", "IRI acum.", "Hipótesis"].map(h => (
                              <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queriesData.evolucionIri.map((r, i) => (
                            <tr key={i} className="border-b border-border/40 hover:bg-hover transition-colors">
                              <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{r.semana_inicio}</td>
                              <td className="px-3 py-2.5 text-center text-foreground">{r.sesiones_completadas.toString()}</td>
                              <td className="px-3 py-2.5 text-center text-foreground">{r.usuarios_activos.toString()}</td>
                              <td className="px-3 py-2.5 text-center font-semibold" style={{ color: Number(r.avg_iri_semana) >= 70 ? GREEN : Number(r.avg_iri_semana) >= 50 ? AMBER : RED }}>{r.avg_iri_semana.toString()}</td>
                              <td className="px-3 py-2.5 text-center text-foreground">{r.avg_score_t0?.toString() ?? "—"}</td>
                              <td className="px-3 py-2.5 text-center text-foreground">{r.avg_score_t48?.toString() ?? "—"}</td>
                              <td className="px-3 py-2.5 text-center text-foreground">{r.avg_mejora?.toString() ?? "—"}</td>
                              <td className="px-3 py-2.5 text-center font-semibold text-main-purple">{r.iri_acumulado.toString()}</td>
                              <td className="px-3 py-2.5 whitespace-nowrap">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.estado_hipotesis === "Hipótesis validada" ? "bg-green-500/15 text-green-500" : r.estado_hipotesis === "Hipótesis parcial" ? "bg-amber-500/15 text-amber-500" : "bg-red-500/15 text-red-400"}`}>
                                  {r.estado_hipotesis}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
