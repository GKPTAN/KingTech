import { useState } from "react";
import { Link } from "react-router-dom";

import { useWidthWindow } from "@/hooks/useWindowWidth";

import { departmentsData } from "@/data/departmentsData";

import styles from "@/style/Departments.module.css";

const Departments = () => {
  const [openDepartment, setOpenDepartment] = useState<number | null>(null);
  let widthWindow = useWidthWindow();
  let isMobile = widthWindow <= 650;

  const toggle = (id: number) => {
    setOpenDepartment((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.departments}>
      <title>Departamentos</title>
      {departmentsData && (
        <ul className={styles.departments_list}>
          {Object.entries(departmentsData).map(([deptName, dept]) => {
            const id = dept.id;
            const isOpen = isMobile && openDepartment === id;

            return (
              <li
                key={dept.id}
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
                      {deptName}
                      <span className={styles.caret}>{isOpen ? "▲" : "▶"}</span>
                    </button>
                  </h3>
                ) : (
                  <h3>{deptName}</h3>
                )}

                <ul id={`sub-${id}`} className={styles.subcategories}>
                  {dept.subcategories.map((subcategory) => (
                    <li key={subcategory.id}>
                      <Link
                        to={`/departments/${deptName}/${subcategory.name}`}
                        className={styles.subcategory_btn}
                      >
                        {subcategory.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Departments;
