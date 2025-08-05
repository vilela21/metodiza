import Image from "next/image";
import React, { useState, ChangeEvent } from "react";

interface TaskProps {
    selectedDate: Date | null;
    onClose: () => void;
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

export default function Task({ selectedDate, onClose }: TaskProps) {
    const [taskData, setTaskData] = useState({
        title: "",
        priority: false,
        location: "",
        subject: "",
        notification: "",
        description: "",
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value, type } = e.target;
        const newValue =
            type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value;
        setTaskData((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleSave = () => {
        // Aqui você implementaria a lógica para salvar a tarefa
        console.log("Tarefa salva:", taskData, selectedDate);
        onClose(); // Fecha o pop-up após salvar
    };

    // Não renderiza nada se nenhuma data estiver selecionada
    if (!selectedDate) {
        return null;
    }

    // Formata a data para exibição (ex: "10 de Maio de 2025")
    const formattedDate = `${selectedDate.getDate()} de ${months[selectedDate.getMonth()]} de ${selectedDate.getFullYear()}`;

    return (
        <div
            className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
            // Fecha ao clicar fora do pop-up
        >
            <div
                className="bg-[#464757] rounded-lg shadow-xl w-full max-w-xl p-6 "
                onClick={(e) => e.stopPropagation()} // Impede fechamento ao clicar dentro
            >
                <div className="flex justify-between items-center mb-4 border-b border-[#35C0D2] pb-2">
                    <h2 className="text-xl font-bold text-white-800">TAREFA</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="text-center mb-4 text-[#35C0D2] font-medium ">
                    {formattedDate}
                </div>

                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="title"
                            placeholder="Adicionar título"
                            value={taskData.title}
                            onChange={handleChange}
                            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-cyan-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Image
                            src={"/svg/local.svg"}
                            alt="logo"
                            width={20}
                            height={20}
                            className=" "
                        />

                        <input
                            type="text"
                            name="location"
                            placeholder="Adicionar local"
                            value={taskData.location}
                            onChange={handleChange}
                            className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:border-cyan-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 items-center ">
                        <select id="prioridade " className="">
                            <option value="baixa">Prioridade Baixa</option>
                            <option value="normal">Prioridade Normal</option>
                            <option value="alta">Prioridade Alta</option>
                        </select>

                        <input
                            type="text"
                            name="subject"
                            placeholder="Matéria"
                            value={taskData.subject}
                            onChange={handleChange}
                            className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <div className="flex space-x-2 mb-2">
                        {["B", "I", "U"].map((btn, i) => (
                            <button
                                key={i}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                            >
                                {btn}
                            </button>
                        ))}
                    </div>

                    <textarea
                        name="description"
                        placeholder="Adicionar uma descrição"
                        value={taskData.description}
                        onChange={handleChange}
                        className="w-full h-32 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>

                <div className="mt-6 flex justify-end">
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
