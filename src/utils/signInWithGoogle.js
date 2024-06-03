import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

export default async function signInwithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider)
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log(user);

    return token;
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    return { errorCode, errorMessage }
  }
}