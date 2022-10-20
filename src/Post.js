import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

//username --> Of the user who wrote the post
//user --> The user who is writing the comment by signing in
//3:19:43
function Post({ postId, user, username, imageUrl, caption }) {
  const [comments, setComments] = useState([]); //3:07:43
  const [comment, setComment] = useState(""); //3:11:48

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setComments(snapshot.docs.map((doc) => doc.data()))
        );
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      //3:19:11 --> We need to post the comment as well as the user who posted that comment, so what will happen is that we need to get the username of the user who posted the comment by signing in, not the user who posted this
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          src="https://images.pexels.com/photos/1767434/pexels-photo-1767434.jpeg?auto=compress&cs=tinysrgb&w=600"
          className="post__avatar"
          alt="_sohammukherjee"
        />
        <h3>{username}</h3>
        {/* header --> avatar + username */}
      </div>
      <img className="post__image" src={imageUrl} alt="" />
      {/* body --> post */}
      <h4 className="post__text">
        <strong>{username} :</strong> {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username} </strong>
            {comment.text}
          </p>
        ))}
      </div>

      <form className="post__commentBox">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="post__input"
        />
        <button
          disabled={!comment}
          type="submit"
          onClick={postComment}
          className="post__button"
        >
          Post
        </button>
      </form>
      {/* footer --> username + caption , not gonna bother about likes */}
    </div>
  );
}

export default Post;
