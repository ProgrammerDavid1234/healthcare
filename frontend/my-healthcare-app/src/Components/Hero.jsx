import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Your Health Is Our <span className="text-blue-600">Top Priority</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              We provide the highest quality healthcare services with a team of experienced professionals dedicated to your wellbeing.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center">
                Book an Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-md text-base font-medium border border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Healthcare professionals" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">15+</p>
              <p className="text-gray-600 mt-1">Years Experience</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">50+</p>
              <p className="text-gray-600 mt-1">Specialists</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">10k+</p>
              <p className="text-gray-600 mt-1">Happy Patients</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">24/7</p>
              <p className="text-gray-600 mt-1">Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;