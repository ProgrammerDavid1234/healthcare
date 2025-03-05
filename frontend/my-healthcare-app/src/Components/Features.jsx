import React from 'react';
import { ChevronRight } from 'lucide-react';

const Features = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
            <h2 className="text-3xl fon t-bold text-gray-900 sm:text-4xl mb-6">
              Why Choose Our Healthcare Services?
            </h2>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                    <ChevronRight className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Experienced Medical Professionals</h3>
                  <p className="mt-2 text-gray-600">
                    Our team consists of highly qualified doctors and specialists with years of experience.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                    <ChevronRight className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">State-of-the-Art Facilities</h3>
                  <p className="mt-2 text-gray-600">
                    We use the latest medical equipment and technologies to provide the best care possible.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                    <ChevronRight className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Patient-Centered Approach</h3>
                  <p className="mt-2 text-gray-600">
                    We prioritize your comfort and well-being, ensuring personalized care for every patient.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                    <ChevronRight className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Affordable Healthcare</h3>
                  <p className="mt-2 text-gray-600">
                    We believe quality healthcare should be accessible to everyone, with transparent pricing.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Modern healthcare facility" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;