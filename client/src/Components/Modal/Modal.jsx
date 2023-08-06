import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";
import "./Modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      overlayRef.current?.classList.add("active");
      contentRef.current?.classList.add("active");
    } else {
      overlayRef.current?.classList.remove("active");
      contentRef.current?.classList.remove("active");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" ref={overlayRef}>
      <div
        className="modal-content md:w-max w-full md:m-0 m-5"
        ref={contentRef}
      >
        <div className="flex justify-end">
          <button className="modal-close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
