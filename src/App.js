import { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import SignatureCanvas from 'react-signature-canvas';

// --- Firebase Project Configuration ---
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// --- Admin User ID ---
// !!! SECURITY WARNING !!!
// This is still not a secure way to handle admin access for a production app.
// Please consider using Firebase Custom Claims in the future.
const ADMIN_UID = 'Lmnop123!@12'; // Replace with your actual admin user ID

const __initial_auth_token = (typeof window !== 'undefined' && window.__initial_auth_token) || null;
/**
 * Main application component for the Digital Instrument Rental Agreement.
 * Manages form state, handles submission, and provides an admin interface.
 */
function App() {
  // Form state
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [parentSignature, setParentSignature] = useState(null);
  const [studentSignature, setStudentSignature] = useState(null);
  const [isParentSigning, setIsParentSigning] = useState(false);
  const [isStudentSigning, setIsStudentSigning] = useState(false);
  const [errors, setErrors] = useState({});

  // Admin state
  const [agreements, setAgreements] = useState([]);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [assignedInstrument, setAssignedInstrument] = useState('');
  const [assignedBrand, setAssignedBrand] = useState('');
  const [assignedDefects, setAssignedDefects] = useState('');

  // Firebase state
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const db = useRef(null);
  const auth = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Refs for signature pads
  const parentSigPad = useRef(null);
  const studentSigPad = useRef(null);

  /**
   * Initializes Firebase and sets up authentication.
   */
  useEffect(() => {
    try {
      if (process.env.REACT_APP_FIREBASE_API_KEY) {
        const app = initializeApp(firebaseConfig);
        db.current = getFirestore(app);
        auth.current = getAuth(app);

        const signIn = async () => {
          if (__initial_auth_token) {
            await signInWithCustomToken(auth.current, __initial_auth_token);
          } else {
            await signInAnonymously(auth.current);
          }
          const currentUserId = auth.current.currentUser?.uid;
          setUserId(currentUserId);
          if (currentUserId === ADMIN_UID) {
            setIsAdmin(true);
          }
          setIsAuthReady(true);
        };
        signIn();
      } else {
        console.error('Firebase configuration is missing. Make sure your .env.local file is set up correctly.');
      }
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
    }
  }, []);

  /**
   * Listens for real-time updates to the 'agreements' collection for the admin.
   */
  useEffect(() => {
    if (!isAuthReady || !db.current || !isAdmin) {
      setAgreements([]);
      return;
    }

    try {
      const agreementsRef = collection(db.current, 'agreements');
      const q = query(agreementsRef);

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const agreementsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAgreements(agreementsList);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching agreements from Firestore:', error);
    }
  }, [isAuthReady, isAdmin]);

  /**
   * Handles form submission for the student/parent view.
   */
  const handleStudentFormSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!studentName) newErrors.studentName = 'Student Name is required.';
    if (!parentName) newErrors.parentName = 'Parent/Guardian Name is required.';
    if (!address) newErrors.address = 'Address is required.';
    if (!phoneNumber) newErrors.phoneNumber = 'Phone Number is required.';
    if (!parentSignature) newErrors.parentSignature = 'Parent/Guardian signature is required.';
    if (!studentSignature) newErrors.studentSignature = 'Student signature is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    if (db.current) {
      try {
        const agreementsRef = collection(db.current, 'agreements');
        await addDoc(agreementsRef, {
          studentName,
          parentName,
          address,
          phoneNumber,
          loanDate: new Date().toISOString().slice(0, 10),
          parentSignature,
          studentSignature,
          instrument: null,
          brand: null,
          defects: null,
          submittedBy: userId,
          timestamp: serverTimestamp()
        });
        console.log('Document successfully written to Firestore!');
        setIsSubmitted(true);
      } catch (error) {
        console.error('Error writing document to Firestore:', error);
      }
    }
  };

  /**
   * Handles form submission for the admin view.
   */
  const handleAdminFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedAgreement && db.current) {
      try {
        const agreementRef = doc(db.current, 'agreements', selectedAgreement.id);
        await updateDoc(agreementRef, {
          instrument: assignedInstrument,
          brand: assignedBrand,
          defects: assignedDefects,
        });
        console.log('Document successfully updated!');
        setSelectedAgreement(null);
        setAssignedInstrument('');
        setAssignedBrand('');
        setAssignedDefects('');
      } catch (error) {
        console.error('Error updating document:', error);
      }
    }
  };
  
  const handleNewForm = () => {
    setStudentName('');
    setParentName('');
    setAddress('');
    setPhoneNumber('');
    setParentSignature(null);
    setStudentSignature(null);
    setIsSubmitted(false);
  };
  
  const openSignaturePad = (signer) => {
    if (signer === 'parent') setIsParentSigning(true);
    else setIsStudentSigning(true);
  };
  
  const saveSignature = (signer) => {
    const sigPad = signer === 'parent' ? parentSigPad.current : studentSigPad.current;
    if (sigPad.isEmpty()) {
      return; // Or show an error message
    }
    const signatureData = sigPad.getTrimmedCanvas().toDataURL('image/png');
    if (signer === 'parent') {
      setParentSignature(signatureData);
      setIsParentSigning(false);
    } else {
      setStudentSignature(signatureData);
      setIsStudentSigning(false);
    }
  };

  /**
   * A modal for capturing signatures.
   */
  const SignaturePadModal = ({ signer, isOpen, onClose, onSave, sigPadRef }) => {
    if (!isOpen) return null;

    const handleClear = () => {
      if (sigPadRef.current) {
        sigPadRef.current.clear();
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4">Sign as {signer === 'parent' ? 'Parent/Guardian' : 'Student'}</h2>
          <div className="border-2 border-dashed border-gray-400 rounded-lg">
            <SignatureCanvas
              ref={sigPadRef}
              penColor="black"
              canvasProps={{ className: 'w-full h-40' }}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={handleClear} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors">
              Clear
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors">
              Cancel
            </button>
            <button onClick={() => onSave(signer)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Save Signature
            </button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * The admin panel for viewing and managing submitted agreements.
   */
  const AdminPanel = () => {
    const agreementsWithoutInstruments = agreements.filter(a => !a.instrument);
    const completedAgreements = agreements.filter(a => a.instrument);

    return (
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Admin Panel</h3>
        <p className="text-center text-gray-600 mb-6">
          Click on a pending form to assign an instrument.
        </p>

        {selectedAgreement ? (
          <div className="p-6 bg-gray-100 rounded-xl shadow-inner">
            <h4 className="text-xl font-semibold mb-4">Assign Instrument for {selectedAgreement.studentName}</h4>
            <div className="space-y-4">
              <div><p><strong>Student:</strong> {selectedAgreement.studentName}</p></div>
              <div><p><strong>Parent:</strong> {selectedAgreement.parentName}</p></div>
            </div>
            
            <form onSubmit={handleAdminFormSubmit} className="space-y-4 mt-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="assignedInstrument">Instrument Type</label>
                <input id="assignedInstrument" type="text" value={assignedInstrument} onChange={(e) => setAssignedInstrument(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="assignedBrand">Brand and Serial #</label>
                <input id="assignedBrand" type="text" value={assignedBrand} onChange={(e) => setAssignedBrand(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="assignedDefects">Conditions/Defects</label>
                <textarea id="assignedDefects" value={assignedDefects} onChange={(e) => setAssignedDefects(e.target.value)} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={() => setSelectedAgreement(null)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Save & Assign</button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-4">Pending Agreements</h4>
            {agreementsWithoutInstruments.length > 0 ? (
              <ul className="space-y-4">
                {agreementsWithoutInstruments.map((agreement) => (
                  <li key={agreement.id} onClick={() => setSelectedAgreement(agreement)} className="bg-gray-50 p-6 rounded-xl shadow-sm cursor-pointer hover:bg-gray-100">
                    <p className="font-bold">{agreement.studentName}</p>
                    <p>Parent: {agreement.parentName}</p>
                    {agreement.timestamp && <p className="text-sm text-gray-400 mt-2">Submitted: {new Date(agreement.timestamp.toDate()).toLocaleString()}</p>}
                  </li>
                ))}
              </ul>
            ) : (<p className="text-center text-gray-500">No pending agreements.</p>)}

            <h4 className="text-xl font-bold text-gray-800 mt-8 mb-4">Completed Agreements</h4>
            {completedAgreements.length > 0 ? (
              <ul className="space-y-4">
                {completedAgreements.map((agreement) => (
                  <li key={agreement.id} className="bg-gray-50 p-6 rounded-xl shadow-sm">
                    <p className="font-bold">{agreement.studentName}</p>
                    <p>Instrument: {agreement.instrument}</p>
                    <p>Serial #: {agreement.brand}</p>
                    <p>Parent: {agreement.parentName}</p>
                    {agreement.timestamp && <p className="text-sm text-gray-400 mt-2">Submitted: {new Date(agreement.timestamp.toDate()).toLocaleString()}</p>}
                  </li>
                ))}
              </ul>
            ) : (<p className="text-center text-gray-500">No completed agreements.</p>)}
          </>
        )}
      </div>
    );
  };
  
  if (!isAuthReady) {
    return <div className="text-center p-10">Loading and authenticating...</div>;
  }
  
  if (isAdmin) {
    return (
      <div className="container mx-auto p-4">
        <AdminPanel />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
        <p className="font-bold">Important Notice</p>
        <p>Instruments will be distributed once $50 has been turned into the office and the form has been signed.</p>
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">Digital Instrument Rental Agreement</h1>

      {isSubmitted ? (
        <div className="text-center p-8 bg-green-100 rounded-lg">
          <h2 className="text-2xl font-semibold text-green-800">Thank You!</h2>
          <p className="mt-2 text-gray-700">Your form has been submitted successfully.</p>
          <button onClick={handleNewForm} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Submit Another Form
          </button>
        </div>
      ) : (
        <form onSubmit={handleStudentFormSubmit} className="space-y-6">
          <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Student Name</label>
            <input type="text" id="studentName" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName}</p>}
          </div>
          <div>
            <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">Parent/Guardian Name</label>
            <input type="text" id="parentName" value={parentName} onChange={(e) => setParentName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Parent/Guardian Signature</label>
              <button type="button" onClick={() => openSignaturePad('parent')} className="mt-1 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                {parentSignature ? "Signature Saved" : "Click to Sign"}
              </button>
              {errors.parentSignature && <p className="text-red-500 text-xs mt-1">{errors.parentSignature}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Student Signature</label>
              <button type="button" onClick={() => openSignaturePad('student')} className="mt-1 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                {studentSignature ? "Signature Saved" : "Click to Sign"}
              </button>
              {errors.studentSignature && <p className="text-red-500 text-xs mt-1">{errors.studentSignature}</p>}
            </div>
          </div>
          
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Submit Agreement
          </button>
        </form>
      )}

      <SignaturePadModal
        signer="parent"
        isOpen={isParentSigning}
        onClose={() => setIsParentSigning(false)}
        onSave={saveSignature}
        sigPadRef={parentSigPad}
      />
      <SignaturePadModal
        signer="student"
        isOpen={isStudentSigning}
        onClose={() => setIsStudentSigning(false)}
        onSave={saveSignature}
        sigPadRef={studentSigPad}
      />
    </div>
  );
}

export default App;