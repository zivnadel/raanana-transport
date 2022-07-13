interface Props {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const PanelButton: React.FC<Props> = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white md:mx-5 md:mt-5 md:h-5/6 md:w-44 md:rounded-full md:bg-gradient-to-r md:from-primary md:to-red-500 md:p-4 md:text-center md:text-white md:hover:opacity-80">
      {children}
    </button>
  )
}

export default PanelButton
