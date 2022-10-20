import { useEffect } from "react";
import { useState } from "react";
import "./App.css";
import Post from "./Post";
import { auth, db } from "./firebase";
import { Button, Input, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ImageUpload from "./ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);
  //2:03:30

  useEffect(() => {
    //1:48:20
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) =>
        authUser.user.updateProfile({
          displayName: username,
        })
      )
      .catch((err) => alert(err.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false) /* 1:31:50 */}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
                className="app__headerImage"
              />
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              onClick={signUp}
              style={{
                background:
                  "linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C)",
                borderRadius: "6px",
                color: "White",
                marginTop: "3px",
              }}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false) /* 1:31:50 */}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
                className="app__headerImage"
              />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              onClick={signIn}
              style={{
                background:
                  "linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C)",
                borderRadius: "6px",
                color: "White",
                marginTop: "3px",
              }}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          className="app__headerImage"
        />
        {user ? (
          <Button
            onClick={() => auth.signOut()}
            style={{
              background:
                "linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C)",
              borderRadius: "6px",
              color: "White",
            }}
          >
            LogOut
          </Button>
        ) : (
          <div className="app__containerLogin">
            <Button
              onClick={() => setOpenSignIn(true)}
              style={{
                background:
                  "linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C)",
                borderRadius: "6px",
                marginRight: "15px",
                color: "White",
              }}
            >
              Sign In
            </Button>
            <Button
              onClick={() => setOpen(true)}
              style={{
                background:
                  "linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C)",
                borderRadius: "6px",
                marginRight: "15px",
                color: "White",
              }}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        {user &&
          posts.map(({ id, post }) => (
            <Post
              postId={id}
              key={id}
              user={user}
              imageUrl={post.imageUrl}
              username={post.username}
              caption={post.caption}
            />
          ))}
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <div className="alertLogin">
          <h3>Login/SignUp to upload and view contents</h3>
        </div>
      )}
      {/* 2:35:00 --> Passing the username prop to ImageUpload so that it can be accessed inside ImageUpload to provide the username, but we also don't want to show this ImageUpload component unless the user signs in, so there should be a conditional check else user.displayName will give name */}
    </div>
  );
}

export default App;
