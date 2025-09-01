import { useState } from 'react';
import { usePDF } from '@react-pdf/renderer';

// Mocked PDF generation as we can't truly use @react-pdf/renderer in this environment
// This component simulates the functionality and renders a placeholder message.
const Document = ({ children }) => <div>{children}</div>;
const Page = ({ children }) => <div style={{ padding: '20px' }}>{children}</div>;
const Text = ({ children }) => <p style={{ margin: '10px 0' }}>{children}</p>;
const View = ({ children }) => <div>{children}</div>;

/**
 * Main application component for the Digital Instrument Rental Agreement.
 * It manages form state, handles form submission, and displays a
 * printable agreement document.
 */
function App() {
  // State for form fields
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [instrument, setInstrument] = useState('');
  const [brand, setBrand] = useState('');
  const [loanDate, setLoanDate] = useState(new Date().toISOString().slice(0, 10));
  const [defects, setDefects] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // State for the signature pad data (simulated)
  const [parentSignature, setParentSignature] = useState(null);
  const [studentSignature, setStudentSignature] = useState(null);
  
  // State for signature pad modal visibility
  const [isParentSigning, setIsParentSigning] = useState(false);
  const [isStudentSigning, setIsStudentSigning] = useState(false);
  
  // State for form validation errors
  const [errors, setErrors] = useState({});

  /**
   * Generates the PDF document based on form data.
   * This is a mock function since we can't run @react-pdf/renderer
   * directly in the browser environment.
   */
  const AgreementDocument = (
    <Document>
      <Page size="A4">
        <View>
          <Text className="text-xl font-bold">Waterloo School District Musical Instrument Use Agreement</Text>
          <Text className="mt-4">Student Name: {studentName}</Text>
          <Text>Parent/Guardian Name: {parentName}</Text>
          <Text>Address: {address}</Text>
          <Text>Phone Number: {phoneNumber}</Text>
          <Text>Loan Date: {loanDate}</Text>
          <Text>Instrument: {instrument}</Text>
          <Text>Brand and Serial #: {brand}</Text>
          <Text>Conditions/Defects: {defects}</Text>
          <View className="mt-8">
            <Text className="text-lg font-semibold">Student and Parent/Guardian agree to the following:</Text>
            <Text className="ml-4">1. The student will practice as directed by the music teacher.</Text>
            <Text className="ml-4">2. The student and parent/guardian will be personally responsible for any damage to this instrument while in the student’s care.</Text>
            <Text className="ml-4">3. The student and parent/guardian will return this instrument upon request of the music teacher, in as good condition as received, ordinary wear and depreciation expected.</Text>
          </View>
          <View className="mt-8 flex flex-row justify-between w-full">
            <View>
              <Text>______________________________</Text>
              <Text>Parent/Guardian Signature</Text>
            </View>
            <View>
              <Text>______________________________</Text>
              <Text>Student Signature</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  const [instance, updateInstance] = usePDF({ document: AgreementDocument });

  /**
   * Handles the form submission process.
   * Validates fields and, if successful, submits the form.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!studentName) newErrors.studentName = 'Student Name is required.';
    if (!parentName) newErrors.parentName = 'Parent/Guardian Name is required.';
    if (!address) newErrors.address = 'Address is required.';
    if (!phoneNumber) newErrors.phoneNumber = 'Phone Number is required.';
    if (!instrument) newErrors.instrument = 'Instrument is required.';
    if (!brand) newErrors.brand = 'Brand and Serial # is required.';
    if (!parentSignature) newErrors.parentSignature = 'Parent/Guardian signature is required.';
    if (!studentSignature) newErrors.studentSignature = 'Student signature is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsSubmitted(true);
    updateInstance();
  };

  /**
   * Clears the form and resets state to its initial values.
   */
  const handleNewForm = () => {
    setStudentName('');
    setParentName('');
    setAddress('');
    setPhoneNumber('');
    setInstrument('');
    setBrand('');
    setDefects('');
    setParentSignature(null);
    setStudentSignature(null);
    setIsSubmitted(false);
  };

  /**
   * Opens the signature pad modal.
   * @param {'parent' | 'student'} signer - The person who is signing.
   */
  const openSignaturePad = (signer) => {
    if (signer === 'parent') {
      setIsParentSigning(true);
    } else {
      setIsStudentSigning(true);
    }
  };

  /**
   * Saves the signature from the pad.
   * @param {'parent' | 'student'} signer - The person who is signing.
   */
  const saveSignature = (signer) => {
    const signatureData = "mock-signature-data"; // In a real app, this would be data from a signature pad
    if (signer === 'parent') {
      setParentSignature(signatureData);
      setIsParentSigning(false);
    } else {
      setStudentSignature(signatureData);
      setIsStudentSigning(false);
    }
  };

  /**
   * The signature pad modal component.
   * In a real app, this would be a full-featured signature canvas.
   */
  const SignaturePadModal = ({ signer, isOpen, onClose, onSave }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">Sign as {signer === 'parent' ? 'Parent/Guardian' : 'Student'}</h2>
          <div className="h-40 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 mb-4">
            {/* This is a mock signature pad */}
            <p>Signature Pad Mock-up</p>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(signer)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Signature
            </button>
          </div>
        </div>
      </div>
    );
  };

  // The main rendering block for the application UI
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex flex-col items-center">
      {/* Signature Pad Modals */}
      <SignaturePadModal
        signer="parent"
        isOpen={isParentSigning}
        onClose={() => setIsParentSigning(false)}
        onSave={saveSignature}
      />
      <SignaturePadModal
        signer="student"
        isOpen={isStudentSigning}
        onClose={() => setIsStudentSigning(false)}
        onSave={saveSignature}
      />

      {/* Main Container Card */}
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-10 w-full max-w-4xl border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">Waterloo School District</h1>
          <h2 className="text-xl text-gray-600 mt-2">Musical Instrument Use Agreement</h2>
        </div>
        
        {/* Form Section */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="studentName">Student Name</label>
                <input
                  id="studentName"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.studentName && <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="parentName">Parent/Guardian Name</label>
                <input
                  id="parentName"
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.parentName && <p className="text-red-500 text-sm mt-1">{errors.parentName}</p>}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="address">Address</label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="phoneNumber">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="instrument">Instrument</label>
                <input
                  id="instrument"
                  type="text"
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.instrument && <p className="text-red-500 text-sm mt-1">{errors.instrument}</p>}
              </div>
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="brand">Brand and Serial #</label>
              <input
                id="brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="defects">Conditions/Defects</label>
              <textarea
                id="defects"
                value={defects}
                onChange={(e) => setDefects(e.target.value)}
                rows="3"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Parent Signature</label>
                <button
                  type="button"
                  onClick={() => openSignaturePad('parent')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {parentSignature ? 'Change Signature' : 'Sign Here'}
                </button>
                {errors.parentSignature && <p className="text-red-500 text-sm mt-1">{errors.parentSignature}</p>}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Student Signature</label>
                <button
                  type="button"
                  onClick={() => openSignaturePad('student')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {studentSignature ? 'Change Signature' : 'Sign Here'}
                </button>
                {errors.studentSignature && <p className="text-red-500 text-sm mt-1">{errors.studentSignature}</p>}
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors transform hover:scale-105"
              >
                Submit & Generate Agreement
              </button>
            </div>
          </form>
        ) : (
          /* Submission Success and Print View */
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Agreement Submitted!</h3>
            <p className="text-gray-600 mb-6">Thank you for completing the form. You can now download the official agreement.</p>
            <a
              href={instance.url}
              download="instrument_agreement.pdf"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors transform hover:scale-105"
            >
              Download PDF Agreement
            </a>
            <button
              onClick={handleNewForm}
              className="w-full sm:w-auto mt-4 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors"
            >
              Start New Form
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
