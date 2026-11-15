import React, { type Dispatch, type SetStateAction, useState } from "react";
import { CgAddR } from "react-icons/cg";
import { SlClose } from "react-icons/sl";

import Button from "../Button";

import "@/style/components/layout/form/Variants.css";

export interface Variant {
    category: string;
    options: string[];
}

interface VariantsProps {
    savedVariants: Variant[];
    setSavedVariants: Dispatch<SetStateAction<Variant[]>>
}

const Variants = ({savedVariants, setSavedVariants}: VariantsProps) => {
  const [openForm, setOpenForm] = useState(false);
  const [category, setCategory] = useState("");
  const [optionInput, setOptionInput] = useState("");
  const [optionsList, setOptionsList] = useState<string[]>([]);

  const handleAddOption = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e) {
        e.preventDefault();
    }

    const trimmedOption = optionInput.trim();

    if (!trimmedOption) return;

    if (optionsList.includes(trimmedOption)) {
        alert("Essa opção já foi adicionada.");
        return;
    }

    setOptionsList(prev => [...prev, trimmedOption]);
    setOptionInput("");
  };

  const handleRemoveOption = (idx: number) => {
    setOptionsList(prev => prev.filter((_, index) => index !== idx));
  }

  const handleSaveVariant = () => {
    if (optionsList.length === 0) {
        alert("Ao adicionar uma categoria, é necessário adicionar ao menos uma opção.");
        return;
    }

    const newVariant = {
        category: category.trim(),
        options: optionsList,
    }

    setSavedVariants(prev => [...prev, newVariant]);
    setCategory("");
    setOptionsList([]);
    setOpenForm(false);
  };

  const handleRemoveVariant = (idx: number) => {
    setSavedVariants(prev => prev.filter((_, index) => index !== idx))
  } 

  return (
    <div className="variants_edit">
        <h2>Variações do produto</h2>
        <p>Exemplo de variação: {"categoria: cor, opções: azul, branco, cinza"}</p>
        {savedVariants.length > 0 && (
            <div className="saved_variants_list">
                <h3>Variações criadas</h3>
                <ul>
                    {savedVariants.map((v, i) => (
                        <li key={i}><span><strong>{v.category}:</strong> {v.options.join(", ")}</span> <SlClose size={20} onClick={() => handleRemoveVariant(i)}/></li>
                    ))}
                </ul>
            </div>
        )}
        <Button 
            type="button"
            nameAction="Adicionar variação (opcional)"
            className="add_variant_btn"
            disabled={false}
            onClick={() => setOpenForm(prev => !prev)}
        />

        {openForm && (
            <div className="variant_form">
                <input 
                    type="text"
                    name="category_variant"
                    id="category"
                    placeholder="Nome da Categoria"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />

                <div className="option_input_group">
                    <input 
                        type="text"
                        name="option_variant"
                        id="option"
                        placeholder="Opção"
                        value={optionInput}
                        onChange={(e) => setOptionInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddOption(e)}
                    />
                    
                    <Button 
                        type="button"
                        nameAction=""
                        className="add_option_btn"
                        disabled={false}
                        onClick={handleAddOption}
                        icon={<CgAddR size={30}/>}
                    />
                </div>

                {optionsList.length > 0 && (
                    <div className="options_tags_container">
                        {optionsList.map((opt, idx) => (
                            <span key={idx} className="variant_tag">
                                {opt}
                                <SlClose 
                                    size={15}
                                    onClick={() => handleRemoveOption(idx)}
                                />
                            </span>
                        ))}
                    </div>
                )}

                <div className="opt_buttons">
                    <Button
                        type="button"
                        nameAction="Cancelar"
                        className="cancel_variant_btn"
                        disabled={false}
                        onClick={() => setOpenForm(false)}
                    />
                    <Button
                        type="button"
                        nameAction="Salvar variação"
                        className="save_variant_btn"
                        disabled={false}
                        onClick={handleSaveVariant}
                    />
                </div>
            </div>
        )}
    </div>
  )
}

export default Variants