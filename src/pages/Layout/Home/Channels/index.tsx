import classnames from "classnames";

import Icon from "@/components/Icon";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/types/store";
import { Channel } from "@/types/data";

type ChannelsProps = {
  onClose?: () => void;
};

const Channels = ({ onClose }: ChannelsProps) => {
  const userChannels = useSelector<RootState, Channel[]>(
    (state) => state.home.userChannels
  );
  const allChannels = useSelector<RootState, Channel[]>(
    (state) => state.home.allChannels
  );
  // console.log({ userChannels, allChannels });
  const recommandChannels = allChannels.filter((item) => {
    const channel = userChannels.find((userCh) => userCh.id === item.id);
    return !channel;
  });
  // console.log(recommandChannels);
  return (
    <div className={styles.root}>
      <div className="channel-header">
        <Icon type="iconbtn_channel_close" onClick={onClose} />
      </div>
      <div className="channel-content">
        {/* 编辑时，添加类名 edit */}
        <div className={classnames("channel-item")}>
          <div className="channel-item-header">
            <span className="channel-item-title">我的频道</span>
            <span className="channel-item-title-extra">点击进入频道</span>
            <span className="channel-item-edit">编辑</span>
          </div>
          <div className="channel-list">
            {/* 选中时，添加类名 selected */}
            {/* <span className={classnames("channel-list-item")}>
              推荐
              <Icon type="iconbtn_tag_close" />
            </span> */}
            {userChannels.map((channel) => (
              <span
                key={channel.id}
                className={classnames("channel-list-item")}
              >
                {channel.name}
                <Icon type="iconbtn_tag_close" />
              </span>
            ))}
          </div>
        </div>

        <div className="channel-item">
          <div className="channel-item-header">
            <span className="channel-item-title">频道推荐</span>
            <span className="channel-item-title-extra">点击添加频道</span>
          </div>
          <div className="channel-list">
            {recommandChannels.map((item) => (
              <span key={item.id} className="channel-list-item">
                + {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Channels;