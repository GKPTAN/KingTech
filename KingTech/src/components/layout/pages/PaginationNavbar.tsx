import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

interface PaginationNavbarProps {
  pages: {
    id: number;
    current: boolean;
  }[];
  onPageChange?: (pageNumber: number) => void;
  disablePrev: boolean;
  disableNext: boolean;
}

const PaginationNavbar = ({
  pages,
  onPageChange,
  disablePrev,
  disableNext,
}: PaginationNavbarProps) => {
  const scrollToCatalog = () => {
    const el = document.querySelector(".catalog-products");
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (disablePrev) return;
    const target = Math.max(
      1,
      pages.findIndex((p) => p.current)
    );
    onPageChange && onPageChange(target);
    scrollToCatalog();
  };

  const handleNext = () => {
    if (disableNext) return;
    const target = Math.min(
      pages.length,
      pages.findIndex((p) => p.current) + 2
    );
    onPageChange && onPageChange(target);
    scrollToCatalog();
  };

  const handleClickPage = (pageNumber: number) => {
    onPageChange && onPageChange(pageNumber);
    scrollToCatalog();
  };

  return (
    <ul className="pagination-nav">
      <RiArrowLeftSLine
        className={`prev ${disablePrev ? "disabled" : ""}`}
        size={30}
        onClick={handlePrev}
        style={{
          opacity: disablePrev ? 0.4 : 1,
          pointerEvents: disablePrev ? "none" : "auto",
        }}
      />
      {pages.map((page, idx) => (
        <li
          key={idx}
          className={page.current ? "active" : ""}
          onClick={() => handleClickPage(idx + 1)}
        >
          {page.id + 1}
        </li>
      ))}
      <RiArrowRightSLine
        className="next"
        size={30}
        onClick={handleNext}
        style={{
          opacity: disableNext ? 0.4 : 1,
          pointerEvents: disableNext ? "none" : "auto",
        }}
      />
    </ul>
  );
};

export default PaginationNavbar;
