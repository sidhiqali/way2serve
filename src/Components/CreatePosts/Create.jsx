import React, { useContext, useEffect, useState } from 'react';
import './Create.css';
import Preloader from '../preLoader/Preloader';
import { fireBaseContext, AuthContext } from '../../store/Contexts';
import { useHistory } from 'react-router-dom';
// import sub components

import Jobs from './jobs';

function Create() {
  const history = useHistory();
  const { User } = useContext(AuthContext);
  const { firebasedb } = useContext(fireBaseContext);
  const [titleLength, setTitleLength] = useState();
  const [descLength, setDescLength] = useState();
  const [descLengthError, setDescLengthError] = useState(false);
  const [titleLengthError, setTitleLengthError] = useState(false);
  const [jobs, setJobs] = useState(false);
  const [imgFiles, setImgFiles] = useState([]);
  //form input states
  const [JobSalary, setJobSalary] = useState();
  const [JobPosition, setJobPosition] = useState();
  const [adCategory, setAdCategory] = useState();
  const [adLocation, setAdLocation] = useState();
   const [adTitleInput, setAdTitleInput] = useState();
  const [adDescInput, setAdDescInput] = useState();
  const [adExactLocationInput, setAdExactLocationInput] = useState();
  const [adPhoneInput, setAdPhoneInput] = useState();
  const [adJobSalary, setAdJobSalary] = useState();
  const [AllImages, setAllImages] = useState([]);
  // errors,after uploads and progress
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [closeError, setCloseError] = useState(true);
  const [openProgress, setOpenProgress] = useState(false);
  const [isImgPresent, setIsImagePresent] = useState(false);

  const Categories = [
    { category: 'Tree climber' },
    { category: 'Mechanic' },
    { category: 'Plumber' },
    { category: 'Painter' },
    { category: 'Artist' },
    { category: 'Nurse' },
    { category: 'Doctor' },
    { category: 'Freelancer' },
    { category: 'Designer' },
    { category: 'Teacher' },
    { category: 'Driver' },
    { category: 'Cook' },
    { category: 'Singer' },
    { category: 'security' },
    { category: 'gardner' },
  ];
  const districts = [
    'Alappuzha',
    'Ernakulam',
    'Idukki',
    'Kannur',
    'Kannur',
    'Kasargod',
    'Kollam',
    'Kottayam',
    'Kozhikkod',
    'Malappuram',
    'Palakkad',
    'Pathanamthitta',
    'Thiruvananthapuram',
    'Thrissur',
    'Wayanad',
  ];

  useEffect(() => {
    LengthChangeInput();
    getFormValues();
    if (!User) {
      history.push('/login');
    }
    // console.log(basicDetails)
  });

  let date = new Date();
  // firebase object that's common for all categories;
  const basicDetails = {
    id: User && User.uid,
    title: adTitleInput,
    description: adDescInput,
    locationExact: adExactLocationInput ? adExactLocationInput : 'No Location',
    state: adLocation ? adLocation : 'No state',
    phone: adPhoneInput,
    datePosted: date.toDateString(),
    Category: adCategory,
    images: [],
  };

  window.onbeforeunload = function () {
    window.setTimeout(function () {
      window.location = '/';
    }, 0);
    window.onbeforeunload = null;
  };

  function customSelectOptions(e) {
    setAdCategory(e.target.value);

    setJobs(true);
  }
  function LengthChangeInput() {
    const adDesc = document.querySelector('#setAdDesc');
    const adTitle = document.querySelector('#setAdTitle');

    adDesc.addEventListener('input', (e) => {
      setDescLength(e.target.value.length);
      if (e.target.value.length > 4096) {
        setDescLengthError(true);
      } else {
        setDescLengthError(false);
      }
    });
    adTitle.addEventListener('input', (e) => {
      setTitleLength(e.target.value.length);
      if (e.target.value.length > 70) {
        setTitleLengthError(true);
      } else {
        setTitleLengthError(false);
      }
    });
  }

  function ImageUpload() {
    const fileInput = document.querySelector('input[type=file]');
    fileInput.click();
  }
  function fileInputChanged(e) {
    const images = e.target.files;
    setAllImages(images);
    if (images) {
      setIsImagePresent(true);
      const imageArray = Array.from(images).map((img) =>
        URL.createObjectURL(img)
      );
      setImgFiles((image) => image.concat(imageArray));
    }
  }

  function getFormValues() {
    // all radio buttons

    document.querySelectorAll('input[name=jobSalary]').forEach((jobSalary) => {
      jobSalary.addEventListener('change', (e) => setJobSalary(e.target.value));
    });
    document
      .querySelectorAll('input[name=jobPosition]')
      .forEach((jobPosition) => {
        jobPosition.addEventListener('change', (e) =>
          setJobPosition(e.target.value)
        );
      });

    // All selects

    // All text and number inputs

    if (jobs) {
      document
        .querySelector('input[data-jobsalaryfrom]')
        .addEventListener('change', (e) => setAdJobSalary(e.target.value));
    }
  }

  function handlePostCreation(e) {
    e.preventDefault();
    if (!isImgPresent) {
      alert('You Sholud upload Images its Mandatory');
      return;
    }
    if (!adTitleInput) {
      alert(
        'You have to provide the basic information about the product you are selling like Title,Category,Price,Description,Image etc.'
      );
      return;
    }
    if (!adDescInput) {
      alert(
        'You have to provide the basic information about the product you are selling like Title,Category,Price,Description,Image etc.'
      );
      return;
    }

    if (!adCategory) {
      alert(
        'You have to provide the basic information about the product you are selling like Title,Category,Price,Description,Image etc.'
      );
      return;
    }
    if (!adPhoneInput) {
      alert('Enter Your Mobile number');
      return;
    }
    setOpenProgress(true);
    setLoading(true);
    let imageUpload;

    for (var i = 0; i < AllImages.length; i++) {
      imageUpload = firebasedb
        .storage()
        .ref(`post-images/${AllImages[i].name}`)
        .put(AllImages[i]);
    }

    imageUpload.on(
      'state_changed',
      (snapshot) => {
        setProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        );
      },
      (error) => {
        setError(error.message);
        setCloseError(true);
      },
      () => {
        let task;
        for (var i = 0; i < AllImages.length; i++) {
          task = firebasedb
            .storage()
            .ref()
            .child(`post-images/${AllImages[i].name}`)
            .getDownloadURL()
            .then((downloadURLs) => {
              basicDetails.images.push(downloadURLs);
              setOpenProgress(false);
            })
            .catch((error) => {
              setError(error.message);
              setCloseError(true);
            });
        }
        task.then(() => {
          if (jobs) {
            firebasedb
              .firestore()
              .collection('posts')
              .add({
                ...basicDetails,
                salaryPeriod: JobSalary ? JobSalary : 'No salaryPeriod',
                JobPosition: JobPosition ? JobPosition : 'No postiton',
                Salary: adJobSalary ? adJobSalary : 'No Salaryfrom',
              })
              .then(() => {
                setLoading(false);
                history.push('/');
              })
              .catch((error) => {
                setError(error.message);
                setCloseError(true);
              });
          } else {
            alert('No Category was selected');
            return;
          }
        });
      }
    );
  }

  return (
    <>
      {loading && <Preloader sticky />}
      {error && (
        <div
          className={
            closeError ? 'update-errors' : 'update-errors update-close'
          }
        >
          <button
            className='close-error'
            title='Close'
            onClick={() => {
              setCloseError(false);
              setLoading(false);
            }}
          >
            &times;
          </button>
          {error}
        </div>
      )}
      {openProgress && (
        <div className='create-ad-file-upload-progress'>
          <p className='upload-progress-file-text'>
            File Upload Progress: {progress}%
          </p>
          <div className='upload-progress-file'>
            <div
              className='upload-progress-file-thumb'
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      <div className='create-ad-navbar'>
        <div
          title='Go Home'
          className='logo-ad-navbar'
          onClick={() => history.push('/')}
        >
        </div>
      </div>
      {/*navbar end*/}
      <div className='create-ad-container'>
        <div className='create-ad-title'>POST YOUR AD</div>
        <div className='create-ad-form-container'>
          <div className='create-ad-form-title'>CHOOSE A CATEGORY</div>
          <form className='create-ad-form'>
            <div className='create-ad-category'>
              <label
                className='create-ad-category-title'
                htmlFor='create-ad-category-select'
              >
                Select a Category:
              </label>
              <span className='down-icon-select'>
                <svg
                  width='24px'
                  height='24px'
                  viewBox='0 0 1024 1024'
                  data-aut-id='icon'
                >
                  <path d='M85.392 277.333h60.331l366.336 366.336 366.336-366.336h60.331v60.331l-408.981 409.003h-35.307l-409.045-409.003z'></path>
                </svg>
              </span>

              <select
                id='create-ad-category-select'
                onChange={customSelectOptions}
                required
              >
                <option disabled selected>
                  Choose a Category
                </option>
                {Categories.map((option) => {
                  return (
                    <option key={option.category} value={option.category}>
                      {option.category}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className='create-ad-include-title'>INCLUDE SOME DETAILS</div>

            {jobs && <Jobs />}

            <div className='create-ad-set-title-desc'>
              <label htmlFor='setAdTitle'>Ad Title *</label>
              <div className='create-ad-set-title'>
                <input
                  id='setAdTitle'
                  className={
                    titleLengthError
                      ? 'create-ad-set-title-input create-ad-form-input-error'
                      : 'create-ad-set-title-input'
                  }
                  type='text'
                  onChange={(e) => setAdTitleInput(e.target.value)}
                  required
                />
                <div className='create-ad-set-title-spans'>
                  <span className='create-ad-set-title-sub'>
                    Mention the key features of your item (e.g. brand, model,
                    age, type)
                  </span>
                  <span className='create-ad-set-title-length'>
                    {titleLength ? titleLength : 0} / 70
                  </span>
                </div>
              </div>
              <label htmlFor='setAdDesc'>Description *</label>
              <div className='create-ad-set-desc'>
                <textarea
                  id='setAdDesc'
                  className={
                    descLengthError
                      ? 'create-ad-set-desc-input create-ad-form-input-error'
                      : 'create-ad-set-desc-input'
                  }
                  onChange={(e) => setAdDescInput(e.target.value)}
                  required
                ></textarea>
                <div className='create-ad-set-desc-spans'>
                  <span className='create-ad-set-desc-sub'>
                    Include condition, features and reason for selling
                  </span>
                  <span className='create-ad-set-desc-length'>
                    {descLength ? descLength : 0} / 4096
                  </span>
                </div>
              </div>
            </div>

            <div className='create-ad-file-upload'>
              <label>
                You can select multiple Images. (less than 5 is fine){' '}
                <span style={{ color: 'red' }}>* This Field is Mandatory</span>
              </label>
              <br />
              <input
                type='file'
                multiple
                hidden
                onChange={fileInputChanged}
                required
              />
              <button
                className='create-ad-file-upload-btn'
                type='button'
                onClick={ImageUpload}
              >
                Upload Images
              </button>
              <div className='create-ad-files'>
                {imgFiles.map((imgs, index) => {
                  return (
                    <img
                      key={index}
                      className='create-ad-file-preview'
                      src={imgs}
                      alt='UploadedPics'
                    />
                  );
                })}
              </div>
            </div>

            <div className='create-ad-set-location'>
              <div className='create-ad-set-location-title'>
                SET YOUR LOCATION
              </div>
              <div className='create-ad-location'>
                <label>Select *</label>
                <span className='down-icon-select-location'>
                  <svg
                    width='24px'
                    height='24px'
                    viewBox='0 0 1024 1024'
                    data-aut-id='icon'
                  >
                    <path d='M85.392 277.333h60.331l366.336 366.336 366.336-366.336h60.331v60.331l-408.981 409.003h-35.307l-409.045-409.003z'></path>
                  </svg>
                </span>
                <select
                  id='create-ad-location-select'
                  onChange={(e) => setAdLocation(e.target.value)}
                  required
                >
                  <option disabled selected></option>
                  {districts.map((option) => {
                    return (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </select>
              </div>
              <label>Enter your Location *</label>
              <div className='create-ad-set-location-input'>
                <input
                  id='setAdExactLocation'
                  type='text'
                  onChange={(e) => setAdExactLocationInput(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className='create-ad-set-phone'>
              <div className='create-ad-set-phone-title'>
                ENTER YOUR PHONE NUMBER
              </div>
              <div className='create-ad-set-phone-input'>
                <span className='create-ad-set-phone-input-icon'>+91</span>
                <input
                  id='setAdPhone'
                  type='tel'
                  onChange={(e) => setAdPhoneInput(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className='create-ad-submit'>
              <button
                className='create-ad-submit-btn'
                type='submit'
                onClick={handlePostCreation}
              >
                Create Post
              </button>
            </div>
          </form>
        </div>
      </div>
      {/*footer*/}
      <div className='create-ad-footer'>
        
        <div>Free Classifieds in India. © 2006-2021 OLX</div>
      </div>
    </>
  );
}

export default Create;
