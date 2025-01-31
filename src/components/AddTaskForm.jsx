import React, { useState } from "react";
import { useForm } from "react-hook-form";

export const AddTaskForm = ({ addTask }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    console.log(errors);

    const [task, setTask] = useState({
        Task: "",
        DayTime: "",
        Reminder: false,
    });

    // Validation Schema
    const validationSchema = {
        Task: {
            required: "Task is required",
        },

        DayTime: {
            required: "Day & Time is required",
        },
    };

    // Handle Change
    const submitHandler = (data) => {
        console.log(data);

        // Add Task to the List
        addTask(data);

        // Clear the Form
        reset();

        // Reset the Task
        setTask({
            Task: "",
            DayTime: "",
            Reminder: false,
        });
    };

    // Handle Change
    const handleChange = (e) => {
        // console.log(e.target); // {name: "Task", value: "Doctors Appointment", type: "text",checked , placeholder: "Add Task"}
        const {name, value, type, checked } = e.target;
        const newTask = (prevTask) => {
            return {
                ...prevTask,
                [name]:type === "checkbox" ? checked : value,
            }
        }
        setTask(newTask);
    }

    return (
        <div>
            <form className="add-form" onSubmit={handleSubmit(submitHandler)}>
                <div className="form-control">
                    <label htmlFor="Task">Task</label>
                    <input type="text" name="Task" placeholder="Add Task" {...register("Task", validationSchema.Task)} onChange={(e) => {handleChange(e)}}/>
                    {errors.Task && <p style={{ color: "red" }}>{errors.Task.message}</p>}
                </div>
                <div className="form-control">
                    <label htmlFor="DayTime">Day & Time</label>
                    <input type="text" name="DayTime" placeholder="Add Day & Time" {...register("DayTime", validationSchema.DayTime)}  onChange={(e) => {handleChange(e)}}/>
                    {errors.DayTime && <p style={{ color: "red" }}>{errors.DayTime.message}</p>}
                </div>
                <div className="form-control form-control-check">
                    <label htmlFor="Reminder">Set Reminder</label>
                    <input type="checkbox" name="Reminder" {...register("Reminder")} onChange={(e) => {handleChange(e)}}  checked={task.Reminder} />
                </div>
                <input type="submit" value="Save Task" className="btn btn-block" />
            </form>
        </div>
    );
};
