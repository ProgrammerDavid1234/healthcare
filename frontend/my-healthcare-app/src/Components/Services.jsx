import React from 'react';
import { Heart, Activity, Calendar, Users } from 'lucide-react';

const services = [
  {
    title: 'Primary Care',
    description: 'Comprehensive healthcare services for patients of all ages, focusing on prevention, diagnosis, and treatment.',
    icon: <Heart className="h-10 w-10 text-blue-600" />
  },
  {
    title: 'Specialized Treatment',
    description: 'Advanced medical care from specialists in cardiology, neurology, orthopedics, and more.',
    icon: <Activity className="h-10 w-10 text-blue-600" />
  },
  {
    title: 'Online Appointments',
    description: 'Schedule appointments online and connect with healthcare professionals from the comfort of your home.',
    icon: <Calendar className="h-10 w-10 text-blue-600" />
  },
  {
    title: 'Family Medicine',
    description: 'Comprehensive healthcare for the entire family, from infants to seniors, with a focus on preventive care.',
    icon: <Users className="h-10 w-10 text-blue-600" />
  }
];

const Services = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Services</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We offer a wide range of healthcare services to meet your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;