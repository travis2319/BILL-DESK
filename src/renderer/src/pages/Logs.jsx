import {Sidebar,DataTable} from '../components/index'
const Logs = () => {
  return (
    <div className='flex h-screen'>
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
      <DataTable />
      </div>
    </div>
  )
}

export default Logs