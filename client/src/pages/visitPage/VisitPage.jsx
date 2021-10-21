import React, { useState, useEffect } from "react";
import './visitPage.css';
import { Link, useHistory, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";
import authAxios from "../../service/authApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import TelegramIcon from '@mui/icons-material/Telegram';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import PublicIcon from '@mui/icons-material/Public';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import GifOutlinedIcon from '@mui/icons-material/GifOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import Tweet from '../../components/tweet/Tweet';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function VisitPage() {

  const { userId } = useParams();
  const history = useHistory();

  const [user, setUser] = useState(null);
  const [value, setValue] = useState("1");
  const [open, setOpen] = React.useState(false);
  const [likedTweets, setLikedTweets] = useState(null);
  const [tweetDescription, setTweetDescription] = useState('');
  const [tweets, setTweets] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleTweetDescription = e => setTweetDescription(e.target.value);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getUserDetails = async () => {
    try {
      const userDetails = await authAxios.get(`user/visit/details/${userId}`);
      setUser(userDetails?.data?.user);
      await getProfileTweets();
    } catch (err) {
      console.error(err);
    }
  };

  if(user === null) {
    getUserDetails();
  }

  const createTweetPrompt = () => {
        setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleTweetSubmit = async (e) => {
      e.preventDefault();

      try{
          const tweetData = { tweetDescription }
          await authAxios.post('tweet/create', tweetData);

          history.push('/profile');

      } catch (err) {
          console.error(err)
      }
  }

  const getLikedTweets = async () => {
      try {
          const res = await authAxios.get('profile/liked/tweets');
          setLikedTweets(res?.data?.likedTweets);

      } catch (err) {
          console.error(err);
      }
  }

  const getProfileTweets = async () => {
      try {
          const index = tweets?.length || 0
          const res = await authAxios.get(`tweet/visit/${index}/${userId}`)
          setTweets(res?.data?.tweets);
      } catch (err) {
          console.error(err);
      }
  }

  const showMoreTweets = async () => {
      try {
        const index = tweets?.length || 0
        const res = await authAxios.get(`tweet/logged/${index}`)
        setTweets(res?.data?.tweets);
      } catch (err) {
          console.error(err);
      }
  }

  const followStatus = async () => {
      try {
          const res = await authAxios.get(`follow/status/${userId}`);
          setIsFollowing(res?.data?.status);
      } catch (err) {
          console.error(err);
      }
  }

  const followOrUnfollow = async () => {
      try {
          const data = { userId }
          const res = await authAxios.post('follow/isFollowing', data);
          setIsFollowing(res?.data?.status);
      } catch (err) {
          console.error(err);
      }
  }

  useEffect(() => {
    getLikedTweets();
    followStatus();
    // getProfileTweets();
  }, [])

  return (
    <>
      {user ? (
        <div>
          <div className="profile-header">
          <Link className="profile-back-btn" to='/feed'>
            <ArrowBackIcon />
          </Link>
            <div className="profile-header-container">
              <h1>{user.name}</h1>
              <p>
                <span>{user.tweets.length}</span> Tweets
              </p>
            </div>
          </div>
          <section
            className="backdrop-container"
            style={{ backgroundImage: `url(${user.coverPicture})` }}
          ></section>
          <section className="profile-data-top">
            <div className="avatar-container">
              <Avatar
              className='profile-avatar'
                src={user.profilePicture}
                sx={{ width: 100, height: 100 }}
              />
              <h1>{user.name}</h1>
              <p>
                Joined <span>{moment(user.createdAt).format("MMMM YYYY")}</span>
              </p>
              <div className="profile-bio">
                <p>{user.bio}</p>
              </div>
              <p>
                <span>{user.following.length}</span> Following{" "}
                <span>{user.followers.length}</span> Followers{" "}
              </p>
            </div>
            <button className="setup-profile-btn" onClick={() => followOrUnfollow()}>
             {isFollowing ? 'Following': 'Follow'}
            </button>
          </section>
          <section className="profile-tabs">
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Tweets" value="1" />
                    <Tab label="Tweets and replies" value="2" />
                    <Tab label="Media" value="3" />
                    <Tab label="Likes" value="4" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                {tweets?.length > 0
                && tweets.map((tweet) => {
                    return <Tweet key={tweet._id} tweetId={tweet._id} />
                })}
                {tweets && <button className='show-more' onClick={() => showMoreTweets()}>Show more</button>}
                </TabPanel>
                <TabPanel value="2">
                {likedTweets ? likedTweets.map((tweet) => {
                    return (<div className="tweet-container">
                    <div className="top-half-tweet">
                      <Avatar
                        src={tweet.profilePicture}
                        sx={{ width: 50, height: 50 }}
                      />
                      <div className="top-middle-tweet">
                        <h4 className='tweet-creator-name'>{tweet.name} <span className='tweet-date'> • {moment(tweet.createdAt).format("MMM D")}</span> </h4>
                        <p className='tweet-description'>{tweet.description}</p>
                      </div>
                      <MoreHorizIcon className='tweet-option-icon' />
                    </div>
                    <div className='bottom-half-tweet'>
                        <ChatBubbleOutlineRoundedIcon />
                        <RepeatRoundedIcon />
                        <FavoriteBorderRoundedIcon />
                        <ShareOutlinedIcon />
                    </div>
                  </div>)
                }): 'loading...' }</TabPanel>
                <TabPanel value="3">Item Three</TabPanel>
                <TabPanel value="4">Item Four</TabPanel>
              </TabContext>
            </Box>
          </section>
          <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
    
          <div className='tweet-popup-top'>
            <IconButton
              edge="start"
              onClick={handleClose}
              aria-label="close"
            >
              <ArrowBackIcon className='exit-tweet' />
            </IconButton>
            </div>
            <div className='tweet-popup-container'>
            <Avatar className='tweet-avatar' src={user.profilePicture}/>
            <form className='tweet-form' onSubmit={handleTweetSubmit}>
            <input type="text" placeholder="What's happening?" value={tweetDescription} maxlength='240' onChange={handleTweetDescription}/>
            <button className='tweet-submit' type='submit'>Tweet</button>
            </form>
            </div>
       
            <div className='reply-access'>
            <PublicIcon />
                <h5>Anyone can reply</h5>
            </div>
          <Divider />
          <div className='input-options'>
          <CropOriginalIcon />
          <GifOutlinedIcon />
          <BarChartOutlinedIcon />
          <DateRangeOutlinedIcon />
          </div>
        </Dialog>
    </div>
          <div className='floating-tweet-icon'>
            <TelegramIcon  sx={{ color: 'white' }} onClick={createTweetPrompt}/>
          </div>
        </div>
      ) : (
        "loading..."
      )}
    </>
  );
}
