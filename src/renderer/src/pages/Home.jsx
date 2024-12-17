import {Sidebar,Dashboard,DataTable} from '../components/index'

const Home = () => {
  
  return (
    <div className=" flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
        <Dashboard />
        <DataTable />
      </div>
    </div>
  )
}

export default Home