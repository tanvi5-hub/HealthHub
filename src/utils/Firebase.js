import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc,query,where, getDocs } from 'firebase/firestore';


const firebaseConfig = {
  //
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

export const createUserDocument = async (user, additionalData) => {
  if (!user) return;

  const userRef = doc(firestore, 'patient', user.uid);
  
  const snapshot = await getDoc(userRef);
  
  if (!snapshot.exists()) {
    const { uid } = user;
    const {fullName,
      dob,
      address,
      gender,
      email,
      password} = additionalData;
    
    try {
      await setDoc(userRef, {
        fullName: fullName,
        dob,
        address,
        gender,
        email,
        password,
        createdAt: new Date(),
        PatientId:uid,
        PracticeRegistered:false,
        // Adminapproved:false
        
      });
    } catch (error) {
      console.log('Error in creating user', error);
    }
  }
}



export const createHospitalDocuments = async (hospitalsArray) => {

  const hospitalsCollectionRef = collection(firestore, 'practice');


  if (!Array.isArray(hospitalsArray)) {
    console.error('Expected an array for hospitalsArray, received:', hospitalsArray);
    return;  
  }

  for (const hospital of hospitalsArray) {
    const { practiceid,name, image, address, city, services} = hospital;  


    const hospitalQuery = query(hospitalsCollectionRef, where("name", "==", name));
    const querySnapshot = await getDocs(hospitalQuery);

    if (querySnapshot.empty) {  
      const hospitalRef = doc(hospitalsCollectionRef);  
      
      try {
        await setDoc(hospitalRef, {
          practiceid,
          name,
          image,
          address,
          city,
          services,  // Save the array of services
          createdAt: new Date()
        });
       
      } catch (error) {
   
      }
    } else {
     
    }
  }
};

export const createAdmin = async (email, password) => {
  try {
    const adminRef = doc(collection(firestore, 'admin'));
    const adminSnapshot = await getDoc(adminRef);
    
    if (adminSnapshot.exists()) {
      console.log('Admin document already exists.');
      return;
    }
    
    await setDoc(adminRef, {
      email: email,
      password: password
    });
    console.log('Admin document created successfully.');
  } catch (error) {
    console.error('Error creating admin document: ', error);
  }

  createAdmin('admin@gmail.com', 'adminPassword@1');
};


