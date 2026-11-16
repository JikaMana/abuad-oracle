const firebaseConfig = {
  apiKey: "AIzaSyDaIbNnFoxs43TSmfAleFK3oQPuQKog2DU",
  authDomain: "burhan-tutors-website.firebaseapp.com",
  projectId: "burhan-tutors-website",
  storageBucket: "burhan-tutors-website.firebasestorage.app",
  messagingSenderId: "359861270073",
  appId: "1:359861270073:web:516d9da8eb4e8c46613fe8",
};

export async function loadAuth() {
  const { getApps, initializeApp } = await import("firebase/app");
  const { browserLocalPersistence, getAuth, setPersistence } = await import("firebase/auth");
  const app = getApps()[0] ?? initializeApp(firebaseConfig);
  const auth = getAuth(app);
  await setPersistence(auth, browserLocalPersistence).catch(() => undefined);
  return auth;
}
