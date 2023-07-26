import React from 'react';

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-black bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="p-4">
            {children}
            <div className="mt-4 flex justify-end">
              <button onClick={onClose} className="border-2 border-red-500 hover:border-red-600 bg-transparent text-red-500 hover:text-red-600 font-bold py-2 px-4 rounded font-poppins">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
