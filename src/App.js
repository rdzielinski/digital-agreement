import React, { useState } from 'react';

const App = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    address: '',
    phoneNumber: '',
    instrument: '',
    accessories: '',
    brandSerial: '',
    instrumentCondition: '',
    parentSignature: '',
    studentSignature: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real application, you would send this data to a server
    // or generate a PDF here. For this example, we just display it.
    console.log('Form Submitted:', formData);
    // Optionally, you can trigger a print dialog here
    // window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-8 lg:p-10 border border-blue-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-800 mb-6 sm:mb-8">
          Waterloo School District Instrument Rental Agreement
        </h1>

        {isSubmitted ? (
          <div className="text-center p-8 bg-green-50 text-green-800 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold mb-4">Agreement Submitted Successfully!</h2>
            <p className="text-lg">Thank you for completing the rental agreement.</p>
            <p className="mt-4 text-sm text-gray-600">
              (In a real application, this would typically be saved or sent to the school.)
            </p>
            <button
              onClick={() => window.print()}
              className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
              Print This Page
            </button>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-6 ml-4 px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition duration-300 transform hover:scale-105"
            >
              Edit Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b pb-2 border-blue-200">Rental Fee & Security</h2>
              <p className="text-gray-700 mb-3">
                The annual instrument rental/use fee is <strong className="text-blue-800">$50.00</strong> for the entire school year.
                Please make checks payable to the <strong className="text-blue-800">Waterloo School District</strong>. The rental fee
                must be paid before your child can receive a school instrument.
              </p>
              <p className="text-gray-700">
                Master Locks are available to borrow for band locker storage. If students choose not to use a lock,
                the school district is not responsible for any lost or stolen items.
              </p>
            </section>

            <section className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">Student & Parent/Guardian Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">Student Name:</label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name:</label>
                  <input
                    type="text"
                    id="parentName"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    required
                  />
                </div>
                <div className="col-span-full">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address:</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    required
                  />
                </div>
                <div className="col-span-full">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number:</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    required
                  />
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">Instrument Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label htmlFor="instrument" className="block text-sm font-medium text-gray-700 mb-1">Instrument:</label>
                  <input
                    type="text"
                    id="instrument"
                    name="instrument"
                    value={formData.instrument}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label htmlFor="accessories" className="block text-sm font-medium text-gray-700 mb-1">Accessories (if any):</label>
                  <input
                    type="text"
                    id="accessories"
                    name="accessories"
                    value={formData.accessories}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  />
                </div>
                <div className="col-span-full">
                  <label htmlFor="brandSerial" className="block text-sm font-medium text-gray-700 mb-1">Brand and Serial Number:</label>
                  <input
                    type="text"
                    id="brandSerial"
                    name="brandSerial"
                    value={formData.brandSerial}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    required
                  />
                </div>
                <div className="col-span-full">
                  <label htmlFor="instrumentCondition" className="block text-sm font-medium text-gray-700 mb-1">
                    Please describe the condition of the instrument and any defects:
                  </label>
                  <textarea
                    id="instrumentCondition"
                    name="instrumentCondition"
                    rows="4"
                    value={formData.instrumentCondition}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    required
                  ></textarea>
                </div>
              </div>
            </section>

            <section className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b pb-2 border-blue-200">Agreement Terms</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>The student will practice according to the instruction of the music teacher.</li>
                <li>The parent/guardian and student will be personally responsible for any damage to this instrument while in the student’s care.</li>
                <li>The parent/guardian and student will return this instrument upon the request of the music teacher. The instrument will be returned in as good condition as it was received, with ordinary wear and depreciation expected.</li>
              </ul>
              <p className="mt-5 text-lg font-semibold text-gray-800">
                By providing your digital signature below, you confirm that you have read, understood, and agree to all the terms and conditions stated above.
              </p>
            </section>

            <section className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">Digital Signatures</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label htmlFor="parentSignature" className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Digital Signature (Type Full Name):</label>
                  <input
                    type="text"
                    id="parentSignature"
                    name="parentSignature"
                    value={formData.parentSignature}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    placeholder="e.g., Jane Doe"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label htmlFor="studentSignature" className="block text-sm font-medium text-gray-700 mb-1">Student Digital Signature (Type Full Name):</label>
                  <input
                    type="text"
                    id="studentSignature"
                    name="studentSignature"
                    value={formData.studentSignature}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Submit Rental Agreement
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default App;
