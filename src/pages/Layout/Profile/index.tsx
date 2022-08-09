import { Link, useHistory } from "react-router-dom";

import Icon from "@/components/Icon";
import styles from "./index.module.scss";
import { useEffect } from "react";
import { getProfile } from "@/store/actions/profile";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types/store";
import { User } from "@/types/data";

const Profile = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const profile = useSelector<RootState, User>((state) => state.profile.user);
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <div className={styles.root}>
      <div className="profile">
        {/* 个人信息 */}
        <div className="user-info">
          <div className="avatar">
            <img src={profile.photo} alt="" />
          </div>
          <div className="user-name">{profile.name}</div>
          <Link to="/profile/edit">
            个人信息 <Icon type="iconbtn_right" />
          </Link>
        </div>

        {/* 今日阅读 */}
        <div className="read-info">
          <Icon type="iconbtn_readingtime" />
          今日阅读
          <span>10</span>
          分钟
        </div>

        {/* 动态 - 对应的这一行 */}
        <div className="count-list">
          <div className="count-item">
            <p>{profile.art_count}</p>
            <p>动态</p>
          </div>
          <div className="count-item">
            <p>{profile.follow_count}</p>
            <p>关注</p>
          </div>
          <div className="count-item">
            <p>{profile.fans_count}</p>
            <p>粉丝</p>
          </div>
          <div className="count-item">
            <p>{profile.like_count}</p>
            <p>被赞</p>
          </div>
        </div>

        {/* 消息通知 - 对应的这一行 */}
        <div className="user-links">
          <div className="link-item">
            <Icon type="iconbtn_mymessages" />
            <div>消息通知</div>
          </div>
          <div className="link-item">
            <Icon type="iconbtn_mycollect" />
            <div>收藏</div>
          </div>
          <div className="link-item">
            <Icon type="iconbtn_history1" />
            <div>浏览历史</div>
          </div>
          <div className="link-item">
            <Icon type="iconbtn_myworks" />
            <div>我的作品</div>
          </div>
        </div>
      </div>

      {/* 更多服务 */}
      <div className="more-service">
        <h3>更多服务</h3>
        <div className="service-list">
          <div className="service-item">
            <Icon type="iconbtn_feedback" />
            <div>用户反馈</div>
          </div>
          <div className="service-item" onClick={() => history.push("/chat")}>
            <Icon type="iconbtn_xiaozhitongxue" />
            <div>小智同学</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;