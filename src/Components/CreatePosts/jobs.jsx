import React from 'react';

function Jobs() {
  return (
    <div className='create-ad-jobs-container'>
      <label>Salary period *</label>
      <div className='create-ad-job-salary'>
        <div className='create-ad-job-salary-choice'>
          <label className='create-ad-job-salary-btn'>
            <input
              className='radioBtn'
              type='radio'
              value='Hourly'
              name='jobSalary'
            />
            <span className='Choice-slider'>Hourly</span>
          </label>
          <label className='create-ad-job-salary-btn'>
            <input
              className='radioBtn'
              type='radio'
              value='Monthly'
              name='jobSalary'
            />
            <span className='Choice-slider'>Monthly</span>
          </label>
          <label className='create-ad-job-salary-btn'>
            <input
              className='radioBtn'
              type='radio'
              value='Weekly'
              name='jobSalary'
            />
            <span className='Choice-slider'>Weekly</span>
          </label>
          <label className='create-ad-job-salary-btn'>
            <input
              className='radioBtn'
              type='radio'
              value='Yearly'
              name='jobSalary'
            />
            <span className='Choice-slider'>Daily</span>
          </label>
        </div>
        <label>Position type *</label>
        <div className='create-ad-job-position'>
          <div className='create-ad-job-position-choice'>
            <label className='create-ad-job-position-btn'>
              <input
                className='radioBtn'
                type='radio'
                value='Contract'
                name='jobPosition'
              />
              <span className='Choice-slider'>Contract</span>
            </label>
            <label className='create-ad-job-position-btn'>
              <input
                className='radioBtn'
                type='radio'
                value='Full-time'
                name='jobPosition'
              />
              <span className='Choice-slider'>Full-time</span>
            </label>
            <label className='create-ad-job-position-btn'>
              <input
                className='radioBtn'
                type='radio'
                value='Part-time'
                name='jobPosition'
              />
              <span className='Choice-slider'>Part-time</span>
            </label>
            <label className='create-ad-job-position-btn'>
              <input
                className='radioBtn'
                type='radio'
                value='Temporary'
                name='jobPosition'
              />
              <span className='Choice-slider'>Temporary</span>
            </label>
          </div>
        </div>
        <label>Salary </label>
        <div className='create-ad-job-salary'>
          <input
            type='text'
            className='create-ad-job-salary-input'
            data-jobsalaryfrom
            required
          />
        </div>
      </div>
    </div>
  );
}
export default Jobs;
