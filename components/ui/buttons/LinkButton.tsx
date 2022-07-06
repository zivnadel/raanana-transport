import Link from 'next/link'
import { FaChevronLeft } from 'react-icons/fa'

interface Props {
  text: string
  href: string
  chevron: boolean
}

const LinkButton = ({ text, href, chevron }: Props) => {
  return (
    <Link href={href}>
      <a className="p-4 mt-10 rounded-full w-44 bg-gradient-to-r from-primary to-red-500 hover:opacity-80">
        {text} {chevron && <FaChevronLeft className="inline" />}
      </a>
    </Link>
  )
}

export default LinkButton
