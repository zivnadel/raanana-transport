import { FaChevronLeft } from 'react-icons/fa'
import { twMerge } from 'tailwind-merge'

interface Props {
  children?: React.ReactNode
  className?: string
  chevron?: boolean
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Button = ({ children, className, chevron, type, onClick }: Props) => {
  const classes = twMerge(`p-4 mx-5 mt-10 text-center text-white rounded-full w-44 bg-gradient-to-r from-primary to-red-500 hover:opacity-80 ${className}`)

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
    >
      {children} {chevron && <FaChevronLeft className="inline" />}
    </button>
  )
}

export default Button
