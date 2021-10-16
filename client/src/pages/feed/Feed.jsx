import React, { useEffect, useState, useContext } from "react";
import "./feed.css";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import authAxios from "../../service/authApi";
import { AuthContext } from "../../context/auth.context";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useHistory } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Feed() {
  const history = useHistory();

  const { logOutUser } = useContext(AuthContext);

  const [user, setUser] = useState("");
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState(true);
  const [usersError, setUsersError] = useState(undefined);
  const [restOfUsers, setRestOfUsers] = useState([]);
  const [followingTweets, setFollowingTweets] = useState(null);
  const [pendingFollowingTweets, setPendingFollowingTweets] = useState(true);
  const [followingTweetsError, setFollowingTweetsError] = useState(undefined);
  const [state, setState] = useState({ left: false });
  const [open, setOpen] = useState(false);

  const handleUsersExpand = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clickToProfile = () => {
    history.push("/profile");
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  // left menu bar
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <div className="sidebar-header">
          <h4>Account info</h4>
          <CloseIcon />
        </div>
        <Divider />
        <div className="sidebar-user">
          <Avatar
            src={user.profilePicture}
            sx={{ width: 40, height: 40 }}
            onClick={() => clickToProfile()}
          />
          <h4>{user.name}</h4>
          <p>
            <span>{user.following?.length}</span> Following{" "}
            <span>{user.followers?.length}</span> Followers{" "}
          </p>
        </div>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem onClick={() => logOutUser()}> Logout </ListItem>
    </Box>
  );

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

  useEffect(() => {
    const getUsersNotFollowing = async () => {
      try {
        const usersData = await authAxios.get("user/all/non/following");
        if (usersData?.data?.users?.length <= 3) {
          setRestOfUsers(usersData?.data?.usersList);
          setUsers(usersData?.data?.usersList);
        } else {
          setRestOfUsers(usersData?.data?.usersList);
          setUsers(usersData?.data?.usersList?.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
        setUsersError(err.message);
      } finally {
        setPendingUsers(false);
      }
    };
    getUsersNotFollowing();
  }, []);

  const followUser = async (userId) => {
    try {
      const data = { userId };
      await authAxios.post("user/follow", data);
    } catch (err) {
      console.error(err);
    }
  };

  const getFollowingTweets = async () => {
    try {
      const res = await authAxios.get("user/following/tweets");
      setFollowingTweets(res?.data?.followingTweets);
    } catch (err) {
      console.error(err);
      setFollowingTweetsError(err.message);
    } finally {
      setPendingFollowingTweets(false);
    }
  };

  useEffect(() => {
    getFollowingTweets();
  }, []);

  const likedTweet = async (tweetId) => {
    try {
      const data = { tweetId };
      await authAxios.post("user/like/tweet", data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="feed-header">
        <Avatar
          src={user.profilePicture}
          onClick={toggleDrawer("left", true)}
        />
        <div>
          <React.Fragment key={"left"}>
            <Drawer
              anchor={"left"}
              open={state["left"]}
              onClose={toggleDrawer("left", false)}
            >
              {list("left")}
            </Drawer>
          </React.Fragment>
        </div>
        <h4 className="feed-title">Feed</h4>
      </div>
      <Divider />
      {usersError && <p>{usersError}</p>}
      {pendingUsers && "loading..."}
      {users &&
        users.map((user) => (
          <div className="follow-suggestions">
            <Avatar
              className="user-avatar"
              sx={{ width: 50, height: 50 }}
              src={user.profilePicture}
            />
            <div className="user-description">
              <h4 className="user-name">{user.name}</h4>
              <p className="user-bio">{user.bio}</p>
            </div>
            <button className="follow-btn" onClick={() => followUser(user._id)}>
              Follow
            </button>
          </div>
        ))}
      <div>
        <div className="show-more-btn-container">
          <button className="show-more-btn" onClick={() => handleUsersExpand()}>
            Show more
          </button>
        </div>
        <Divider />
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <div className="users-list">
            <IconButton edge="start" onClick={handleClose} aria-label="close">
              <ArrowBackIcon className="exit-arrow" />
              <h6 className="connect-text">Connect</h6>
            </IconButton>
          </div>
          <Divider />
          <div className="">
            <h3 className="users-list-title">Suggested for you</h3>
            {restOfUsers &&
              restOfUsers.map((user) => (
                <div className="follow-suggestions">
                  <Avatar
                    className="user-avatar"
                    sx={{ width: 50, height: 50 }}
                    src={user.profilePicture}
                  />
                  <div className="user-description">
                    <h4 className="user-name">{user.name}</h4>
                    <p className="user-bio">{user.bio}</p>
                  </div>
                  <button
                    className="follow-btn"
                    onClick={() => followUser(user._id)}
                  >
                    Follow
                  </button>
                </div>
              ))}
          </div>
          <div className="input-options"></div>
        </Dialog>
      </div>
      <div className="following-tweets-list">
        {pendingFollowingTweets && "loading..."}
        {followingTweetsError && <p> {followingTweetsError} </p>}
        {followingTweets &&
          followingTweets.map((tweet) => {
            return (
              <div className="tweet-container">
                <div className="top-half-tweet">
                  <Avatar
                    src={tweet.profilePicture}
                    sx={{ width: 50, height: 50 }}
                  />
                  <div className="top-middle-tweet">
                    <h4 className="tweet-creator-name">{tweet.name}</h4>
                    <p className="tweet-description">{tweet.description}</p>
                  </div>
                  <MoreHorizIcon className="tweet-option-icon" />
                </div>
                <div className="bottom-half-tweet">
                  <ChatBubbleOutlineRoundedIcon />
                  <RepeatRoundedIcon />
                  <FavoriteBorderRoundedIcon
                    onClick={() => likedTweet(tweet.tweetId)}
                  />
                  <ShareOutlinedIcon />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
