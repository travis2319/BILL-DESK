// ErrorDisplay Component
const ErrorDisplay = ({ error, setError, setLoading }) => (
    <div className="p-6 text-red-600">
      Error: {error}
      <button 
        onClick={() => {
          setError(null);
          setLoading(true);
        }} 
        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Retry
      </button>
    </div>
  );
  
  export default ErrorDisplay;