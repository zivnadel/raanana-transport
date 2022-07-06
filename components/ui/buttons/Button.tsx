import { FaChevronLeft } from 'react-icons/fa'

interface Props {
  text: string
  chevron: boolean
}

const Button = ({ text, chevron }: Props) => {
  return (
    <a className="p-4 mt-10 rounded-full w-44 bg-gradient-to-r from-primary to-red-500 hover:opacity-80">
      {text} {chevron && <FaChevronLeft className="inline" />}
    </a>
  )
}

export default Button
