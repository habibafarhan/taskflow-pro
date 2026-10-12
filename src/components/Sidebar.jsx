import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronsLeft,
  ChevronsRight,
  KanbanSquare,
  Languages,
  LayoutDashboard,
  Menu,
  Moon,
  Sun,
  X,
  Zap,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useTasks } from '../context/TaskContext'
import { useTheme } from '../context/ThemeContext'

const NAV_ITEMS = [
  { to: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard, end: true },
  { to: '/board', labelKey: 'nav.board', icon: KanbanSquare, end: false },
]

const SIDEBAR_WIDTH = { expanded: 272, collapsed: 80 }

const getLabelMotion = (isRTL) => {
  const offset = isRTL ? 8 : -8
  return {
    initial: { opacity: 0, x: offset },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: offset },
    transition: { duration: 0.18 },
  }
}

function Brand({ isCollapsed }) {
  const { t, isRTL } = useLanguage()

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
        <Zap size={20} strokeWidth={2.5} />
      </div>
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div {...getLabelMotion(isRTL)} className="overflow-hidden whitespace-nowrap">
            <p
              dir="ltr"
              className="text-base font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white rtl:text-right"
            >
              TaskFlow <span className="text-indigo-600 dark:text-indigo-400">PRO</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('app.tagline')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NavItem({ item, isCollapsed, badge, indicatorId, onNavigate }) {
  const { t, isRTL } = useLanguage()
  const Icon = item.icon
  const label = t(item.labelKey)

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      title={isCollapsed ? label : undefined}
      className="group relative block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId={indicatorId}
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/25 rtl:bg-gradient-to-l"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <span
            className={`relative z-10 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isCollapsed ? 'justify-center' : ''
            } ${
              isActive
                ? 'text-white'
                : 'text-slate-600 group-hover:bg-slate-100 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:bg-slate-800/70 dark:group-hover:text-white'
            }`}
          >
            <Icon size={20} className="shrink-0" />
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span {...getLabelMotion(isRTL)} className="flex-1 whitespace-nowrap">
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
            {!isCollapsed && badge > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
                }`}
              >
                {badge}
              </span>
            )}
          </span>
        </>
      )}
    </NavLink>
  )
}

function ProgressCard({ completionRate, completed, total }) {
  const { t, isRTL } = useLanguage()

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-600 dark:text-slate-300">{t('progress.title')}</span>
        <span className="text-indigo-600 dark:text-indigo-400">{completionRate}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 ${
            isRTL ? 'mr-0 ml-auto' : ''
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${completionRate}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {t('progress.summary', { completed, total })}
      </p>
    </div>
  )
}

function FooterButton({ icon: Icon, label, isCollapsed, onClick, ariaLabel }) {
  const { isRTL } = useLanguage()

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      title={isCollapsed ? label : undefined}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white ${
        isCollapsed ? 'justify-center' : ''
      }`}
    >
      <Icon size={20} className="shrink-0" />
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.span {...getLabelMotion(isRTL)} className="whitespace-nowrap">
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

function SidebarContent({ isCollapsed, indicatorId, onNavigate, onToggleCollapse, onClose }) {
  const { stats } = useTasks()
  const { isDark, toggleTheme } = useTheme()
  const { t, isRTL, toggleLanguage } = useLanguage()
  const activeTasksCount = stats.todo + stats.inProgress

  const badgeByRoute = { '/board': activeTasksCount }

  const CollapseIcon = isCollapsed
    ? isRTL
      ? ChevronsLeft
      : ChevronsRight
    : isRTL
      ? ChevronsRight
      : ChevronsLeft

  return (
    <div className="flex h-full flex-col">
      <div
        className={`flex h-16 shrink-0 items-center border-b border-slate-200 px-4 dark:border-slate-800 ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        <Brand isCollapsed={isCollapsed} />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={t('nav.closeMenu')}
            className="rounded-lg p-2 text-slate-500 outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4" aria-label={t('nav.main')}>
        {!isCollapsed && (
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {t('nav.workspace')}
          </p>
        )}
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            isCollapsed={isCollapsed}
            badge={badgeByRoute[item.to]}
            indicatorId={indicatorId}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="shrink-0 space-y-1.5 border-t border-slate-200 p-3 dark:border-slate-800">
        {!isCollapsed && (
          <div className="pb-1.5">
            <ProgressCard
              completionRate={stats.completionRate}
              completed={stats.completed}
              total={stats.total}
            />
          </div>
        )}

        <FooterButton
          icon={Languages}
          label={t('lang.switch')}
          ariaLabel={t('lang.toggleAria')}
          isCollapsed={isCollapsed}
          onClick={toggleLanguage}
        />

        <FooterButton
          icon={isDark ? Sun : Moon}
          label={isDark ? t('theme.light') : t('theme.dark')}
          ariaLabel={t('theme.toggle')}
          isCollapsed={isCollapsed}
          onClick={toggleTheme}
        />

        {onToggleCollapse && (
          <FooterButton
            icon={CollapseIcon}
            label={isCollapsed ? t('nav.expand') : t('nav.collapse')}
            ariaLabel={isCollapsed ? t('nav.expandAria') : t('nav.collapseAria')}
            isCollapsed={isCollapsed}
            onClick={onToggleCollapse}
          />
        )}
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const { t, isRTL, toggleLanguage } = useLanguage()

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isMobileOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMobileOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileOpen])

  const iconButtonClass =
    'rounded-lg p-2 text-slate-600 outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-800'

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="hidden h-full shrink-0 overflow-hidden border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-900 rtl:border-l rtl:border-r-0"
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          indicatorId="desktop-active-indicator"
          onToggleCollapse={() => setIsCollapsed((current) => !current)}
        />
      </motion.aside>

      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl lg:hidden dark:border-slate-800 dark:bg-slate-900/80">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-label={t('nav.openMenu')}
          className={iconButtonClass}
        >
          <Menu size={22} />
        </button>

        <Brand isCollapsed={false} />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t('lang.toggleAria')}
            className={iconButtonClass}
          >
            <Languages size={20} />
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t('theme.toggle')}
            className={iconButtonClass}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              key="sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              key="sidebar-drawer"
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className={`fixed inset-y-0 z-50 w-72 max-w-[85vw] border-slate-200 bg-white shadow-2xl lg:hidden dark:border-slate-800 dark:bg-slate-900 ${
                isRTL ? 'right-0 border-l' : 'left-0 border-r'
              }`}
            >
              <SidebarContent
                isCollapsed={false}
                indicatorId="mobile-active-indicator"
                onNavigate={() => setIsMobileOpen(false)}
                onClose={() => setIsMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}