import React from 'react'
import { Task } from './Task'

export const Tasks = ({tasks, onDelete, toggleReminder}) => {
  return (
    <div>
        {
            tasks.map((task) => {
                return (
                    <Task 
                        key={task.id}
                        task={task}
                        handleDelete={onDelete}
                        toggleReminder={toggleReminder}
                    />
                )
            })
        }
    </div>
  )
}
