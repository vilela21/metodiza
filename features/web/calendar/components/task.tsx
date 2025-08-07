import Image from "next/image";
import React, { useState, ChangeEvent,useRef,useEffect} from "react";

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
   
     const editorRef = useRef<HTMLDivElement>(null);
    const [isEditorFocused, setIsEditorFocused] = useState(false);

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
        console.log("Tarefa salva:", taskData, selectedDate);
        onClose();
    };



    // Função para aplicar formatação em negrito
        const applyBold = () => {
    document.execCommand("bold", false);
    // Atualiza o estado com o conteúdo formatado
    if (editorRef.current) {
      setTaskData(prev => ({
        ...prev,
        description: editorRef.current!.innerHTML
      }));
    }
  };

  // Função para aplicar itálico
  const applyItalic = () => {
    document.execCommand("italic", false);
    if (editorRef.current) {
      setTaskData(prev => ({
        ...prev,
        description: editorRef.current!.innerHTML
      }));
    }
  };

  // Função para aplicar sublinhado
  const applyUnderline = () => {
    document.execCommand("underline", false);
    if (editorRef.current) {
      setTaskData(prev => ({
        ...prev,
        description: editorRef.current!.innerHTML
      }));
    }
  };
      useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = taskData.description;
    }
  }, [taskData.description]);

  
    // Não renderiza nada se nenhuma data estiver selecionada
    if (!selectedDate) {
        return null;
    }

    // Formata a data para exibição (ex: "10 de Maio de 2025")
    const formattedDate = `${selectedDate.getDate()} de ${months[selectedDate.getMonth()]} de ${selectedDate.getFullYear()}`;

    return (
        <div
            className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
          
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
                       <Image
                            src={"/svg/prioridade.svg"}
                            alt="logo"
                            width={20}
                            height={20}
                            
                        />

                        <select id="prioridade " className="  focus:outline-none  text-gray-400 ">
                            <option className="bg-yellow-200 " value="baixa">Prioridade Baixa</option>
                            <option  className="bg-blue-200"value="normal">Prioridade Normal</option>
                            <option  className="bg-red-200"value="alta">Prioridade Alta</option>
                        </select>
                          <Image
                            src={"/svg/materia.svg"}
                            alt="logo"
                            width={20}
                            height={20}
                            
                        />

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

                 {/* Botões de formatação e textarea */}
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
                    
                     <div
            ref={editorRef}
            contentEditable
            className={`w-full min-h-32 p-3 border ${isEditorFocused ? 'border-cyan-500' : 'border-gray-600'} rounded bg-[#3a3b4a] text-white focus:outline-none`}
            onFocus={() => setIsEditorFocused(true)}
            onBlur={() => setIsEditorFocused(false)}
            onInput={(e) => {
              setTaskData(prev => ({
                ...prev,
                description: (e.target as HTMLDivElement).innerHTML
              }));
            }}
          />
          
          {/* Placeholder para o editor */}
          {!taskData.description && !isEditorFocused && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              Adicionar uma descrição
            </div>
          )}
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
