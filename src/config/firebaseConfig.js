// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBISDk6TGtDTL_PBNfQCJkPBZ9u0ykusZQ",
  authDomain: "effortless-test-16485.firebaseapp.com",
  projectId: "effortless-test-16485",
  storageBucket: "effortless-test-16485.appspot.com",
  messagingSenderId: "675852998683",
  appId: "1:675852998683:web:72c814c888137d75b840be",
  measurementId: "G-BB1HRBNJPT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("🚀 ~ app:", app)

const analytics = getAnalytics(app);
