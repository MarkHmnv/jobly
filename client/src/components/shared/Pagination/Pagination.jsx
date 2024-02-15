import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/20/solid/index.js";
import {useSearchParams} from "react-router-dom";
import {useState} from "react";

const Pagination = ({count}) => {
    const itemsPerPage = 9;
    const totalPages = Math.ceil(count / itemsPerPage);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) > 0 ? Number(searchParams.get('page')) : 1;
    const [currentPage, setCurrentPage] = useState(page);

    const changePage = (page) => {
        setSearchParams({
            ...Object.fromEntries([...searchParams]),
            page,
        });
        setCurrentPage(page);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            changePage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            changePage(currentPage + 1);
        }
    };

    const renderPageNumbers = () => {
        const maxPagesToShow = 5;
        const pages = [];

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === i ? 'bg-indigo-600 text-white' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'} focus:z-20 focus:outline-offset-0`}
                    onClick={() => changePage(i)}
                >
                    {i}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span
                        className="font-medium">{Math.min(currentPage * itemsPerPage, count)}</span> of{' '}
                        <span className="font-medium">{count}</span> results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                            onClick={() => handlePrevious()}
                            disabled={currentPage === 1}
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true"/>
                        </button>
                        {renderPageNumbers()}
                        <button
                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                            onClick={() => handleNext()}
                            disabled={currentPage === totalPages}
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true"/>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
