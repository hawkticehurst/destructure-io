import app from 'firebase/app';

	const firebaseConfig = {
		apiKey: "AIzaSyDeMsUdMj0mx6q4VdnxkGcdbJp5OIAL2JI",
		  authDomain: "node-warrior.firebaseapp.com",
		  databaseURL: "https://node-warrior.firebaseio.com",
		  projectId: "node-warrior",
		  storageBucket: "node-warrior.appspot.com",
		  messagingSenderId: "1044681182278",
		  appId: "1:1044681182278:web:5de0f9ea5433e8b7858e47",
		  measurementId: "G-W82LT744WE"
	};
	
	class Firebase {
		constructor() {
			app.initializeApp(firebaseConfig);
			this.auth = app.auth();
		}
	}
	
	export default Firebase;
