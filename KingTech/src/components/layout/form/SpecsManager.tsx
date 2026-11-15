import { type ChangeEvent, type Dispatch, type SetStateAction, useState } from "react";
import { CgAddR } from "react-icons/cg";
import { SlClose } from "react-icons/sl";
import * as XLSX from "xlsx";

import Button from "../Button";

import "@/style/components/layout/form/SpecsManager.css";

interface SpecsManagerProps {
    specs: {
        [key: string]: string
    };
    setSpecs: Dispatch<SetStateAction<{[key: string]: string}>>
}

const SpecsManager = ({specs, setSpecs}: SpecsManagerProps) => {
  const [activeMode, setActiveMode] = useState<null | string>(null);

  const [manualKey, setManualKey] = useState("");
  const [manualValue, setManualValue] = useState("");

  const handleAddManual = () => {

    if (!manualKey.trim() || !manualValue.trim()) return;

    setSpecs((prev) => ({
        ...prev,
        [manualKey.trim()]: manualValue.trim()
    }));

    setManualKey("");
    setManualValue("");
  }

  const handleFileUpload = (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement;

    if (input) {
        const file = input.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const arrayBuffer = event.target?.result;

            const data = new Uint8Array(arrayBuffer as ArrayBuffer);            

            const workbook = XLSX.read(data, {type: "array", codepage: 65001});

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const sheetData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

            const newSpecs = {...specs};

            sheetData.forEach((row: any) => {
                if (row && row[0] !== undefined && row[1] !== undefined) {
                    const key = String(row[0]).trim();
                    const value = String(row[1]).trim();
                    
                    if (key && value) {
                        newSpecs[key] = value;
                    }
                }
            });

            setSpecs(newSpecs);
            alert("Arquivo carregado com sucesso");
        }

        reader.readAsArrayBuffer(file);
    }
  }

  const handleRemoveItem = (key: string) => {
    setSpecs((prev) => {
        const copy = {...prev};
        delete copy[key]
        return copy;
    })
  }
  return (
    <div className="specs_edit">
        <h2>Especificações técnicas</h2>
        <p>Adicione a ficha técnica do produto</p>

        {Object.keys(specs).length > 0 && (
            <div className="specs_preview">
                <h4>Ficha técnica gerada</h4>
                <div className="container">
                    <table className="list_of_specs">
                        <tbody>
                            {Object.entries(specs).map(([key, value]) => (
                                <tr key={key}>
                                    <th>{key}</th>
                                    <td>
                                        {value}
                                        <SlClose
                                            className="remove_spec_btn"
                                            size={20}
                                            onClick={() => handleRemoveItem(key)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        <div className="mode_buttons">
            <Button 
                type="button"
                className="manual_btn"
                nameAction="Adicionar ficha técnica"
                style={{
                    border: activeMode === "manual" ? "1px solid #233d4d" : "1px solid #ccc",
                    backgroundColor: activeMode === "manual" ? "#e0e7ff" : "#fff"
                }}
                disabled={false}
                onClick={() => setActiveMode("manual")}
            />
            <span>ou</span>
            <Button 
                type="button"
                className="file_btn"
                nameAction="importar arquivo (Excel / CSV)"
                style={{
                    border: activeMode === "file" ? "1px solid #233d4d" : "1px solid #ccc",
                    backgroundColor: activeMode === "file" ? "#e0e7ff" : "#fff"
                }}
                disabled={false}
                onClick={() => setActiveMode("file")}
            />
        </div>

        {activeMode === "manual" && (
            <div className="manual_spec_edit">
                <input 
                    type="text"
                    name="key_spec"
                    id="key"
                    placeholder="ex: Velocidade de memória"
                    value={manualKey}
                    onChange={(e) => setManualKey(e.target.value)}
                />
                <input 
                    type="text"
                    name="value_spec"
                    id="value"
                    placeholder="ex: Até 20 gb/s"
                    value={manualValue}
                    onChange={(e) => setManualValue(e.target.value)}
                />
                <Button 
                    type="button"
                    nameAction=""
                    disabled={false}
                    onClick={handleAddManual}
                    icon={<CgAddR size={30}/>}
                />
            </div>
        )}
        {activeMode === "file" && (
            <div className="file_spec_edit">
                <p className="info_file_edit">A planilha deve conter a <strong>Coluna A (nome)</strong> e a <strong>Coluna B (valor)</strong></p>
                <input 
                    type="file" 
                    accept=".csv, .xlsx, .xls"
                    onChange={handleFileUpload}
                    style={{cursor: "pointer"}}
                />
            </div>
        )}
    </div>
  )
}

export default SpecsManager