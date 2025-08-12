import Image from "next/image";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { TaskType } from "./calendar";

interface TaskProps {
    selectedDate: Date | null;
    onClose: () => void;
    onSave: (task: TaskType) => void;
    existingTask: TaskType | null;
}

const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

export default function Task({ selectedDate, onClose, onSave, existingTask }: TaskProps) {
    // Inicializa estado com dados da tarefa existente, se houver
    const [taskData, setTaskData] = useState<TaskType>(() => {
        if (existingTask) return existingTask;
        return {
            id: crypto.randomUUID(),
            title: "",
            priority: false,
            location: "",
            subject: "",
            notification: "",
            description: "",
            date: selectedDate ? selectedDate.toISOString().slice(0, 10) : "",
        };
    });

    const editorRef = useRef<HTMLDivElement>(null);
    const [isEditorFocused, setIsEditorFocused] = useState(false);

    // Atualiza o editor quando a descrição mudar (ex: ao carregar tarefa existente)
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = taskData.description;
        }
    }, [taskData.description]);

    // Atualiza o estado se a tarefa existente mudar (ex: ao mudar o selectedDate)
    useEffect(() => {
        if (existingTask) {
            setTaskData(existingTask);
        } else if (selectedDate) {
            setTaskData({
                id: crypto.randomUUID(),
                title: "",
                priority: false,
                location: "",
                subject: "",
                notification: "",
                description: "",
                date: selectedDate.toISOString().slice(0, 10),
            });
        }
    }, [existingTask, selectedDate]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target;
        const newValue =
            type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value;
        setTaskData((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleSave = () => {
        if (!taskData.title.trim()) {
            alert("Por favor, adicione um título para a tarefa.");
            return;
        }
        onSave(taskData);
    };

    // Formatação texto (bold, italic, underline)
    const applyBold = () => {
        document.execCommand("bold", false);
        
    };

    const applyItalic = () => {
        document.execCommand("italic", false);
        
    };

    const applyUnderline = () => {
        document.execCommand("underline", false);
      
    };

    // Não renderiza se não tem data selecionada
    if (!selectedDate) return null;

    const formattedDate = `${selectedDate.getDate()} de ${
        months[selectedDate.getMonth()]
    } de ${selectedDate.getFullYear()}`;

    return (
        <div
            className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
        >
            <div
                className="bg-[#464757] rounded-lg shadow-xl w-full max-w-xl p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 border-b border-[#35C0D2] pb-2">
                    <h2 className="text-xl font-bold text-white">TAREFA</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-300 hover:text-gray-500"
                        aria-label="Fechar"
                    >
                        ✕
                    </button>
                </div>

                <div className="text-center mb-4 text-[#35C0D2] font-medium ">
                    {formattedDate}
                </div>

                <div className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Adicionar título"
                        value={taskData.title}
                        onChange={handleChange}
                        className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-cyan-500 bg-transparent text-white"
                        autoFocus
                    />

                    <div className="flex flex-wrap gap-4 items-center">
                        <Image
                            src={"/svg/local.svg"}
                            alt="local"
                            width={20}
                            height={20}
                            priority
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Adicionar local"
                            value={taskData.location}
                            onChange={handleChange}
                            className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:border-cyan-500 bg-transparent text-white"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        <Image
                            src={"/svg/prioridade.svg"}
                            alt="prioridade"
                            width={20}
                            height={20}
                            priority
                        />
                        <select
                            name="priority"
                            value={taskData.priority ? "alta" : "normal"}
                            onChange={(e) =>
                                setTaskData(prev => ({
                                    ...prev,
                                    priority: e.target.value === "alta",
                                }))
                            }
                            className="focus:outline-none text-gray-300 bg-transparent"
                        >
                            <option value="baixa" className="bg-yellow-200">
                                Prioridade Baixa
                            </option>
                            <option value="normal" className="bg-blue-200">
                                Prioridade Normal
                            </option>
                            <option value="alta" className="bg-red-200">
                                Prioridade Alta
                            </option>
                        </select>

                        <Image
                            src={"/svg/materia.svg"}
                            alt="matéria"
                            width={20}
                            height={20}
                            priority
                        />
                        <input
                            type="text"
                            name="subject"
                            placeholder="Matéria"
                            value={taskData.subject}
                            onChange={handleChange}
                            className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:border-cyan-500 bg-transparent text-white"
                        />
                    </div>
                </div>

                {/* Formatação descrição */}
                <div className="mt-6">
                    <div className="flex space-x-2 mb-2">
                        <button
                            onClick={applyBold}
                            className="w-8 h-8 flex items-center justify-center border border-gray-600 rounded hover:bg-gray-600 font-bold text-white"
                            title="Negrito"
                        >
                            B
                        </button>
                        <button
                            onClick={applyItalic}
                            className="w-8 h-8 flex items-center justify-center border border-gray-600 rounded hover:bg-gray-600 italic text-white"
                            title="Itálico"
                        >
                            I
                        </button>
                        <button
                            onClick={applyUnderline}
                            className="w-8 h-8 flex items-center justify-center border border-gray-600 rounded hover:bg-gray-600 underline text-white"
                            title="Sublinhado"
                        >
                            U
                        </button>
                    </div>

                    {/* Editor de texto */}
                    <div className="relative">
                        <div
                            ref={editorRef}
                            contentEditable
                            className={`w-full min-h-[8rem] p-3 border ${
                                isEditorFocused
                                    ? "border-cyan-500"
                                    : "border-gray-600"
                            } rounded bg-[#3a3b4a] text-white focus:outline-none`}
                            onFocus={() => setIsEditorFocused(true)}
                            onBlur={() => setIsEditorFocused(false)}
                          
                            spellCheck={true}
                        />
                        {!taskData.description && !isEditorFocused && (
                            <div className="absolute top-3 left-3 text-gray-500 pointer-events-none select-none">
                                
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                    >
                        SALVAR
                    </button>
                </div>
            </div>
        </div>
    );
}
