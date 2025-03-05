import React from 'react';

const CallToAction = () => {
  return (
    <div className="bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to prioritize your health?
            </h2>
            <p className="mt-3 text-lg text-blue-100 max-w-3xl">
              Schedule an appointment today and take the first step towards better health. Our team of healthcare professionals is ready to provide you with the care you deserve.
            </p>
          </div>
          <div className="md:w-1/3 md:text-right">
            <button className="w-full md:w-auto bg-white text-blue-600 px-6 py-3 rounded-md text-base font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Book an Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;