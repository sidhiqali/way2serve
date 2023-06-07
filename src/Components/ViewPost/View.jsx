import React,{useState,useContext,useEffect} from 'react';
import Slider from 'react-elastic-carousel';
import {toRupees} from '../../usefullFunctions/indianRupeeFormat';
import {toMonthYear} from '../../usefullFunctions/monthYearFormat';
import {fireBaseContext,AuthContext} from '../../store/Contexts';
import {PostContext} from '../../store/PostContext';
import {Userview} from '../../store/UserContext';
import AvatarReact from "react-avatar";
import Preloader from "../preLoader/Preloader";
import {useHistory} from 'react-router-dom';
import './View.css';
import Button from '@mui/material/Button';


  
function ViewPost() {

	const history = useHistory();
	const {firebasedb} = useContext(fireBaseContext);
	const {User} = useContext(AuthContext);
	const {post} = useContext(PostContext);
	const {setUserView} = useContext(Userview);
  const [Googleuser, setGoogleuser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postData,setPostData] = useState();
  const [postImages,setPostImages] = useState([]);
  const [dataLoading,setDataLoading] = useState(false);
  const [error,setError] = useState();
  const [closeError,setCloseError] = useState(false);
  const [date,setDate] = useState();
  const [userDetails,setUserDetails] = useState();
  const [carsCategory,setCarsCategory] = useState(false);
  const [otherCategory,setOtherCategory] = useState(false);
  const [propCategory,setPropCategory] = useState(false);
  const [openSuccess,setOpenSuccess] = useState(false);


	useEffect(() => {
		setLoading(true);
		setPostData(post);
		setPostImages(post.images);

		if (postData) {
			firebasedb.firestore().collection('users').doc(post.id).get().then(res => {
					setUserDetails(res.data());
			}).then(() => {
      	setDate(toMonthYear(userDetails && userDetails.creationTime));
			}).catch((err) => {
				setError(err.message);
				setCloseError(true)
			});
			
			if (postData.Category === 'OLX Autos (Cars)') {
    		setCarsCategory(true);
    	}else if (postData.Category === 'Properties'){
    		setOtherCategory(true)
    		setPropCategory(true);
    	}else {
    		setOtherCategory(true);
    	}

			setDataLoading(true);
			setLoading(false);
		}

		if (!userDetails) {
      setLoading(true);
    } else {
      const googleUser = userDetails.googleUser; 
      if (googleUser === "google.com") {
        setGoogleuser(true);
      }
      setLoading(false)
    }
	},[postData,userDetails]);

  const breakpoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 1, itemsToScroll: 1 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 4 }];

  function handleFavorite (docid) {
    firebasedb.firestore().collection('favorites').doc(docid).set({
      id:User && User.uid
    }).then(() => {
      setOpenSuccess(true)
      setTimeout(() => {setOpenSuccess(false)},5000)
    }).catch(err => {
      setError(err.message)
      setCloseError(true)
    })
  }

	return (
		<>
      {loading && <Preloader sticky/>}
      {openSuccess && <div className="handle-favorite-success">
        Succesfully Added to Favorites
    	</div>}
      {error && <div className={closeError ? "update-errors" : 'update-errors'}>
        <button className='close-error' title='Close' onClick={()=>{
          setCloseError(false)
        }}
        >&times;</button>
        {error}
      </div> }
			 <div className='view-post'>
					{dataLoading && <div className='view-post-slider-details-container'>
						<div className='view-post-slider-container'>
							<div className='view-post-main-slider'>
								<Slider breakPoints={breakpoints}
									renderPagination={({pages,activePage, onClick}) => {
				            return (
				              <div className='view-post-pagination'>
				                {postImages.map((img,index) => {
				                  return <img key={index} src={img} alt="slider"/>
				                })}
				              </div>
			            		);
			          		}}
			       			>
									{
										postImages.map((image,index) => {
											return (
												<img className='view-post-slider-img' key={index} src={image} alt='slider'/>
											)
										})
									}
								</Slider>
							</div>
						</div>
						<div className='view-post-price-dec-details-container'>
								<div className="view-post-price-container">
									<div className="view-post-price">
										<h1>&#x20B9; {toRupees(postData && postData.Salary)}</h1>
										<span className="view-post-favorite" title="Favorite"
										onClick={(e) => {handleFavorite(post.docid);e.stopPropagation()}}>
	                    <svg
	                      width="24px"
	                      height="24px"
	                      viewBox="0 0 1024 1024">
	                      <path
	                        
	                        d="M830.798 448.659l-318.798 389.915-317.828-388.693c-20.461-27.171-31.263-59.345-31.263-93.033 0-85.566 69.605-155.152 155.152-155.152 72.126 0 132.752 49.552 150.051 116.364h87.777c17.299-66.812 77.905-116.364 150.051-116.364 85.547 0 155.152 69.585 155.152 155.152 0 33.687-10.802 65.862-30.293 91.811zM705.939 124.121c-80.853 0-152.204 41.425-193.939 104.204-41.736-62.778-113.086-104.204-193.939-104.204-128.33 0-232.727 104.378-232.727 232.727 0 50.657 16.194 98.948 47.806 140.897l328.766 402.133h100.189l329.716-403.355c30.662-40.727 46.856-89.018 46.856-139.675 0-128.349-104.398-232.727-232.727-232.727z"
	                      ></path>
	                    </svg>
	                  </span>
									</div>
									<div className="view-post-km-year">
	                  <p className="view-post-date-used">{postData.year ? postData.year : postData.type} - {postData.driven ? `${postData.driven } Km`: postData.Category}</p>
									</div>
									<div className="view-post-title">
										<p>{postData && postData.title}</p>
									</div>
									<div className="view-post-date-time">
										<span className="location-posted">{postData.locationExact ? postData.locationExact : 'Unknown'},{postData.state ? postData.state : 'Unknown'}</span>
	                  <span className="date-posted">{postData.datePosted ? postData.datePosted : ''}</span>
									</div>
								</div>
								<div className="view-post-seller-container">
									<h2>User description</h2>
									<div className="view-post-profile-avatar" 
									onClick={() => {
										setUserView(userDetails)
										history.push('/user-profile')
									}}>
			              {Googleuser ? (
			                <img
			                  className="view-post-avatar-google"
			                  src={userDetails && userDetails.photoUrl}
			                  alt="avatar"
			                />
			              ) : (
			                <AvatarReact
			                  className="view-post-avatar-react"
			                  size="90"
			                  round={true}
			                  name={userDetails && userDetails.username}
			                />
			            )}
			             <div className="view-post-username-joined">
			            		<h1>{userDetails && userDetails.username}</h1>
			            		<br/>
			            		{/* <h4>Member since {date ? date : "Someday"}</h4> */}
			             </div>
			            <span className='view-post-arrow'>❯</span>
	              </div>
	              <p className='view-post-phone-number'>
		              <span>
					  <Button variant="contained" color="success"   className='callbutton'><a href={`tel:${postData.phone}`}>Call </a> </Button>
		             	
		              </span> 
	              </p>
							</div>
						<div className="view-post-place-container">
							<h2>Posted In</h2>
							<br/>
	            <p className='location-posted'>{postData.locationExact ? postData.locationExact : 'Unknown'},{postData.state ? postData.state : 'Unknown'}</p>						
						</div>
			{otherCategory &&<div className="view-post-others-container">
				<div className="other-category-details-desc-container">
					<h2>Details</h2>
					{propCategory ?
						(<div className="prop-details-container">
							<p>Type : {postData.type ? postData.type : "Type unknown"}</p>
						</div>)
					:(<div className="others-category-container">
							{postData.salaryPeriod && <p>Salary Period : {postData.salaryPeriod ? postData.salaryPeriod : "No salary period"}</p>}
							{postData.JobPosition && <p>Position : {postData.JobPosition ? postData.JobPosition : "No postion"}</p>}
						</div>)
						
					}	
					<span><h2>Description</h2>
					<div className="others-desc-container">
						{postData.description ? postData.description : "No description provided"}
					</div>
					</span>
				</div>
			</div>}
			</div>
			</div>}
		</div>
	</>
	)
}

export default ViewPost;