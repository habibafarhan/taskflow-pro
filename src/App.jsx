import { useEffect, useRef } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Compass, LayoutDashboard } from 'lucide-react'
import { TaskProvider } from './context/TaskContext'
import { useLanguage } from './context/LanguageContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import KanbanBoard from './pages/KanbanBoard'

const APP_NAME = 'TaskFlow PRO'

const PAGE_TITLE_KEYS = {
  '/': 'nav.dashboard',
  '/board': 'nav.board',
}

function PageTransition({ children }) {
  const { isRTL } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? -12 : 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function NotFound() {
  const { t, isRTL } = useLanguage()
  const BackIcon = isRTL ? ArrowRight : ArrowLeft

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
          <Compass size={38} />
        </div>
        <p
          dir="ltr"
          className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent"
        >
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{t('notFound.title')}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('notFound.text')}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 rtl:bg-gradient-to-l"
          >
            <LayoutDashboard size={18} />
            {t('notFound.dashboard')}
          </Link>
          <Link
            to="/board"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <BackIcon size={16} />
            {t('notFound.board')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const mainRef = useRef(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0
  }, [location.pathname])

  useEffect(() => {
    const titleKey = PAGE_TITLE_KEYS[location.pathname]
    document.title = titleKey ? `${t(titleKey)} | ${APP_NAME}` : APP_NAME
  }, [location.pathname, language, t])

  return (
    <TaskProvider>
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t('app.skip')}
      </a>

      <div className="flex h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
        <Sidebar />

        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="h-full min-w-0 flex-1 overflow-y-auto pt-16 outline-none lg:pt-0"
        >
          <AnimatePresence exitBeforeEnter>
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
                }
              />
              <Route
                path="/board"
                element={
                  <PageTransition>
                    <KanbanBoard />
                  </PageTransition>
                }
              />
              <Route
                path="*"
                element={
                  <PageTransition>
                    <NotFound />
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </TaskProvider>
  )
}