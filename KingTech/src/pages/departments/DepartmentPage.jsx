import { categoryFilters } from "../../data/departmentsData.js";
import { useParams } from "react-router-dom";
import { CiBoxList, CiGrid41, CiTrophy } from "react-icons/ci";
import { useEffect, useState } from "react";
import { useWidthWindow } from "../../hooks/useWindowWidth.jsx";
import { BsFillLightningChargeFill, BsRocketTakeoff } from "react-icons/bs";
import { LiaSearchDollarSolid } from "react-icons/lia";
import { TbCrown, TbTopologyStar3 } from "react-icons/tb";
import PaginationNavbar from "../../components/layout/pages/PaginationNavbar.jsx";
import Filter from "../../components/layout/Filter";
import ProductCard from "../../components/layout/ProductCard";
import CarrosselOffers from "../../components/layout/CarrosselOffers";
import "../../style/pages/departments/DepartmentPage.css";
import "../../style/responsive/pages/departments/DepartmentPage.responsive.css";

const products = [
  {
    id: 0,
    name: "Adaptador Conversor Hdmi Para Vga 25 Cm",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 1,
    name: "B-Clarin For Tattoo Cicatriza Proteção Para Tatuagens 30Ml",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 2,
    name: "Calca Texx Armor Ld Fem Pret Azul Verm Cinz L",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 3,
    name: "D-trix Vitamina D3 Em Gotas 30ml 10mcg Sabor Morango - Flora Nativa do Brasil",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 4,
    name: "Eixo Tripe Lava e seca - samsung",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 5,
    name: "Frigobar Mondial 73L Branco e Cinza FGB-01-W80",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 6,
    name: "Good Girl Légère Carolina Herrera Perfume Feminino - Eau de Parfum",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 7,
    name: "Homeopatia Anizen Homeo Pet Real H - 30 mL",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 8,
    name: "Idôle Lancôme - Perfume Feminino Eau de Parfum",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 9,
    name: "Jogo de Panelas Brinox Revestimento Cerâmico de Alumínio Preto 5 Peças Carbon Ceramic Life",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 10,
    name: "Kérastase Densifique Densité Kit - Shampoo + Máscara - Kerastase",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 11,
    name: "L'Oréal Professionnel Absolut Repair Gold Quinoa + Protein - Máscara de Tratamento",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 12,
    name: "M6100 M7100 8100 Protetor De Volante De Bicicleta Protetor De Raios De Freio De Disco De Cassete De - others",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 13,
    name: "Nívea Expert Lift Kit Creme Facial Antissinais Dia + Creme Facial Antissinais Noite - Nivea",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 14,
    name: "O céu e o inferno - FEB Editora",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 15,
    name: "Pó Facial Solto Karen Bachini Beauty",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 16,
    name: "Perfume Amor Amor Cacharel Feminino Eau de Toilette",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 17,
    name: "Rádio Retro Vintage Am Fm Sw Usb Bluetooth Bateria Recarregavel Aux Sd - lanterna",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 18,
    name: "Sérum Facial Skinceuticals - P-Tiox",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 19,
    name: "Tênis Puma Rickie Feminino",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
];

const DepartmentPage = () => {
  const { subcategory } = useParams();
  const [typeView, setTypeView] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [widthWindow, setWidthWindow] = useState();

  let widthDevice = useWidthWindow();

  useEffect(() => {
    setWidthWindow(widthDevice);
  }, [widthDevice]);

  let productsPerPage = 20;

  if (typeView === "list") {
    productsPerPage = 8;
  }
  const totalPages = Math.ceil(products.length / productsPerPage);

  const startIdx = (currentPage - 1) * productsPerPage;
  const endIdx = startIdx + productsPerPage;
  const productsToShow = products.slice(startIdx, endIdx);
  const pages = Array.from({ length: totalPages }, (_, idx) => ({
    id: idx,
    current: idx + 1 === currentPage,
  }));

  const lowerSubcategory = subcategory?.toLowerCase();

  const filtersToShow = categoryFilters.filter((filterGroup) => {
    if (filterGroup.departments === "all") return true;
    if (Array.isArray(filterGroup.departments)) {
      return filterGroup.departments.some(
        (dep) => lowerSubcategory === dep.toLowerCase()
      );
    }
    return false;
  });
  return (
    <section className="products-dep">
      <main className="products-content">
        <div className="banner">
          <img src="/image/banner1.webp" alt="banner de promoção" />
        </div>
        <CarrosselOffers
          titleHidden={false}
          className="releases"
          ariaLabel="Os produtos que são lançamentos da categoria"
          title="Lançamentos"
          icon={<BsRocketTakeoff />}
          dots={false}
          infinite={true}
          speed={500}
          slidesToShow={widthWindow > 800 ? 2 : 1}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={2500}
          pauseOnHover={true}
          cardPreviewMode="landscape"
          button={false}
        />
        <div className="catalog">
          <div className="view-options">
            <p className="quantity-products">
              {products.length < 1000
                ? products.length
                : `+ de ${Math.floor(products.length / 1000) * 1000}`}{" "}
              produtos encontrados
            </p>
            <div className="view-switching">
              <h3>Ver como:</h3>
              <div>
                Lista
                <span
                  className={`list ${typeView === "list" ? "active" : ""}`}
                  onClick={() => setTypeView("list")}
                >
                  <CiBoxList size={widthWindow > 425 ? 20 : 15} />
                </span>
                <span
                  className={`grid ${typeView === "grid" ? "active" : ""}`}
                  onClick={() => setTypeView("grid")}
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
              typeView === "list" ? "list" : "grid"
            }`}
          >
            {productsToShow.map((product) => (
              <ProductCard
                key={product.id}
                mode={typeView === "grid" ? "portrait" : "list"}
                name={product.name}
                id={product.id}
                img={product.img}
                prevPrice={product.prevPrice}
                price={product.price}
                alt={product.alt}
                button={false}
              />
            ))}
          </div>
            <PaginationNavbar
              pages={pages}
              onPageChange={setCurrentPage}
              disablePrev={currentPage === 1}
              disableNext={currentPage === totalPages}
            />
        </div>
        <CarrosselOffers
          titleHidden={false}
          className="best-sellers"
          ariaLabel="Os produtos mais vendidos da categoria"
          title="Mais Vendidos"
          icon={<CiTrophy />}
          dots={false}
          infinite={true}
          speed={500}
          slidesToShow={widthWindow > 800 ? 2 : 1}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={2500}
          pauseOnHover={true}
          cardPreviewMode="landscape"
          button={false}
        />
        <CarrosselOffers
          titleHidden={false}
          className="highlights"
          ariaLabel="Os produtos em destaque da categoria"
          title="Destaques"
          icon={<TbTopologyStar3 />}
          dots={false}
          infinite={true}
          speed={500}
          slidesToShow={widthWindow > 800 ? 2 : 1}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={2500}
          pauseOnHover={true}
          cardPreviewMode="landscape"
          button={false}
        />
      </main>
    </section>
  );
};

export default DepartmentPage;
