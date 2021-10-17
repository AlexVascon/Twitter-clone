import React, { useState, useEffect } from "react";
import "./thread.css";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import Avatar from "@mui/material/Avatar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import authAxios from "../../service/authApi";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import GifOutlinedIcon from "@mui/icons-material/GifOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import Divider from "@mui/material/Divider";
import Tweet from '../tweet/Tweet';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Thread(props) {

  const [user, setUser] = useState("");
  const [openComments, setOpenComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [openReply, setOpenReply] = useState(false);
  const [tweetDescription, setTweetDescription] = useState("");
  const [replyTweet, setReplyTweet] = useState('');
  const [tweet, setTweet] = useState('');


  const handleReplyDescription = (e) => setTweetDescription(e.target.value);

  const getTweet = async () => {
    try{
        const res = await authAxios.get(`tweet/${props?.tweetId}`)
        setTweet(res?.data?.tweet);
    } catch (err) {
        console.error(err);
    }
}

  useEffect(() => {
    const getLoggedDetails = async () => {
      try {
        const loggedUserDetails = await authAxios.get("profile/details");
        setUser(loggedUserDetails?.data?.user);
      } catch (err) {
        console.error(err);
      }
    };
    getLoggedDetails();
  }, []);

  const likedTweet = async (tweetId) => {
    try {
      const data = { tweetId };
      await authAxios.post("user/like/tweet", data);
      getTweet();
    } catch (err) {
      console.error(err);
    }
  };

  const replyTweetPrompt = (tweet) => {
    setReplyTweet(tweet);
    setOpenReply(true);
  };

  const getTweetComments = async (tweetId) => {
    try {
      const res = await authAxios.get(`tweet/comments/${tweetId}`);
      setComments(res?.data?.comments);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentsExpand = () => {
    getTweetComments(tweet.id);
    setOpenComments(true);
  };

  const handleCommentsClose = () => {
    setOpenComments(false);
  };

  const handleReplyClose = () => {
    setOpenReply(false);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    try {
      const tweetData = { tweetDescription, replyTweet };
      const res = await authAxios.post("tweet/comment", tweetData);
      setComments([...comments, res?.data?.comment ]);
      setOpenReply(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTweet();
    getTweetComments();
}, [])

  return (
    <>
    {tweet 
    && 
      <div className="tweet-container">
        <div
          className="top-half-tweet"
          onClick={() => handleCommentsExpand(tweet)}
        >
          <Avatar src={tweet.profilePicture} sx={{ width: 50, height: 50 }} />
          <div className="top-middle-tweet">
            <h4 className="tweet-creator-name">{tweet.name}</h4>
            <p className="tweet-description">{tweet.description}</p>
          </div>
          <MoreHorizIcon className="tweet-option-icon" />
        </div>
        <div className="bottom-half-tweet">
          <ChatBubbleOutlineRoundedIcon
            onClick={() => replyTweetPrompt(tweet)}
          />
           <span className='reply-count' >{tweet.comments.length}</span>
          <RepeatRoundedIcon />
          <FavoriteBorderRoundedIcon onClick={() => likedTweet(tweet.id)} />
          <span className='like-count' >{tweet.likes.length}</span>
          <ShareOutlinedIcon />
        </div>
      </div>
    }
      <Dialog
        fullScreen
        open={openComments}
        onClose={handleCommentsClose}
        TransitionComponent={Transition}
      >
        <div className="tweet-popup-top">
          <IconButton
            edge="start"
            onClick={handleCommentsClose}
            aria-label="close"
          >
            <ArrowBackIcon className="exit-tweet" />
          </IconButton>
          <h4>Tweet</h4>
        </div>
        <Divider />
        {tweet && (
          <div className="commentsOrigin">
            <div className="top-half-tweet">
              <Avatar
                src={tweet.profilePicture}
                sx={{ width: 50, height: 50 }}
              />
              <div className="top-middle-tweet-expanded">
                <h4 className="tweet-creator-name">{tweet.name}</h4>
                <p className="tweet-description">{tweet.description}</p>
              </div>
              <MoreHorizIcon className="tweet-option-icon" />
            </div>
            <div className="bottom-half-tweet">
              <ChatBubbleOutlineRoundedIcon
                onClick={() => replyTweetPrompt(tweet)}
              />
              <span className='reply-count' >{tweet.comments.length}</span>
              <RepeatRoundedIcon />
              <FavoriteBorderRoundedIcon onClick={() => likedTweet(tweet.id)} />
              <span className='like-count' >{tweet.likes.length}</span>
              <ShareOutlinedIcon />
            </div>
          </div>
        )}
        {comments &&
          comments.map((comment) => {
            return (
              <>
              <Tweet tweetId={comment.id} />
              </>
            );
          })}
      </Dialog>
      <Dialog
        fullScreen
        open={openReply}
        onClose={handleReplyClose}
        TransitionComponent={Transition}
      >
        <div className="tweet-popup-top">
          <IconButton
            edge="start"
            onClick={handleReplyClose}
            aria-label="close"
          >
            <ArrowBackIcon className="exit-tweet" />
          </IconButton>
        </div>
        {replyTweet && (
          <>
            <div className="reply-container">
              <div className="top-half-tweet">
                <Avatar src={replyTweet.profilePicture} />
                <div className="top-middle-tweet">
                  <h4 className="tweet-creator-name">{replyTweet.name}</h4>
                  <p className="tweet-description">{replyTweet.description}</p>
                  <p>Replying to {replyTweet.name}</p>
                </div>
              </div>
              <div></div>
            </div>
            <div className="send-reply-container">
              <Avatar className="tweet-avatar" src={user.profilePicture} />
              <form className="tweet-form" onSubmit={handleReplySubmit}>
                <input
                  type="text"
                  placeholder="Tweet your reply"
                  value={tweetDescription}
                  maxlength="240"
                  onChange={handleReplyDescription}
                />
                <button className="tweet-submit" type="submit">
                  Tweet
                </button>
              </form>
            </div>
            <div className="input-options">
              <CropOriginalIcon />
              <GifOutlinedIcon />
              <BarChartOutlinedIcon />
              <DateRangeOutlinedIcon />
            </div>
          </>
        )}
      </Dialog>
    </>
  );
}
