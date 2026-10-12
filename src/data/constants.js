export const STORAGE_KEYS = {
    TASKS: 'taskflow-pro:tasks',
    THEME: 'taskflow-pro:theme',
    LANGUAGE: 'taskflow-pro:language',
  }
  
  export const TASK_STATUS = {
    TODO: 'todo',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
  }
  
  export const PRIORITY = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
  }
  
  export const COLUMNS = [
    { id: TASK_STATUS.TODO, title: 'To Do' },
    { id: TASK_STATUS.IN_PROGRESS, title: 'In Progress' },
    { id: TASK_STATUS.COMPLETED, title: 'Completed' },
  ]
  
  export const PRIORITY_OPTIONS = [
    { value: PRIORITY.HIGH, label: 'High' },
    { value: PRIORITY.MEDIUM, label: 'Medium' },
    { value: PRIORITY.LOW, label: 'Low' },
  ]
  export const PRIORITY_BADGE_STYLES = {
    [PRIORITY.HIGH]:
      'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30',
    [PRIORITY.MEDIUM]:
      'bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30',
    [PRIORITY.LOW]:
      'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
  }