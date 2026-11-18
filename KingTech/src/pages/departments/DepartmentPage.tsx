import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CiBoxList, CiGrid41 } from "react-icons/ci";
import { useParams } from "react-router-dom";
import { BsRocketTakeoff } from "react-icons/bs";
import { ClipLoader } from "react-spinners";

import { useWidthWindow } from "@/hooks/useWindowWidth";

import { useProductService } from "@/services/productService";

import { CardMode } from "@/types/products";

import type { Department } from "@/data/departmentsData";

import PaginationNavbar from "@/components/layout/pages/PaginationNavbar";
import Filter from "@/components/layout/Filter";
import ProductCard from "@/components/layout/ProductCard";
import CarrosselOffers from "@/components/layout/CarrosselOffers";
import SkeletonSlider from "@/components/layout/loading/SkeletonSlider";

import { categoryFilters, departmentsData } from "@/data/departmentsData";
import "@/style/pages/departments/DepartmentPage.css";
import "@/style/responsive/pages/departments/DepartmentPage.responsive.css";

enum ViewMode {
  GRID = "grid",
  LIST = "list"
}

const isDepartment = (value: string | undefined): value is Department =>
  value !== undefined && 
  Object.prototype.hasOwnProperty.call(departmentsData, value);

const DepartmentPage = () => {
  const { department: departmentParam, subcategory: subcategoryParam } = useParams();
  const [typeView, setTypeView] = useState<ViewMode>(ViewMode.GRID);
  const [currentPage, setCurrentPage] = useState(1);

  let widthWindow = useWidthWindow();

  const slidesToShow = widthWindow > 800 ? 2 : 1;

  const { getProductsForDepartments } = useProductService();

  const department = isDepartment(departmentParam) ? departmentParam : undefined;

  const selectedSubcategory = department ? departmentsData[department].subcategories.find((item) => item.name.toLowerCase() === subcategoryParam?.toLowerCase() || item.slug === subcategoryParam) : undefined;

  const productsPerPage = typeView === ViewMode.LIST ? 8 : 20;

  const departmentQuery = useQuery({
    queryKey: [
      "department-products",
      department,
      selectedSubcategory?.slug,
      currentPage,
      productsPerPage,
    ],
    enabled: Boolean(department && selectedSubcategory),
    queryFn: async () => {
      if (!department || !selectedSubcategory) {
        throw new Error("Departamento ou Subcategoria inválidos.")
      }

      const result = await getProductsForDepartments({
        department,
        subcategory: selectedSubcategory.slug,
        page: currentPage,
        limit: productsPerPage,
      });

      if (result.error) {
        throw new Error(result.message);
      }

      return result.data
    },
  });
  const departmentData = departmentQuery.data;
  const products = departmentData?.products ?? [];
  const releases = departmentData?.releases ?? [];
  const totalCount = departmentData?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / productsPerPage);

  const pages = Array.from({ length: totalPages }, (_, idx) => ({
    id: idx,
    current: idx + 1 === currentPage,
  }));

  const filtersToShow = categoryFilters.filter((filterGroup) => {
    if (filterGroup.departments === "all") return true;
    if (Array.isArray(filterGroup.departments)) {
      return filterGroup.departments.some(
        (dep) => dep.toLowerCase() === subcategoryParam?.toLowerCase(),
      );
    }
    return false;
  });

  const changeView = (view: ViewMode) => {
    setTypeView(view);
    setCurrentPage(1);
  };

  if (!department || !selectedSubcategory) {
    return (
      <section className="products-dep">
        <p role="alert">Departamento ou subcategoria não encontrados</p>
      </section>
    );
  };

  // if (departmentQuery.isPending) {
  //   return (
  //     <section className="products-dep">
  //       <main className="products-content">
  //         <p role="status" aria-live="polite">
  //           <ClipLoader color="#25967f" speedMultiplier={0.7} />
  //         </p>
  //       </main>
  //     </section>
  //   )
  // }

  if (departmentQuery.isError) {
    return (
      <section className="products-dep">
        <main className="products-content">
          <p role="alert">
            {departmentQuery.error instanceof Error ? departmentQuery.error.message : "Não foi possível carregar os produtos, tente novamente mais tarde."}
          </p>
        </main>
      </section>
    );
  };

  return (
    <section className="products-dep">
      <main className="products-content">
        <div className="banner">
          <img src="/image/banner1.webp" alt="banner de promoção" />
        </div>
        {departmentQuery.isPending && (
          <SkeletonSlider slidesNumber={slidesToShow} landscape/>
        )}
        
        {releases.length > 0 && (
          <CarrosselOffers
            titleHidden={false}
            className="releases"
            ariaLabel="Os produtos que são lançamentos da categoria"
            title="Lançamentos"
            icon={<BsRocketTakeoff />}
            products={releases}
            dots={false}
            infinite={true}
            speed={500}
            slidesToShow={slidesToShow}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={2500}
            pauseOnHover={true}
            cardPreviewMode={CardMode.LANDSCAPE}
            button={false}
          />
        )}
        <div className="catalog">
          <div className="view-options">
            <p className="quantity-products">
              {totalCount < 1000
                ? totalCount
                : `+ de ${Math.floor(totalCount / 1000) * 1000}`}{" "}
              produtos encontrados
            </p>
            <div className="view-switching">
              <h3>Ver como:</h3>
              <div>
                Lista
                <span
                  className={`list ${typeView === ViewMode.LIST ? "active" : ""}`}
                  onClick={() => changeView(ViewMode.LIST)}
                  aria-label="exibir produtos em lista"
                >
                  <CiBoxList size={widthWindow > 425 ? 20 : 15} />
                </span>
                <span
                  className={`grid ${typeView === ViewMode.GRID ? "active" : ""}`}
                  onClick={() => changeView(ViewMode.GRID)}
                  aria-label="exibir produtos em grade"
                >
                  <CiGrid41 size={widthWindow > 425 ? 20 : 15} />
                </span>
                Grade
              </div>
            </div>
          </div>
          <aside className="filters">
            {filtersToShow.map((filterGroup, idx) =>
              filterGroup.childrens.map((filterCategory) => (
                <Filter
                  key={filterCategory.category + idx}
                  category={filterCategory.category}
                  filters={filterCategory.filters}
                />
              ))
            )}
          </aside>
          <div
            className={`catalog-products ${
              typeView === ViewMode.LIST ? "list" : "grid"
            }`}
          >
            {departmentQuery.isPending && (
              <ClipLoader className="load_animation" color="#25967f" speedMultiplier={0.7} size={100} />
            )}
            {products.length > 0 ? ( products.map((product) => (
              <ProductCard
                key={product.id}
                mode={typeView === ViewMode.GRID ? CardMode.PORTRAIT : CardMode.LIST}
                name={product.name}
                id={product.id}
                img={product.img}
                prevPrice={product.prevPrice ?? null}
                price={product.price ?? 0}
                alt={product.name}
                button={false}
              />
            ))) : departmentQuery.isPending ? null : (
              <p style={{textAlign: "center"}}>Nenhum produto encontrado nesta subcategoria.</p>
            )}
          </div>
            {totalPages > 0 && (
              <PaginationNavbar
                pages={pages}
                onPageChange={setCurrentPage}
                disablePrev={currentPage === 1}
                disableNext={currentPage === totalPages}
              />
            )}
        </div>
        {/* {departmentQuery.isPending && (
          <SkeletonSlider slidesNumber={slidesToShow}/>
        )}
        {departmentData.bestSellers.length > 0 && (
          <CarrosselOffers
            titleHidden={false}
            className="best-sellers"
            ariaLabel="Os produtos mais vendidos da categoria"
            title="Mais Vendidos"
            icon={<CiTrophy />}
            products={departmentData.bestSellers}
            dots={false}
            infinite={true}
            speed={500}
            slidesToShow={widthWindow > 800 ? 2 : 1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={2500}
            pauseOnHover={true}
            cardPreviewMode={CardMode.LANDSCAPE}
            button={false}
          />
        )} */}
        {/* {departmentQuery.isPending && (
          <SkeletonSlider slidesNumber={slidesToShow}/>
        )} */}
        {/* {departmentData.highlights.length > 0 && (
          <CarrosselOffers
            titleHidden={false}
            className="highlights"
            ariaLabel="Os produtos em destaque da categoria"
            title="Destaques"
            icon={<TbTopologyStar3 />}
            products={departmentData.highlights}
            dots={false}
            infinite={true}
            speed={500}
            slidesToShow={widthWindow > 800 ? 2 : 1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={2500}
            pauseOnHover={true}
            cardPreviewMode={CardMode.LANDSCAPE}
            button={false}
          />
        )} */}
      </main>
    </section>
  );
};

export default DepartmentPage;
