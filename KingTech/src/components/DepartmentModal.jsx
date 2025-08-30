import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./layout/Button";
import "../style/components/DepartmentModal.css";

const DepartmentModal = ({ department, isOpen, onClose, subcategories }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) {
        onClose();
      }
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Button
                type="button"
                nameAction="x"
                className="modal-close"
                disabled={false}
                onClick={onClose}
            />
            <ul className="subcategories-list">
                {subcategories.map((subcategory) => (
                    <li key={subcategory.id}>
                        <Button 
                            type="button"
                            nameAction={subcategory.name}
                            className="subcategory-btn"
                            disabled={false}
                            onClick={() => console.log("Categoria selecionada: ", subcategory.name)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default DepartmentModal;
