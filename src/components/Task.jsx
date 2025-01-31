import React from "react";
import { FaTimes } from "react-icons/fa";

export const Task = ({ task, handleDelete, toggleReminder }) => {
    return (
        <div>
            <div className={`task ${task.Reminder ? "reminder" : ""}`} onDoubleClick={() => toggleReminder(task.id)}>
                <h3>
                    {task.Task} <FaTimes style={{ color: "red", cursor: "pointer" }} onClick={() => handleDelete(task.id)} />
                </h3>
                <p>{task.DayTime}</p>
            </div>
        </div>
    );
};
