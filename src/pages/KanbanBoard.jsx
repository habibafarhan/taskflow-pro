import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useTasks } from '../context/TaskContext'
import {
  COLUMNS,
  PRIORITY,
  PRIORITY_BADGE_STYLES,
  PRIORITY_OPTIONS,
  TASK_STATUS,
} from '../data/constants'

const TEAM_MEMBERS = [
  'Sarah Mitchell',
  'James Carter',
  'Emily Johnson',
  'Daniel Brooks',
  'Olivia Turner',
  'Michael Reed',
]

const COLUMN_META = {
  [TASK_STATUS.TODO]: { icon: ListTodo, dot: 'bg-indigo-500' },
  [TASK_STATUS.IN_PROGRESS]: { icon: Clock, dot: 'bg-amber-500' },
  [TASK_STATUS.COMPLETED]: { icon: CheckCircle2, dot: 'bg-emerald-500' },
}

const PRIORITY_ACTIVE_STYLES = {
  [PRIORITY.HIGH]: 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  [PRIORITY.MEDIUM]: 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  [PRIORITY.LOW]:
    'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
}

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500'

const PRIMARY_BUTTON_CLASS =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 rtl:bg-gradient-to-l'

const toInputDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getDefaultDueDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return toInputDate(date)
}

const isOverdue = (isoDate) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(`${isoDate}T00:00:00`) < today
}

const getInitials = (fullName) =>
  fullName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

function TaskCard({ task, index, onDelete }) {
  const { t, formatDate, translateName, getTaskContent } = useLanguage()
  const [isRemoving, setIsRemoving] = useState(false)
  const content = getTaskContent(task)
  const assigneeName = translateName(task.assignee)
  const showOverdue =
    task.status !== TASK_STATUS.COMPLETED && Boolean(task.dueDate) && isOverdue(task.dueDate)

  const handleAnimationComplete = () => {
    if (isRemoving) onDelete(task.id)
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <motion.article
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isRemoving ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={handleAnimationComplete}
            className={`group rounded-xl border bg-white p-4 transition-shadow dark:bg-slate-800 ${
              snapshot.isDragging
                ? 'border-indigo-400 shadow-2xl ring-2 ring-indigo-500/40 dark:border-indigo-500'
                : 'border-slate-200 shadow-sm hover:shadow-md dark:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
                  PRIORITY_BADGE_STYLES[task.priority]
                }`}
              >
                {t(`priority.${task.priority}`)}
              </span>
              <button
                type="button"
                onClick={() => setIsRemoving(true)}
                aria-label={t('board.deleteTask', { title: content.title })}
                className="-mr-1 -mt-1 rounded-lg p-1.5 text-slate-400 outline-none transition hover:bg-rose-50 hover:text-rose-600 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-rose-500 sm:opacity-0 sm:group-hover:opacity-100 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 rtl:-ml-1 rtl:mr-0"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <h3 className="mt-3 text-sm font-semibold leading-snug text-slate-900 dark:text-white">
              {content.title}
            </h3>
            {content.description && (
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {content.description}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between gap-2">
              <div
                className={`flex items-center gap-1.5 text-xs ${
                  showOverdue
                    ? 'font-semibold text-rose-600 dark:text-rose-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {showOverdue ? <AlertTriangle size={14} /> : <CalendarDays size={14} />}
                <span>{task.dueDate ? formatDate(task.dueDate) : t('board.noDueDate')}</span>
              </div>
              <div
                title={assigneeName}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white"
              >
                {getInitials(assigneeName)}
              </div>
            </div>
          </motion.article>
        </div>
      )}
    </Draggable>
  )
}

function ColumnEmptyState({ columnId, icon: Icon, onAddTask }) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-4 py-8 text-center dark:border-slate-700">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon size={22} />
      </div>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {t(`board.empty.${columnId}.title`)}
      </p>
      <p className="mt-1 max-w-[200px] text-xs text-slate-500 dark:text-slate-400">
        {t(`board.empty.${columnId}.text`)}
      </p>
      <button
        type="button"
        onClick={onAddTask}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-indigo-600 outline-none transition hover:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
      >
        <Plus size={14} />
        {t('board.addTask')}
      </button>
    </div>
  )
}

function Column({ column, tasks, onAddTask, onDeleteTask }) {
  const { t } = useLanguage()
  const meta = COLUMN_META[column.id]
  const columnTitle = t(`status.${column.id}`)

  return (
    <section
      aria-label={columnTitle}
      className="flex min-h-[340px] flex-col rounded-2xl border border-slate-200 bg-slate-100/70 p-3 dark:border-slate-800 dark:bg-slate-900/60"
    >
      <header className="mb-3 flex items-center justify-between px-1.5">
        <div className="flex items-center gap-2.5">
          <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{columnTitle}</h2>
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onAddTask}
          aria-label={t('board.addToColumn', { column: columnTitle })}
          className="rounded-lg p-1.5 text-slate-500 outline-none transition hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <Plus size={18} />
        </button>
      </header>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-1 flex-col gap-3 rounded-xl p-1 transition-colors ${
              snapshot.isDraggingOver ? 'bg-indigo-500/10 ring-2 ring-inset ring-indigo-400/40' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onDelete={onDeleteTask} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <ColumnEmptyState columnId={column.id} icon={meta.icon} onAddTask={onAddTask} />
            )}
          </div>
        )}
      </Droppable>
    </section>
  )
}

function Field({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  )
}

function AddTaskModal({ defaultStatus, onClose, onSubmit }) {
  const { t, translateName } = useLanguage()
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: PRIORITY.MEDIUM,
    assignee: TEAM_MEMBERS[0],
    dueDate: getDefaultDueDate(),
    status: defaultStatus,
  })
  const [titleError, setTitleError] = useState('')

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (field === 'title') setTitleError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      setTitleError(t('modal.titleRequired'))
      return
    }
    onSubmit(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-task-title"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 id="add-task-title" className="text-lg font-bold text-slate-900 dark:text-white">
              {t('modal.title')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('modal.subtitle')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('modal.close')}
            className="rounded-lg p-2 text-slate-500 outline-none transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field label={t('modal.fieldTitle')} htmlFor="task-title" error={titleError}>
            <input
              id="task-title"
              type="text"
              autoFocus
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder={t('modal.titlePlaceholder')}
              className={`${INPUT_CLASS} ${titleError ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30' : ''}`}
            />
          </Field>

          <Field label={t('modal.description')} htmlFor="task-description">
            <textarea
              id="task-description"
              rows={3}
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder={t('modal.descriptionPlaceholder')}
              className={`${INPUT_CLASS} resize-none`}
            />
          </Field>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('modal.priority')}
            </span>
            <div role="radiogroup" aria-label={t('modal.priority')} className="grid grid-cols-3 gap-2">
              {PRIORITY_OPTIONS.map((option) => {
                const isActive = form.priority === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => updateField('priority', option.value)}
                    className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      isActive
                        ? PRIORITY_ACTIVE_STYLES[option.value]
                        : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    {t(`priority.${option.value}`)}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t('modal.assignee')} htmlFor="task-assignee">
              <select
                id="task-assignee"
                value={form.assignee}
                onChange={(event) => updateField('assignee', event.target.value)}
                className={INPUT_CLASS}
              >
                {TEAM_MEMBERS.map((member) => (
                  <option key={member} value={member}>
                    {translateName(member)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t('modal.dueDate')} htmlFor="task-due-date">
              <input
                id="task-due-date"
                type="date"
                value={form.dueDate}
                onChange={(event) => updateField('dueDate', event.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
          </div>

          <Field label={t('modal.column')} htmlFor="task-status">
            <select
              id="task-status"
              value={form.status}
              onChange={(event) => updateField('status', event.target.value)}
              className={INPUT_CLASS}
            >
              {COLUMNS.map((column) => (
                <option key={column.id} value={column.id}>
                  {t(`status.${column.id}`)}
                </option>
              ))}
            </select>
          </Field>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {t('modal.cancel')}
            </button>
            <button type="submit" className={PRIMARY_BUTTON_CLASS}>
              <Plus size={18} />
              {t('modal.create')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function KanbanBoard() {
  const { t } = useLanguage()
  const { stats, addTask, deleteTask, moveTask, getTasksByStatus } = useTasks()
  const [modalStatus, setModalStatus] = useState(null)

  const handleDragEnd = ({ destination, source, draggableId }) => {
    if (!destination) return

    const isSamePosition =
      destination.droppableId === source.droppableId && destination.index === source.index
    if (isSamePosition) return

    moveTask(draggableId, destination.droppableId, destination.index)
  }

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
            {t('board.title')}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('board.subtitle', { count: stats.total })}
          </p>
        </div>
        <button type="button" onClick={() => setModalStatus(TASK_STATUS.TODO)} className={PRIMARY_BUTTON_CLASS}>
          <Plus size={18} />
          {t('board.newTask')}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {COLUMNS.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={getTasksByStatus(column.id)}
                onAddTask={() => setModalStatus(column.id)}
                onDeleteTask={deleteTask}
              />
            ))}
          </div>
        </DragDropContext>
      </motion.div>

      <AnimatePresence>
        {modalStatus && (
          <AddTaskModal
            key="add-task-modal"
            defaultStatus={modalStatus}
            onClose={() => setModalStatus(null)}
            onSubmit={addTask}
          />
        )}
      </AnimatePresence>
    </div>
  )
}