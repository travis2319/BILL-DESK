// Pagination Component
const Pagination = ({ totalPages, currentPage, setCurrentPage }) => (
    <div className="flex justify-between p-4">
      <button 
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
      >
        Previous
      </button>
  
      {Array.from({ length: totalPages }, (_, index) => (
        <button 
          key={index + 1} 
          onClick={() => setCurrentPage(index + 1)} 
          className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-600' : 'bg-gray-500 hover:bg-gray-400'} text-white`}
        >
          {index + 1}
        </button>
      ))}
  
      <button 
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
      >
        Next
      </button>
    </div>
  );
  
  export default Pagination;