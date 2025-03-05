"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<{ id: number; name: string; description: string }[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const addTask = async () => {
    if (!name.trim()) return alert("Le nom de la tâche est requis !");
    
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setName("");
      setDescription("");
    }
  };

  const deleteTask = async (id: number) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-2xl font-bold mb-4">Ma To-Do List</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nom de la tâche"
          className="border p-2 mr-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="border p-2 mr-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={addTask}>
          Ajouter
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center border-b py-2">
            <div>
              <strong>{task.name}</strong> - {task.description}
            </div>
            <button className="bg-red-500 text-white px-2 py-1" onClick={() => deleteTask(task.id)}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
