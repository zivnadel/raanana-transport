import Link from 'next/link'
import { FaBus } from 'react-icons/fa'
import NavButton from './ui/buttons/NavButton'

const Navbar = () => {
  return (
    <nav className="fixed flex w-full flex-col items-center justify-center bg-black bg-opacity-[65%] py-5 px-7 text-white md:flex-row-reverse md:items-center md:justify-end md:py-4">
      <Link href="/">
        <a className="text-2xl mb-7 md:mb-0 md:ml-auto">
          <span className="text-primary">הסעות </span>רעננה
          <FaBus className="inline ml-2 text-primary" size="1.5rem" />
        </a>
      </Link>
      <ul className="flex flex-row">
        <li>
          <NavButton text="בית" href="/" />
        </li>
        <li>
          <NavButton text="דיווח שעות" href="/report-hours" />
        </li>
        <li>
          <NavButton text="לוח הבקרה" href="/dashboard" />
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
