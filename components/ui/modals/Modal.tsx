const Modal: React.FC = ({ children }) => {
  return (
    // Modal backdrop
    <div className="fixed top-0 left-0 right-0 z-50 w-full h-full overflow-x-hidden overflow-y-auto bg-gray-600 bg-opacity-40 md:inset-0">
      {/* Modal Flex Container */}
      <div className="flex justify-center items-center h-full w-full">
        {/* Modal Content */}
        <div className="bg-white rounded-lg shadow w-10/12 max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
