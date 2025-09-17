import { useState } from "react";
import { departmentsData } from "../data/departmentsData.js";
import { Link } from "react-router-dom";
import styles from "../style/Departments.module.css";

const Departments = () => {
  const [openDepartment, setOpenDepartment] = useState(null);

  return (
    <div className={styles.departments}>
      <title>Departamentos</title>
      <ul className={styles.departments_list}>
        {Object.keys(departmentsData).map((department) => (
          <li key={departmentsData[department].id} className={styles.department_item}>

            <h3>{department}</h3>

            <ul className={styles.subcategories}>
              {departmentsData[department].subcategories.map(
                  (subcategory) => (
                    <li key={subcategory.id}>
                      <Link to={`/departments/${department}/${subcategory.name}`} className={styles.subcategory_btn}>{subcategory.name}</Link>
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
