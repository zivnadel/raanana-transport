import Link from 'next/link'

interface Props {
  text: string
  href: string
}

const NavButton: React.FC<Props> = ({ text, href }) => {
  return (
    <Link href={href}>
      <a className="bg rounded-full from-primary to-red-500 px-5 py-3 hover:bg-gradient-to-r md:px-8">
        {text}
      </a>
    </Link>
  )
}

export default NavButton
