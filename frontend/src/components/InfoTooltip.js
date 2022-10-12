import React from "react";
import successIcon from "../images/success_icon.svg";
import failIcon from "../images/fail_icon.svg";

const InfoToolTip = ({ isOpen, onClose, isSuccess }) => {
  return (
      <div className={`popup popup_type_tooltip ${isOpen ? "popup_open" : ""}`}>
          <div className="popup__content">
          <button type="button" className="popup__close" onClick={onClose} />
          {isSuccess === "success" ? (
            <div>
              <img className="popup__icon" src={successIcon} alt="" />
              <p className="popup__status-message">
                Success! You have been registered.
              </p>
            </div>
          ) : (
            <div>
              <img className="popup__icon" src={failIcon} alt="" />
              <p className="popup__status-message">
                Oops, something went wrong! Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
  );
};

export default InfoToolTip;
