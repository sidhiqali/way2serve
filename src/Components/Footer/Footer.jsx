import React from 'react'
import './Footer.css'
function Footer({nomargin}) { 
    return (
      <div className={nomargin ? "footer-container nomargin" : "footer-container"}>
       
        <div className="footer-sub-section">
          
          <div className="footer-sub-right">
            <p className="footer-sub-title">way2serve</p>
            <p className="footer-sub-details">© ALi</p>
          </div>
        </div>
      </div>
    );
}

export default Footer
