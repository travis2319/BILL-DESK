import {Sidebar,MenuTable} from '../components/index'

const MenuItems = () => {
  return (
    <div className='flex h-screen'>
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
      <MenuTable />
      </div>
    </div>
  )
}

export default MenuItems