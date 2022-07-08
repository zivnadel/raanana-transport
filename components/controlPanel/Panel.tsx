import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import PanelButton from '../ui/buttons/PanelButton'

const Panel = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const toggleMobileMenuClickedHandler = () => {
    setShowMobileMenu((prevState) => !prevState)
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="mb-2 text-3xl font-semibold mt-36 text-primary md:mt-20">
        לוח הבקרה
      </h1>
      <button
        onClick={toggleMobileMenuClickedHandler}
        id="dropdownDefault"
        data-dropdown-toggle="dropdown"
        className="m-3 inline-flex items-center rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 md:hidden"
      >
        תפריט <FaChevronDown className="ml-2" />
      </button>
      <div
        className={`z-10 flex-col ${
          showMobileMenu ? 'flex' : 'hidden'
        } w-44 divide-y divide-gray-100 rounded bg-white shadow md:flex md:w-full md:divide-y-0 md:bg-transparent md:shadow-none`}
      >
        <ul
          className="py-1 text-sm text-gray-700 md:flex md:w-full md:justify-center md:py-0"
          aria-labelledby="dropdownDefault"
        >
          <PanelButton>מחירון</PanelButton>
          <PanelButton>שינוי סיסמא</PanelButton>
          <PanelButton>עדכון לו&quot;ז</PanelButton>
          <PanelButton>עריכת פרטי תלמיד</PanelButton>
          <PanelButton>הוספת\הסרת תלמיד</PanelButton>
        </ul>
      </div>
    </div>
  )
}

export default Panel
