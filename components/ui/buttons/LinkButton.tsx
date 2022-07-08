import Link from 'next/link'
import { FaChevronLeft } from 'react-icons/fa'

interface Props {
  text: string
  href: string
  chevron: boolean
  type?: string
}

const LinkButton = ({ text, href, chevron, type }: Props) => {
  return (
    <Link href={href}>
      <a type={type} className="p-4 mt-10 text-white rounded-full w-44 bg-gradient-to-r from-primary to-red-500 hover:opacity-80">
        {text} {chevron && <FaChevronLeft className="inline" />}
      </a>
    </Link>
  )
}

export default LinkButton
