import { FaChevronLeft } from 'react-icons/fa'

interface Props {
  children?: React.ReactNode
  chevron?: boolean
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Button = ({ children, chevron, type, onClick }: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="p-4 mx-5 mt-10 text-center text-white rounded-full w-44 bg-gradient-to-r from-primary to-red-500 hover:opacity-80"
    >
      {children} {chevron && <FaChevronLeft className="inline" />}
    </button>
  )
}

export default Button
