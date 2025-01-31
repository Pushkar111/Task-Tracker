import { useEffect, useState } from "react";
// import "./App.css";
import { Header } from "./components/Header";
import { AddTaskForm } from "./components/AddTaskForm";
import "./styles.css"
import { Tasks } from "./components/Tasks";

const getLocalStorage = () => {
    let tasks = localStorage.getItem("allTasks");
    if (tasks) {
        return JSON.parse(tasks); // Convert JSON String to Object
    } else {
        return []; // Return Empty Array
    }
}

function App() {
    // Header Title
    const title = "Task Tracker";
    
    const [showAddedTasks, setShowAddedTasks] = useState(false);
    const [tasks, setTasks] = useState(getLocalStorage());

    // const [tasks, setTasks] = useState([
    // {
    //     id: 1,
    //     Task: "Doctors Appointment",
    //     DayTime: "Feb 5th at 2:30pm",
    //     Reminder: true
    // },
    // {
    //     id: 2,
    //     Task: "Meeting at School",
    //     DayTime: "Feb 6th at 1:30pm",
    //     Reminder: true
    // },
    // {
    //     id: 3,
    //     Task: "Food Shopping",
    //     DayTime: "Feb 5th at 2:30pm",
    //     Reminder: false
    // }]);

    
    
    
    // Show and Hide Task Form
    const showTaskForm = () => {
        setShowAddedTasks(!showAddedTasks);
    };


    // Add Task
    const addTask = (task) => {
        const id = Math.floor(Math.random() * 10000) + 1;

        const newTask = {
            id:id,
            ...task,
        };

        setTasks([...tasks, newTask]);
    }

    // Delete Task
    const deleteTask = (id) => {
        const remainingTasks = tasks.filter((task)=> {
            return task.id !== id;
        })

        setTasks(remainingTasks);
    }

    // Toggle Reminder
    const toggleReminder = (id) => {
        const updatedTasks = tasks.map((task) => {
            return task.id === id ? {...task, Reminder: !task.Reminder} : task;
        })

        setTasks(updatedTasks);
    }


    // Save Tasks to Local Storage
    const saveTasksToLocalStorage = () => {
        localStorage.setItem("allTasks", JSON.stringify(tasks));
    }
    useEffect(saveTasksToLocalStorage, [tasks]);
    

    return (
        <div className="App">
            <Header title={title} onAdd={showTaskForm} showAdd={showAddedTasks}/>
            {
                showAddedTasks && <AddTaskForm addTask={(task) => {addTask(task)}}/>
            }
            {
                tasks.length > 0 ? (
                    <Tasks tasks={tasks} onDelete={deleteTask} toggleReminder={toggleReminder}/>
                ) : (
                    "No Tasks to Show"
                )
            }
        </div>
    );
}

export default App;
