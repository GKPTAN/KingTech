import { type Dispatch, type SetStateAction, useState } from "react";

import Button from "../Button";

import "@/style/components/layout/form/MainInfo.css";

export interface MainInfo {
  id: number;
  title: string;
  info: string;
}

interface MainInfoProps {
  savedMainInfo: MainInfo[];
  setSavedMainInfo: Dispatch<SetStateAction<MainInfo[]>>
}

const MainInformation = ({savedMainInfo, setSavedMainInfo}: MainInfoProps) => {
  const [openForm, setOpenForm] = useState(false);
  const [title, setTitle] = useState("");
  const [info, setInfo] = useState("");

  const handleSave = () => {
    const newMainInfo = {
      id: savedMainInfo.length,
      title: title,
      info: info,
    }

    setSavedMainInfo((prev) => [...prev, newMainInfo]);
    setOpenForm(false);
    setTitle("");
    setInfo("");
  }
  return (
    <div className="main_info_edit">
        <h2>Informações Principais</h2>
        <p>Informações principais sobre o produto (exemplo: pontos fortes, tecnologias etc...)</p>
        {savedMainInfo.length > 0 && (
          <div className="saved_main_info">
            <h3>Informações Salvas</h3>
            <ul>
              {savedMainInfo.map((i, idx) => (
                <li key={idx}><strong>{i.title}</strong><span>{i.info}</span></li>
              ))}
            </ul>
          </div>
        )}
        <Button 
          type="button"
          nameAction="Adicionar Informações"
          className="add_info_btn"
          onClick={() => setOpenForm(prev => !prev)}
          disabled={false}
        />

        {openForm && (
          <div className="main_info_form">
            <input 
              type="text"
              name="title_info"
              id="title"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea 
              name="main_info" 
              id="info" 
              placeholder="Escreva a informação aqui" 
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              required
            ></textarea>

            <div className="opt_buttons">
              <Button 
                type="button"
                nameAction="Cancelar"
                className="cancel_info_btn"
                disabled={false}
                onClick={() => setOpenForm(false)}
              />
              
              <Button
                type="button"
                nameAction="Salvar informação"
                className="save_info_btn"
                disabled={false}
                onClick={handleSave}
              />
            </div>
          </div>
        )}
    </div>
  )
}

export default MainInformation