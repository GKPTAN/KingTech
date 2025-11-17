import { useState } from "react";
import { departmentsData } from "../data/departmentsData.js";
import { Link } from "react-router-dom";
import { useWidthWindow } from "../hooks/useWindowWidth.jsx";
import styles from "../style/Departments.module.css";

const Departments = () => {
  const [openDepartment, setOpenDepartment] = useState(null);
  let widthWindow = useWidthWindow();
  let isMobile = widthWindow <= 650;

  const toggle = (id) => {
    setOpenDepartment((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.departments}>
      <title>Departamentos</title>
      <ul className={styles.departments_list}>
        {Object.keys(departmentsData).map((department) => {
          const dept = departmentsData[department];
          const id = dept.id;
          const isOpen = isMobile && openDepartment === id;

          return (
            <li
              key={departmentsData[department].id}
              className={`${styles.department_item} ${isOpen ? styles.open : ""}`}
            >
              {isMobile ? (
                <h3>
                  <button
                    className={styles.toggle_btn}
                    aria-expanded={isOpen}
                    aria-controls={`sub-${id}`}
                    onClick={() => toggle(id)}
                  >
                    {department}
                    <span className={styles.caret}>
                      {isOpen ? "▲" : "▶"}
                    </span>
                  </button>
                </h3>
              ) : (
                <h3>{department}</h3>
              )}

              <ul id={`sub-${id}`} className={styles.subcategories}>
                {dept.subcategories.map(
                  (subcategory) => (
                    <li key={subcategory.id}>
                      <Link
                        to={`/departments/${department}/${subcategory.name}`}
                        className={styles.subcategory_btn}
                      >
                        {subcategory.name}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Departments;
