"use client";

import MonthGrid from "@/features/web/calendar/components/month";
import { makeDaysList } from "@/features/web/calendar/utils/helpers";
import Task from "@/features/web/calendar/components/task";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const months = [
    { label: "Janeiro", days: makeDaysList(31) },
    { label: "Fevereiro", days: makeDaysList(28) },
    { label: "Março", days: makeDaysList(31) },
    { label: "Abril", days: makeDaysList(30) },
    { label: "Maio", days: makeDaysList(31) },
    { label: "Junho", days: makeDaysList(30) },
    { label: "Julho", days: makeDaysList(31) },
    { label: "Agosto", days: makeDaysList(31) },
    { label: "Setembro", days: makeDaysList(30) },
    { label: "Outubro", days: makeDaysList(31) },
    { label: "Novembro", days: makeDaysList(30) },
    { label: "Dezembro", days: makeDaysList(31) },
];

export type TaskType = {
    id: string;
    title: string;
    priority: boolean;
    location: string;
    subject: string;
    notification: string;
    description: string;
    date: string; // yyyy-mm-dd (string format para facilitar chave)
};

export default function Calendar() {
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [tasks, setTasks] = useState<TaskType[]>([]);

    // Carrega tarefas do localStorage para o mês/ano selecionado
    useEffect(() => {
        const saved = localStorage.getItem(`tasks-${year}-${month}`);
        if (saved) {
            setTasks(JSON.parse(saved));
        } else {
            setTasks([]);
        }
    }, [month, year]);

    // Salvar no localStorage ao alterar tasks
    useEffect(() => {
        localStorage.setItem(`tasks-${year}-${month}`, JSON.stringify(tasks));
    }, [tasks, month, year]);

    const handleDayClick = (day: number) => {
        const date = new Date(year, month, day);
        setSelectedDate(date);
    };

    const handleSaveTask = (newTask: TaskType) => {
        setTasks((oldTasks) => {
            // Se id já existe, atualiza, senão adiciona
            const existingIndex = oldTasks.findIndex(t => t.id === newTask.id);
            if (existingIndex >= 0) {
                const updated = [...oldTasks];
                updated[existingIndex] = newTask;
                return updated;
            }
            return [...oldTasks, newTask];
        });
        setSelectedDate(null);
    };

    const handleDeleteTask = (id: string) => {
        setTasks((oldTasks) => oldTasks.filter(t => t.id !== id));
    };

    // Filtra tarefas do dia selecionado para edição
    const selectedDateStr = selectedDate
        ? selectedDate.toISOString().slice(0, 10)
        : null;
    const taskForSelectedDate = selectedDateStr
        ? tasks.find(t => t.date === selectedDateStr) ?? null
        : null;

    return (
        <div className="h-screen overflow-y-auto w-full space-y-5 flex items-start px-6 py-6 gap-10">
            <div className="w-[55%] mx-auto">
                <div className="w-full flex justify-between mb-4">
                    <h1 className="text-2xl font-semibold">
                        {months[month].label} {year}
                    </h1>
                    <div className="[&>*]:inline-block flex w-[200px] justify-between items-center select-none">
                        <ChevronLeft
                            size={20}
                            className="cursor-pointer"
                            onClick={() => {
                                setMonth(m => {
                                    if (m === 0) {
                                        setYear(y => y - 1);
                                        return 11;
                                    }
                                    return m - 1;
                                });
                            }}
                        />
                        <span>
                            {months[month].label}, {year}
                        </span>
                        <ChevronRight
                            size={20}
                            className="cursor-pointer"
                            onClick={() => {
                                setMonth(m => {
                                    if (m === 11) {
                                        setYear(y => y + 1);
                                        return 0;
                                    }
                                    return m + 1;
                                });
                            }}
                        />
                    </div>
                </div>
                <MonthGrid
                    days={months[month].days}
                    className="!size-full"
                    onDayClick={handleDayClick}
                />
            </div>

            <div className="w-[40%] max-h-[90vh] overflow-y-auto bg-[#1f2027] p-4 rounded-lg shadow-lg text-white">
                <h2 className="text-xl font-bold mb-4">Tarefas do mês</h2>
                {tasks.length === 0 && (
                    <p className="text-gray-400">Nenhuma tarefa para este mês.</p>
                )}
                {tasks.length > 0 && (
                    <ul className="space-y-3 max-h-[80vh] overflow-y-auto">
                        {tasks
                            .sort((a, b) => a.date.localeCompare(b.date))
                            .map(task => (
                                <li
                                    key={task.id}
                                    className="p-3 bg-[#2a2b35] rounded cursor-pointer hover:bg-[#35C0D2] transition-colors"
                                    onClick={() => {
                                        setSelectedDate(new Date(task.date));
                                    }}
                                >
                                    <div className="flex justify-between">
                                        <span className="font-semibold">
                                            {task.title || "(Sem título)"}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTask(task.id);
                                            }}
                                            className="text-red-500 font-bold hover:text-red-700"
                                            title="Excluir tarefa"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-300">
                                        {task.date}
                                    </div>
                                </li>
                            ))}
                    </ul>
                )}
            </div>

            {selectedDate && (
                <Task
                    selectedDate={selectedDate}
                    onClose={() => setSelectedDate(null)}
                    onSave={handleSaveTask}
                    existingTask={taskForSelectedDate}
                />
            )}
        </div>
    );
}
