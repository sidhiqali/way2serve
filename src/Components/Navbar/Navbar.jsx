import React, { useContext, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext, fireBaseContext } from '../../store/Contexts';
import { NavbarLocation, SearchBarContext } from '../../store/FilterContexts';
import Avatar from '../Avatar/Avatar';
import './Navbar.css';
import logo from '../../Images/logo.png';
import Button from '@mui/material/Button';
import { PostContext } from '../../store/PostContext';

function Navbar() {
  const { User } = useContext(AuthContext);
  const { firebasedb } = useContext(fireBaseContext);
  const { setLocationSearch } = useContext(NavbarLocation);
  const { setSearchBarValue, setSearchResults } = useContext(SearchBarContext);
  const { setPost } = useContext(PostContext);
  const history = useHistory();
  const [Scroll, setScroll] = useState(false);
  const [locationSearch, setLocationsearch] = useState();
  const [error, setError] = useState();
  const [closeError, setCloseError] = useState(false);
  const [locations, setLocations] = useState([]);
  const [data, setData] = useState([]);
  const [inputVal, setInputVal] = useState();
  const [locationAuto, setLocationAuto] = useState(false);
  const [searchAuto, setSearchAuto] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [searchData, setSearchData] = useState([]);
  const [searchAutoData, setSearchAutoData] = useState([]);
  const [uniqueState, setUniqueState] = useState(null);
  const searchValueRef = useRef();

  useEffect(() => {
    let db = firebasedb
      .firestore()
      .collection('posts')
      .get()
      .then(function (res) {
        let newData = res.docs.map((doc) => {
          return {
            locationExact: doc.data().locationExact,
            state: doc.data().state,
          };
        });
        let searchauto = res.docs.map((doc) => {
          return { ...doc.data(), docid: doc.id };
        });
        setData(newData);
        setLocations(newData);
        setSearchAutoData(searchauto);
        setSearchData(searchauto);
      })
      .catch((err) => {
        setError(err.message);
        setCloseError(true);
      });
    return () => db;
  }, []);

  useEffect(() => {
    locationSearching();
    searchAutoComplete();
  }, [locationSearch, searchValue]);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 550) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  });

  function locationSearching() {
    if (locationSearch === '') {
      setLocations(data);
      setLocationAuto(false);
    }

    if (locationSearch) {
      setLocationAuto(true);
      let location = data.filter((loc) => {
        const state = loc.state;
        const locationExact = loc.locationExact;
        if (state.toLowerCase().includes(locationSearch.toLowerCase())) {
          return state;
        }
        if (
          locationExact.toLowerCase().includes(locationSearch.toLowerCase())
        ) {
          return locationExact;
        }
      });

      if (location.length !== 0) {
        let uniqueLocationExactVals = [
          ...new Set(
            location.map((val) => {
              return { locationExact: val.locationExact };
            })
          ),
        ];
        let uniqueLocationStateVals = [
          ...new Set(location.map((val) => val.state)),
        ];
        const [element] = uniqueLocationStateVals;
        setUniqueState(element);
        let val = uniqueLocationExactVals.map((el) => {
          return { ...el, state: element };
        });
        setLocations(val);
      }
    }
  }

  function searchAutoComplete() {
    if (searchValue === '') {
      setSearchData(searchAutoData);
      setSearchAuto(false);
    }
    if (searchValue) {
      setSearchAuto(true);
      let search = searchAutoData.filter((val) => {
        const title = val.title;
        const desc = val.description;
        const category = val.Category;
        const type = val.type;
        let carBrand = val.carBrand;
        let bikeBrand = val.BikeBrand;
        if (title.toLowerCase().includes(searchValue.toLowerCase())) {
          return title;
        }

        if (category.toLowerCase().includes(searchValue.toLowerCase())) {
          return category;
        }
        if (desc.toLowerCase().includes(searchValue.toLowerCase())) {
          return category;
        }
        if (type) {
          if (type.toLowerCase().includes(searchValue.toLowerCase())) {
            return type;
          }
        }
        if (carBrand) {
          if (carBrand.toLowerCase().includes(searchValue.toLowerCase())) {
            return carBrand;
          }
        }
        if (bikeBrand) {
          if (bikeBrand.toLowerCase().includes(searchValue.toLowerCase())) {
            return bikeBrand;
          }
        }
      });
      if (search.length !== 0) {
        setSearchData(search);
      }
    }
  }

  function handleLocationInp(e) {
    setInputVal(e.target.innerText);
    setLocationSearch(document.querySelector('.location-inp').value);
    setLocationAuto(false);
    document.querySelector('.location-inp').value = '';
  }

  function handleSearch(value) {
    setSearchBarValue(value);
    setSearchAuto(false);
    if (value) {
      let searchvalue = searchAutoData.filter((post) => {
        let category = post.Category;
        let carbrand = post.carBrand;
        let bikebrand = post.BikeBrand;
        let Type = post.type;
        let title = post.title;
        let stateval = post.state;

        if (category.toLowerCase().includes(value.toLowerCase())) {
          return category;
        } else if (
          carbrand &&
          carbrand.toLowerCase().includes(value.toLowerCase())
        ) {
          return carbrand;
        } else if (
          bikebrand &&
          bikebrand.toLowerCase().includes(value.toLowerCase())
        ) {
          return bikebrand;
        } else if (Type && Type.toLowerCase().includes(value.toLowerCase())) {
          return Type;
        } else if (title.toLowerCase().includes(value.toLowerCase())) {
          return title;
        } else if (stateval.toLowerCase().includes(value.toLowerCase())) {
          return stateval;
        } else if (
          post.locationExact.toLowerCase().includes(value.toLowerCase())
        ) {
          return post.locationExact;
        } else if (
          post.description.toLowerCase().includes(value.toLowerCase())
        ) {
          return post.description;
        }
      });
      if (searchvalue.length !== 0) {
        setSearchResults(searchvalue);
      }
      history.push('/filter-post');
    }
  }

  function backtoTop() {
    window.scrollTo(0, 0);
  }
  return (
    <>
      {error && (
        <div className={closeError ? 'update-errors' : 'update-errors'}>
          <button
            className='close-error'
            title='Close'
            onClick={() => {
              setCloseError(false);
              setError(null);
            }}
          >
            &times;
          </button>
          {error}
        </div>
      )}
      <div className='navbar'>
        <button
          onClick={backtoTop}
          className={Scroll ? 'back-to-top toTop' : 'back-to-top'}
        >
          <svg
            width='22px'
            height='22px'
            viewBox='0 0 1024 1024'
            data-aut-id='icon'
          >
            <path d='M85.392 746.667h60.331l366.336-366.336 366.336 366.336h60.331v-60.331l-408.981-409.003h-35.307l-409.045 409.003z'></path>
          </svg>
          Back to top
        </button>
        <div className='logo' onClick={() => history.push('/')}>
          <img
            src={logo}
            style={{ width: '100px', height: '80px', marginTop: '10px' }}
            alt=''
          />
        </div>
        <ul className='nav-items'>
          <li className='location'>
            <span className='search'>
              <svg
                width='25px'
                height='25px'
                viewBox='0 0 1024 1024'
                data-aut-id='icon'
                
              >
                <path d='M448 725.333c-152.917 0-277.333-124.416-277.333-277.333s124.416-277.333 277.333-277.333c152.917 0 277.333 124.416 277.333 277.333s-124.416 277.333-277.333 277.333v0zM884.437 824.107v0.021l-151.915-151.936c48.768-61.781 78.144-139.541 78.144-224.192 0-199.979-162.688-362.667-362.667-362.667s-362.667 162.688-362.667 362.667c0 199.979 162.688 362.667 362.667 362.667 84.629 0 162.411-29.376 224.171-78.144l206.144 206.144h60.352v-60.331l-54.229-54.229z'></path>
              </svg>
            </span>
            <input
              type='search'
              className='location-inp'
              placeholder={
                inputVal ? inputVal : 'Search city'
              }
              onChange={(e) => setLocationsearch(e.target.value)}
            />
          
            {locationAuto && (
              <span className='location-auto-complete'>
                <div>
                  <p onClick={handleLocationInp}>
                    {uniqueState && uniqueState}
                  </p>
                  {locations.map((val, key) => {
                    return (
                      <p key={key} onClick={handleLocationInp}>
                        {val
                          ? `${val.state ? val.state : ''}, ${
                              val.locationExact
                            }`
                          : `${val.state}, ${val.locationExact}`}
                      </p>
                    );
                  })}
                </div>
              </span>
            )}
          </li>
          <li className='search-box'>
            <input
              ref={searchValueRef}
              type='search'
              className='search-bar'
              placeholder='Find services....'
              onChange={(e) => setSearchValue(e.target.value)}
            />

            <button
              className='search-btn'
              onClick={() => handleSearch(searchValueRef.current.value)}
            >
              <svg
                width='25px'
                height='25px'
                viewBox='0 0 1024 1024'
                data-aut-id='icon'
              >
                <path d='M448 725.333c-152.917 0-277.333-124.416-277.333-277.333s124.416-277.333 277.333-277.333c152.917 0 277.333 124.416 277.333 277.333s-124.416 277.333-277.333 277.333v0zM884.437 824.107v0.021l-151.915-151.936c48.768-61.781 78.144-139.541 78.144-224.192 0-199.979-162.688-362.667-362.667-362.667s-362.667 162.688-362.667 362.667c0 199.979 162.688 362.667 362.667 362.667 84.629 0 162.411-29.376 224.171-78.144l206.144 206.144h60.352v-60.331l-54.229-54.229z'></path>
              </svg>
            </button>
            {searchAuto && (
              <span className='search-auto-complete'>
                {searchData.map((value, key) => {
                  return (
                    <div key={key}>
                      {value.Category && (
                        <p onClick={() => handleSearch(value.Category)}>
                          Category: {value.Category ? value.Category : ''}
                        </p>
                      )}
                      
                      {value.type && (
                        <p onClick={() => handleSearch(value.type)}>
                          Type: {value.type ? value.type : ''}
                        </p>
                      )}
                      {value.title && (
                        <p
                          onClick={() => {
                            setPost(value);
                            history.push('/view-more-about-post');
                          }}
                        >
                          Go to: {value.title ? value.title : ''}
                        </p>
                      )}
                    </div>
                  );
                })}
              </span>
            )}
          </li>
          <li className='login-sell-links'>
            {User ? (
              <Avatar className='avatar-navbar' />
            ) : (
              <span className='login' onClick={() => history.push('/login')}>
                Login
              </span>
            )}
            <button >
              <span className='sell-btn-container'>
             
              </span>
              <Button variant="contained" color="success" onClick={() => history.push('/post')}>Publish </Button>
              
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
