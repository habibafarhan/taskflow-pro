/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
  } from 'react'
  import { PRIORITY, STORAGE_KEYS, TASK_STATUS } from '../data/constants'
  import { initialTasks } from '../data/mockData'
  
  const TaskContext = createContext(null)
  
  const ACTIONS = {
    ADD: 'task/add',
    UPDATE: 'task/update',
    DELETE: 'task/delete',
    MOVE: 'task/move',
    RESET: 'task/reset',
  }
  
  const loadTasksFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS)
      if (!stored) return initialTasks
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : initialTasks
    } catch (error) {
      console.error('Failed to read tasks from localStorage:', error)
      return initialTasks
    }
  }
  
  const moveTaskInList = (tasks, { taskId, destinationStatus, destinationIndex }) => {
    const taskToMove = tasks.find((task) => task.id === taskId)
    if (!taskToMove) return tasks
  
    const remainingTasks = tasks.filter((task) => task.id !== taskId)
    const destinationTasks = remainingTasks.filter((task) => task.status === destinationStatus)
    const otherTasks = remainingTasks.filter((task) => task.status !== destinationStatus)
  
    destinationTasks.splice(destinationIndex, 0, { ...taskToMove, status: destinationStatus })
  
    return [...otherTasks, ...destinationTasks]
  }
  
  const taskReducer = (tasks, action) => {
    switch (action.type) {
      case ACTIONS.ADD:
        return [action.payload, ...tasks]
      case ACTIONS.UPDATE:
        return tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task,
        )
      case ACTIONS.DELETE:
        return tasks.filter((task) => task.id !== action.payload)
      case ACTIONS.MOVE:
        return moveTaskInList(tasks, action.payload)
      case ACTIONS.RESET:
        return initialTasks
      default:
        return tasks
    }
  }
  
  const createTask = ({
    title,
    description = '',
    priority = PRIORITY.MEDIUM,
    status = TASK_STATUS.TODO,
    assignee = 'Unassigned',
    dueDate = '',
  }) => ({
    id: crypto.randomUUID(),
    title: title.trim(),
    description: description.trim(),
    priority,
    status,
    assignee,
    dueDate,
    createdAt: new Date().toISOString(),
  })
  
  const calculateStats = (tasks) => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.status === TASK_STATUS.COMPLETED).length
    const inProgress = tasks.filter((task) => task.status === TASK_STATUS.IN_PROGRESS).length
    const todo = tasks.filter((task) => task.status === TASK_STATUS.TODO).length
    const highPriority = tasks.filter(
      (task) => task.priority === PRIORITY.HIGH && task.status !== TASK_STATUS.COMPLETED,
    ).length
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)
  
    return { total, completed, inProgress, todo, highPriority, completionRate }
  }
  
  export function TaskProvider({ children }) {
    const [tasks, dispatch] = useReducer(taskReducer, undefined, loadTasksFromStorage)
  
    useEffect(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
      } catch (error) {
        console.error('Failed to save tasks to localStorage:', error)
      }
    }, [tasks])
  
    const addTask = useCallback((taskData) => {
      dispatch({ type: ACTIONS.ADD, payload: createTask(taskData) })
    }, [])
  
    const updateTask = useCallback((id, updates) => {
      dispatch({ type: ACTIONS.UPDATE, payload: { id, updates } })
    }, [])
  
    const deleteTask = useCallback((id) => {
      dispatch({ type: ACTIONS.DELETE, payload: id })
    }, [])
  
    const moveTask = useCallback((taskId, destinationStatus, destinationIndex) => {
      dispatch({ type: ACTIONS.MOVE, payload: { taskId, destinationStatus, destinationIndex } })
    }, [])
  
    const resetTasks = useCallback(() => {
      dispatch({ type: ACTIONS.RESET })
    }, [])
  
    const getTasksByStatus = useCallback(
      (status) => tasks.filter((task) => task.status === status),
      [tasks],
    )
  
    const stats = useMemo(() => calculateStats(tasks), [tasks])
  
    const value = useMemo(
      () => ({
        tasks,
        stats,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        resetTasks,
        getTasksByStatus,
      }),
      [tasks, stats, addTask, updateTask, deleteTask, moveTask, resetTasks, getTasksByStatus],
    )
  
    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
  }
  
  export function useTasks() {
    const context = useContext(TaskContext)
    if (!context) {
      throw new Error('useTasks must be used within a TaskProvider')
    }
    return context
  }