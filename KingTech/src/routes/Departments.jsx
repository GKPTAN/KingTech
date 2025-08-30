import { useState } from "react";
import { departmentsData } from "../data/departmentsData.js";
import { Link } from "react-router-dom";
import "../style/Departments.css";

const Departments = () => {
  const [openDepartment, setOpenDepartment] = useState(null);

  return (
    <div className="departments">
      <title>Departamentos</title>
      <ul className="departments-list">
        {Object.keys(departmentsData).map((department) => (
          <li key={departmentsData[department].id} className="department-item">

            <h3>{department}</h3>

            <ul className="subcategories">
              {departmentsData[department].subcategories.map(
                  (subcategory) => (
                    <li key={subcategory.id}>
                      <Link to={`/departments/${department}`} className="subcategory-btn">{subcategory.name}</Link>
                    </li>
                  )
               )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Departments;
