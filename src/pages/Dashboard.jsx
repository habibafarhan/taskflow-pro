import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  Inbox,
  ListTodo,
  Plus,
  RotateCcw,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useTasks } from '../context/TaskContext'
import { useTheme } from '../context/ThemeContext'
import { COLUMNS, PRIORITY_BADGE_STYLES, TASK_STATUS } from '../data/constants'
import { weeklyVelocity } from '../data/mockData'

const STATUS_COLORS = {
  [TASK_STATUS.TODO]: '#6366f1',
  [TASK_STATUS.IN_PROGRESS]: '#f59e0b',
  [TASK_STATUS.COMPLETED]: '#10b981',
}

const CHART_THEME = {
  light: { grid: '#e2e8f0', axis: '#64748b' },
  dark: { grid: '#1e293b', axis: '#94a3b8' },
}

const STAT_ACCENTS = {
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const isOverdue = (isoDate) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(`${isoDate}T00:00:00`) < today
}

const getFirstName = (fullName) => fullName.split(' ')[0]

function Card({ title, subtitle, className = '', children }) {
  return (
    <motion.section
      variants={itemVariants}
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {children}
    </motion.section>
  )
}

function StatCard({ label, value, hint, icon: Icon, accent }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${STAT_ACCENTS[accent]}`}>
          <Icon size={22} />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
    </motion.div>
  )
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-xl dark:border-slate-700 dark:bg-slate-800">
      {label && <p className="mb-1 font-semibold text-slate-900 dark:text-white">{label}</p>}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color || (entry.payload && entry.payload.color) }}
          />
          <span>{entry.name}:</span>
          <span className="font-semibold text-slate-900 dark:text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

function EmptyDashboard({ onLoadDemo }) {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/50"
    >
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
        <Inbox size={36} />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('dashboard.empty.title')}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{t('dashboard.empty.text')}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/board"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-[1.03] rtl:bg-gradient-to-l"
        >
          <Plus size={18} />
          {t('dashboard.empty.create')}
        </Link>
        <button
          type="button"
          onClick={onLoadDemo}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RotateCcw size={16} />
          {t('dashboard.empty.loadSample')}
        </button>
      </div>
    </motion.div>
  )
}

function UpcomingDeadlines({ tasks }) {
  const { t, formatDate, translateName, getTaskContent } = useLanguage()

  if (tasks.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <CheckCircle2 size={32} className="mb-2 text-emerald-500" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t('dashboard.deadlines.caughtUp')}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.deadlines.none')}</p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => {
        const overdue = isOverdue(task.dueDate)
        const params = {
          date: formatDate(task.dueDate),
          name: getFirstName(translateName(task.assignee)),
        }

        return (
          <li
            key={task.id}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                overdue ? STAT_ACCENTS.rose : STAT_ACCENTS.indigo
              }`}
            >
              {overdue ? <AlertTriangle size={18} /> : <CalendarClock size={18} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {getTaskContent(task).title}
              </p>
              <p
                className={`text-xs ${
                  overdue ? 'font-medium text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {overdue ? t('dashboard.deadlines.overdueOn', params) : t('dashboard.deadlines.dueOn', params)}
              </p>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
                PRIORITY_BADGE_STYLES[task.priority]
              }`}
            >
              {t(`priority.${task.priority}`)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default function Dashboard() {
  const { tasks, stats, resetTasks } = useTasks()
  const { isDark } = useTheme()
  const { t, isRTL, formatDate, translateName } = useLanguage()
  const chartColors = isDark ? CHART_THEME.dark : CHART_THEME.light

  const chartMargin = isRTL
    ? { top: 8, right: -20, left: 8, bottom: 0 }
    : { top: 8, right: 8, left: -20, bottom: 0 }

  const velocityData = useMemo(
    () => weeklyVelocity.map((entry) => ({ ...entry, label: formatDate(entry.date) })),
    [formatDate],
  )

  const statusData = useMemo(
    () =>
      COLUMNS.map((column) => ({
        id: column.id,
        name: t(`status.${column.id}`),
        value: tasks.filter((task) => task.status === column.id).length,
        color: STATUS_COLORS[column.id],
      })).filter((entry) => entry.value > 0),
    [tasks, t],
  )

  const workloadData = useMemo(() => {
    const byAssignee = tasks.reduce((accumulator, task) => {
      const key = getFirstName(task.assignee)
      if (!accumulator[key]) {
        accumulator[key] = {
          name: getFirstName(translateName(task.assignee)),
          [TASK_STATUS.TODO]: 0,
          [TASK_STATUS.IN_PROGRESS]: 0,
          [TASK_STATUS.COMPLETED]: 0,
        }
      }
      accumulator[key][task.status] += 1
      return accumulator
    }, {})
    return Object.values(byAssignee)
  }, [tasks, translateName])

  const upcomingTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.status !== TASK_STATUS.COMPLETED && task.dueDate)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 4),
    [tasks],
  )

  const axisProps = {
    stroke: chartColors.axis,
    tickLine: false,
    axisLine: false,
    fontSize: 12,
  }

  const xAxisProps = { ...axisProps, reversed: isRTL }
  const yAxisProps = { ...axisProps, orientation: isRTL ? 'right' : 'left' }

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {t('dashboard.title')}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('dashboard.subtitle')}</p>
        </div>
        <Link
          to="/board"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-[1.03] rtl:bg-gradient-to-l"
        >
          <Plus size={18} />
          {t('dashboard.newTask')}
        </Link>
      </motion.div>

      {tasks.length === 0 ? (
        <EmptyDashboard onLoadDemo={resetTasks} />
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label={t('dashboard.stats.total')}
              value={stats.total}
              hint={t('dashboard.stats.totalHint', { rate: stats.completionRate })}
              icon={ListTodo}
              accent="indigo"
            />
            <StatCard
              label={t('dashboard.stats.inProgress')}
              value={stats.inProgress}
              hint={t('dashboard.stats.inProgressHint', { count: stats.todo })}
              icon={Clock}
              accent="amber"
            />
            <StatCard
              label={t('dashboard.stats.completed')}
              value={stats.completed}
              hint={t('dashboard.stats.completedHint')}
              icon={CheckCircle2}
              accent="emerald"
            />
            <StatCard
              label={t('dashboard.stats.highPriority')}
              value={stats.highPriority}
              hint={t('dashboard.stats.highPriorityHint')}
              icon={AlertTriangle}
              accent="rose"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card
              title={t('dashboard.velocity.title')}
              subtitle={t('dashboard.velocity.subtitle')}
              className="lg:col-span-2"
            >
              <div className="h-72" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={velocityData} margin={chartMargin}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                    <XAxis dataKey="label" {...xAxisProps} />
                    <YAxis {...yAxisProps} />
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: chartColors.grid }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="created"
                      name={t('dashboard.velocity.created')}
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      name={t('dashboard.velocity.completed')}
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title={t('dashboard.status.title')} subtitle={t('dashboard.status.subtitle')}>
              <div className="relative h-72" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="60%"
                      outerRadius="85%"
                      paddingAngle={4}
                      stroke="none"
                    >
                      {statusData.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-x-0 top-[38%] text-center">
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.total}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.status.total')}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card
              title={t('dashboard.workload.title')}
              subtitle={t('dashboard.workload.subtitle')}
              className="lg:col-span-2"
            >
              <div className="h-72" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workloadData} margin={chartMargin}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                    <XAxis dataKey="name" {...xAxisProps} />
                    <YAxis allowDecimals={false} {...yAxisProps} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: chartColors.grid, opacity: 0.4 }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Bar
                      dataKey={TASK_STATUS.TODO}
                      name={t('status.todo')}
                      stackId="workload"
                      fill={STATUS_COLORS[TASK_STATUS.TODO]}
                      maxBarSize={44}
                    />
                    <Bar
                      dataKey={TASK_STATUS.IN_PROGRESS}
                      name={t('status.in-progress')}
                      stackId="workload"
                      fill={STATUS_COLORS[TASK_STATUS.IN_PROGRESS]}
                      maxBarSize={44}
                    />
                    <Bar
                      dataKey={TASK_STATUS.COMPLETED}
                      name={t('status.completed')}
                      stackId="workload"
                      fill={STATUS_COLORS[TASK_STATUS.COMPLETED]}
                      radius={[6, 6, 0, 0]}
                      maxBarSize={44}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title={t('dashboard.deadlines.title')} subtitle={t('dashboard.deadlines.subtitle')}>
              <UpcomingDeadlines tasks={upcomingTasks} />
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  )
}