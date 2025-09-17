import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const PaginationNavbar = ({pages, onPageChange, disablePrev, disableNext}) => {
  return (
    <ul className="pagination-nav">
        <RiArrowLeftSLine 
            className={`prev ${disablePrev ? 'disabled' : ''}`} 
            size={30}
            onClick={() => !disablePrev && onPageChange && onPageChange(Math.max(1, pages.findIndex(p => p.current) ))}
            style={{opacity: disablePrev ? 0.4 : 1, pointerEvents: disablePrev ? 'none' : 'auto'}}
        />
        {pages.map((page, idx) => (
            <li 
                key={idx} 
                className={page.current ? 'active' : ''}
                onClick={() => onPageChange && onPageChange(idx + 1)}
            >
                {page.id + 1}
            </li>
        ))}
        <RiArrowRightSLine 
            className="next" 
            size={30}
            onClick={() => !disableNext && onPageChange && onPageChange(Math.min(pages.length, pages.findIndex(p => p.current) + 2))} 
            style={{opacity: disableNext ? 0.4 : 1, pointerEvents: disableNext ? 'none' : 'auto'}}
        />
    </ul>
  );
};

export default PaginationNavbar