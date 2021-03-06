import React, { useState, useEffect } from "react";
import "./tweet.css";
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
import Thread from '../thread/Thread';
import moment from "moment";
import { Link } from 'react-router-dom';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Tweet(props) {

  const [user, setUser] = useState("");
  const [openComments, setOpenComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [openReply, setOpenReply] = useState(false);
  const [tweetDescription, setTweetDescription] = useState("");
  const [replyTweet, setReplyTweet] = useState('');
  const [tweet, setTweet] = useState('');
  const [index, setIndex] = useState(0);

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
      const res = await authAxios.get(`tweet/comments/${tweetId}/${index}`);
      setComments(res?.data?.comments);
      setIndex(comments?.length);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentsExpand = (tweet) => {
    getTweetComments(tweet._id);
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
      getTweet();
    } catch (err) {
      console.error(err);
    }
  };

  const showMoreComments = async () => {
      try {
        const tweetId = tweet?._id;
        const newIndex = comments.length;
        const res = await authAxios.get(`tweet/comments/${tweetId}/${newIndex}`);
        setComments(res?.data?.comments);
        getTweet();
      } catch (err) {
          console.error(err)
     }
  }

  const retweet = async (tweetId) => {
    try {
      const data = { tweetId };
      await authAxios.post('tweet/retweet', data);
      console.log('here');
    } catch (err) {
      console.error(err);

    }
  }
  
  useEffect(() => {
      getTweet();
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
        <Link to={`/visit/${tweet.id}`}>
          <Avatar src={tweet.profilePicture} sx={{ width: 50, height: 50 }} />
          </Link>
          <div className="top-middle-tweet">
            <h4 className="tweet-creator-name">{tweet.name}</h4>
            <p className="tweet-description">{tweet.description}</p>
          </div>
          <MoreHorizIcon className="tweet-option-icon" />
        </div>
        {tweet.image 
        && <div className='tweet-image-container'>
        <img className='tweet-image-view' src={tweet.image} alt="" />
        </div> }
        <div className="bottom-half-tweet">
          <ChatBubbleOutlineRoundedIcon
            onClick={() => replyTweetPrompt(tweet)}
          />
          <span className='reply-count' >{tweet.comments.length}</span>
          <RepeatRoundedIcon onClick={() => retweet(tweet._id)} />
          {/* <span className='retweet-count' >{tweet.retweets.length}</span> */}
          <FavoriteBorderRoundedIcon onClick={() => likedTweet(tweet._id)} />
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
            {tweet.image 
            && <div className='tweet-image-container'>
                 <img className='tweet-image-view' src={tweet.image} alt="" />
               </div> }
            <div>
            <p>{moment(tweet.createdAt).format("hh:mm ??? MMM DD, YYYY")}</p>
            </div>
            <Divider />
            <div className="bottom-half-tweet">
              <ChatBubbleOutlineRoundedIcon
                onClick={() => replyTweetPrompt(tweet)}
              />
              <span className='reply-count' >{tweet.comments.length}</span>
              <RepeatRoundedIcon onClick={() => retweet(tweet._id)} />
              <FavoriteBorderRoundedIcon onClick={() => likedTweet(tweet._id)} />
              <span className='like-count' >{tweet.likes.length}</span>
              <ShareOutlinedIcon />
            </div>
          </div>
        )}
        {comments &&
          comments.map((comment) => {
            return (
              <>
              <Thread key={comment._id} tweetId={comment._id} />
              </>
            );
          })}
        {comments && <button className='show-more-comments' onClick={() => showMoreComments()}>Show more</button>}
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
