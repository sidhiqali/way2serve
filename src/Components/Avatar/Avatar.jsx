import React, { useContext,useState,useEffect,useRef } from "react";
import AvatarReact from "react-avatar";
import { AuthContext, fireBaseContext } from "../../store/Contexts";
import { useHistory,Link } from "react-router-dom";
import Preloader from '../preLoader/Preloader'
import "./avatar.css";
function Avatar() {
  const menuRef =  useRef();
  const history = useHistory();
  const { User } = useContext(AuthContext);
  const { firebasedb } = useContext(fireBaseContext);
  const [loading, setLoading] = useState(false);
  const [Googleuser, setGoogleuser] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const googleUser = User.providerData[0].providerId;
    if (googleUser === "google.com") {
      setGoogleuser(true);
    }   
  }, [])
  
  useEffect(() => {
    function handleOutsideClick(e) {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
       setOpen(false)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    }
  },[open])
 
  function handleSignout() {
    setLoading(true)
    firebasedb
      .auth()
      .signOut()
      .then(() => {
          setLoading(false);
          history.push('/');
      })
      .catch((error) => {
        alert('Something went Wrong !')
    });
  }
 
    return (
            
      <>
        {loading && <Preloader />}
        <div className="avatar">
         
            <button
              onClick={() => setOpen(!open)}
              className="avatar-button"
              type="button"
            >
              <AvatarReact size="40" round={true} name={User.displayName} />
              &#x25BC;
            </button>
          

          <div
            ref={menuRef}
            className={
              open ? "avatar-dropdown avatar-drop-active" : "avatar-dropdown"
            }
          >
            <div className="avatar-dropdown-details">
              <div className="avatar-profile">
                {Googleuser ? (
                  <img
                    className="avatar-profile-pic"
                    src={User.photoURL}
                    alt="avatar"
                  />
                ) : (
                  <AvatarReact
                    className="avatar-react-big"
                    size="60"
                    round={true}
                    name={User.displayName}
                  />
                )}
              </div>
              <div className="avatar-profile-details">
                
                <h3>{User.displayName}</h3>        
                <Link className="edit-profile-link" to="/view-profile">
                  View profile
                </Link>
              </div>
            </div>
            <div className="divider"></div>
            <div onClick={() => history.push('/post')} className="avatar-dropdown-items">
              Publish Your Job
            </div>
            <div onClick={() => history.push('/Favorites')} className="avatar-dropdown-items">
              Favorites
            </div>
            <div onClick={handleSignout} className="avatar-dropdown-items">
             
              Log Out
            </div>
            
          </div>
        </div>
      </>
    );
}

export default Avatar;
