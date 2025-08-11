// src/App.jsx
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import BearTasky from './components/BearTasky';

// --- URL BASE DE LA API ---
// "Hardcodeada" para garantizar que funcione en producción.
const API_BASE_URL = 'https://tareas-backend-aovk.onrender.com';

// --- FUNCIONES Y COMPONENTES DE AYUDA ---
const getLocalYYYYMMDD = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const IconEdit = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg> );
const IconDelete = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg> );

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskyMood, setTaskyMood] = useState('neutral');
  const [dailyStats, setDailyStats] = useState({ completed: 0, total: 0 });
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState(getLocalYYYYMMDD());
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingDate, setEditingDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/tasks`);
        if (!response.ok) throw new Error('La respuesta de la red no fue ok');
        const data = await response.json();
        const formattedTasks = data.map(task => ({ ...task, due_date: task.due_date.slice(0, 10) }));
        setTasks(formattedTasks);
      } catch (error) {
        toast.error('Error al cargar las tareas. ¿El servidor está corriendo?');
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const todayStr = getLocalYYYYMMDD();
    const tasksForToday = tasks.filter(task => task.due_date === todayStr);
    const completedToday = tasksForToday.filter(task => task.is_completed).length;
    const totalToday = tasksForToday.length;
    setDailyStats({ completed: completedToday, total: totalToday });
    const currentHour = new Date().getHours();
    if (tasks.length > 0 && tasks.every(t => t.is_completed)) {
      setTaskyMood('happy'); return;
    }
    const completionPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;
    if (completionPercentage === 100 && totalToday > 0) setTaskyMood('happy');
    else if (currentHour >= 18 && totalToday > 0 && completionPercentage < 50) setTaskyMood('angry');
    else setTaskyMood('neutral');
  }, [tasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return toast.error('La tarea no puede estar vacía.');
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTask, due_date: newDate }),
      });
      const createdTask = await response.json();
      createdTask.due_date = createdTask.due_date.slice(0, 10);
      setTasks([...tasks, createdTask]);
      toast.success('¡Tarea agregada!');
      setNewTask('');
    } catch (error) { toast.error('No se pudo agregar la tarea.'); }
  };

  const handleDeleteTask = async (taskId) => {
    const originalTasks = [...tasks];
    setTasks(tasks.filter(task => task.id !== taskId));
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Fallo al eliminar');
      toast.error('Tarea eliminada.');
    } catch (error) { toast.error('Error al eliminar. Restaurando tarea.'); setTasks(originalTasks); }
  };
  
  const handleToggleComplete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const updatedTaskData = { ...task, is_completed: !task.is_completed };
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTaskData),
      });
      const returnedTask = await response.json();
      returnedTask.due_date = returnedTask.due_date.slice(0, 10);
      setTasks(tasks.map(t => t.id === taskId ? returnedTask : t));
      if (returnedTask.is_completed) toast.success(`¡"${returnedTask.text}" completada!`, { icon: '🎉' });
    } catch (error) { toast.error('No se pudo actualizar la tarea.'); }
  };
  
  const handleSaveEdit = async (taskId) => {
    if (editingText.trim() === '') return toast.error('El texto no puede estar vacío.');
    const task = tasks.find(t => t.id === taskId);
    const updatedTaskData = { ...task, text: editingText, due_date: editingDate };
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTaskData),
      });
      const returnedTask = await response.json();
      returnedTask.due_date = returnedTask.due_date.slice(0, 10);
      setTasks(tasks.map(t => t.id === taskId ? returnedTask : t));
      setEditingTaskId(null);
      toast.success('Tarea actualizada.');
    } catch (error) { toast.error('No se pudo guardar la tarea.'); }
  };
  
  const handleStartEdit = (task) => { setEditingTaskId(task.id); setEditingText(task.text); setEditingDate(task.due_date); };
  
  const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchTerm.toLowerCase()));
  const todayStr = getLocalYYYYMMDD();
  const tomorrowStr = getLocalYYYYMMDD(new Date(Date.now() + 86400000));
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const group = task.is_completed ? 'Completadas' : (task.due_date === todayStr ? 'Hoy' : task.due_date === tomorrowStr ? 'Mañana' : 'Próximas');
    if (!acc[group]) acc[group] = [];
    acc[group].push(task);
    return acc;
  }, {});
  
  const groupOrder = ['Hoy', 'Mañana', 'Próximas', 'Completadas'];

  if (loading) {
    return (
      <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl animate-pulse">Cargando tu sistema de tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#334155', color: 'white' } }} />
      <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
        <div className="max-w-7xl mx-auto p-4 sm:p-8">
          <header className="mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-center text-blue-400">Mi Sistema de Tareas</h1>
            <p className="text-center text-slate-400 mt-2">Organiza tu día, conquista tus metas.</p>
          </header>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <aside className="lg:w-1/3">
              <BearTasky mood={taskyMood} stats={dailyStats} />
            </aside>
            <main className="lg:w-2/3">
              <input type="search" placeholder="Buscar tareas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 mb-6 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <div className="p-4 bg-slate-800/50 rounded-lg mb-10">
                <h3 className="font-bold mb-3 text-lg">Nueva Tarea</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                  <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="¿Qué tienes planeado?" className="sm:col-span-3 w-full p-3 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="sm:col-span-2 w-full p-3 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-600/20">Agregar</button>
                </form>
              </div>
              {filteredTasks.length === 0 && searchTerm === '' ? (
                <div className="text-center py-16 px-6 bg-slate-800 rounded-lg">
                    <h3 className="text-2xl font-semibold text-slate-300">¡Todo en orden!</h3>
                    <p className="text-slate-400 mt-2">No tienes tareas pendientes. ¡Añade una para empezar!</p>
                </div>
              ) : (
                groupOrder.map(groupName => groupedTasks[groupName] && (
                  <div key={groupName} className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-400 border-b-2 border-slate-700 pb-2 mb-4">{groupName} ({groupedTasks[groupName].length})</h2>
                    <div className="space-y-3">
                      <AnimatePresence>
                        {groupedTasks[groupName].map(task => (
                          <motion.div key={task.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }} className={`bg-slate-800 p-3 rounded-lg flex items-center shadow-lg transition-all duration-300 ${task.is_completed ? 'opacity-40' : 'hover:bg-slate-700'}`}>
                            <input type="checkbox" checked={task.is_completed} onChange={() => handleToggleComplete(task.id)} className="w-5 h-5 flex-shrink-0 rounded-full text-green-500 bg-slate-700 border-slate-600 focus:ring-green-500 cursor-pointer"/>
                            <div className="flex-grow ml-4">
                              {editingTaskId === task.id ? (
                                <div className="flex flex-col sm:flex-row gap-2 w-full items-center">
                                  <input type="text" value={editingText} onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(task.id)} onChange={(e) => setEditingText(e.target.value)} className="w-full bg-slate-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"/>
                                  <input type="date" value={editingDate} onChange={(e) => setEditingDate(e.target.value)} className="w-full sm:w-auto bg-slate-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"/>
                                </div>
                              ) : ( <span className={`text-lg ${task.is_completed ? 'line-through text-slate-500' : ''}`}>{task.text}</span> )}
                            </div>
                            <div className="flex gap-2 ml-4 flex-shrink-0">
                              {editingTaskId === task.id ? ( <button onClick={() => handleSaveEdit(task.id)} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md font-semibold">Guardar</button> ) : ( <> <button onClick={() => handleStartEdit(task)} className="text-yellow-400 hover:text-yellow-300 p-1 rounded-full hover:bg-slate-700 transition-colors"><IconEdit /></button> <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-slate-700 transition-colors"><IconDelete /></button> </> )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;