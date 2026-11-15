import { type Dispatch, type KeyboardEvent, type SetStateAction, useState } from "react";
import { SlClose } from "react-icons/sl";

import Button from "../Button";

import "@/style/components/layout/form/AddTags.css";

interface AddTagsProps {
    tags: string[],
    setTags: Dispatch<SetStateAction<string[]>>
}

const AddTags = ({tags, setTags}: AddTagsProps) => {
  const [openForm, setOpenForm] = useState(false); 
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e && e.key === "Enter") e.preventDefault();

    if (e.key === "Enter") {
        const trimmedTag = inputValue.trim().toLowerCase();

        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags((prev) => [...prev, trimmedTag]);
            setInputValue("");
        }
    }
  }
  
  const handleRemoveTag = (idx: number) => {
    setTags((prev) => prev.filter((_, index) => index !== idx));
  }
  return (
    <div className="tags_edit">
        <h2>Tags</h2>
        <p>Adicione tags para destacar seus produtos em pesquisas da web e para filtragem em pesquisas (ex: campeão de vendas, usb-c, top ofertas etc...)</p>

        <Button 
            type="button"
            nameAction="Adicionar tags"
            className="add_tags_btn"
            onClick={() => setOpenForm((prev) => !prev)}
            disabled={false}
        />

        {openForm && (
            <div className="form_tags">
                <div className="box_add_tags">
                    {tags.length > 0 && tags.map((tag, idx) => (
                        <span key={idx} className="tag_badge">
                            {tag}

                            <SlClose className="remove_tag_btn" onClick={() => handleRemoveTag(idx)}/>
                        </span>
                    ))}

                    <input 
                        type="text"
                        name="tag_product"
                        id="tag"
                        placeholder={tags.length > 0 ? "" : "Digite a tag e aperte Enter"}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="tag_input_embedded"
                    />
                </div>
            </div>
        )}
    </div>
  )
}

export default AddTags