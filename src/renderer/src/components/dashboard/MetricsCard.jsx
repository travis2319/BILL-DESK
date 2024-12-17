const MetricsCard = ({ icon: Icon, label, value, color }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center hover:shadow-xl transition-shadow duration-300">
        <Icon className={`text-${color}-500 mr-4`} size={48} />
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    );
  };
  
  export default MetricsCard;
  