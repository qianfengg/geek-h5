import { NavBar, InfiniteScroll, Popup } from "antd-mobile";
import { useHistory, useParams } from "react-router-dom";
import classNames from "classnames";
import styles from "./index.module.scss";

import Icon from "@/components/Icon";
import CommentItem from "./components/CommentItem";
import CommentFooter from "./components/CommentFooter";
import NoComment from "./components/NoComment";
import { useDispatch, useSelector } from "react-redux";
import { useMount } from "@/utils/hooks";
import {
  articlePublishComment,
  articleUserFollowingHandler,
  getArticleDetil,
  getComments,
} from "@/store/actions/article";
import { RootState } from "@/types/store";
import { ArticleDetail, Comment, CommentPage } from "@/types/data";
import Dompurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/base16/default-dark.css";
import { useEffect, useRef, useState } from "react";
import CommentInput from "./components/CommentInput";
import CommentReply from "./components/CommentReply";

const Article = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const onFollowingHandler = () => {
    console.log("处理关注逻辑");
    dispatch(
      articleUserFollowingHandler(
        articleDetail.aut_id,
        articleDetail.is_followed,
        id
      )
    );
  };

  useMount(() => {
    dispatch(getArticleDetil(id));
    dispatch(getComments("a", id));
    hljs.configure({ ignoreUnescapedHTML: true });
    document.querySelectorAll(".dg-html pre code").forEach((el) => {
      // console.log(el);
      hljs.highlightElement(el as HTMLElement);
    });
  });

  const articleDetail = useSelector<RootState, ArticleDetail>(
    (state) => state.article.articleDetail
  );

  const commentPage = useSelector<RootState, CommentPage>(
    (state) => state.article.commentPage
  );

  const wrapperDomRef = useRef<HTMLDivElement>(null);
  const commentDomRef = useRef<HTMLDivElement>(null);

  const [showPopup, setShowPopup] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyOrigincomment, setReplyOriginComment] = useState<Comment>(
    {} as Comment
  );
  const [showAuthor, setShowAuthor] = useState(false);
  const authorRef = useRef<HTMLDivElement>(null);
  // const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrapDOM = wrapperDomRef.current!;
    const authDOM = authorRef.current!;

    const onScroll = function () {
      const rect = authDOM.getBoundingClientRect()!;
      console.log(rect.top);
      setShowAuthor(rect.top <= 0);
    };

    wrapDOM.addEventListener("scroll", onScroll);

    return () => {
      wrapDOM.removeEventListener("scroll", onScroll);
    };
  }, []);
  const renderArticle = () => {
    // 文章详情
    return (
      <div className="wrapper" ref={wrapperDomRef}>
        <div className="article-wrapper">
          <div className="header">
            <h1 className="title">{articleDetail.title}</h1>

            <div className="info">
              <span>{articleDetail.pubdate}</span>
              <span>{articleDetail.read_count} 阅读</span>
              <span>{articleDetail.comm_count} 评论</span>
            </div>

            <div className="author" ref={authorRef}>
              <img src={articleDetail.aut_photo} alt="" />
              <span className="name">{articleDetail.aut_name}</span>
              {/* followed标记是否已关注 */}
              <span
                className={classNames("follow", {
                  followed: articleDetail.is_followed,
                })}
                onClick={onFollowingHandler}
              >
                {articleDetail.is_followed ? "已关注" : "关注"}
              </span>
            </div>
          </div>

          <div className="content">
            <div
              className="content-html dg-html"
              dangerouslySetInnerHTML={{
                __html: Dompurify.sanitize(
                  articleDetail.content +
                    '<script>console.log("我是天才攻击你丫的")</script>'
                ),
                // __html: articleDetail.content,
              }}
            />
            <div className="date">发布文章时间：{articleDetail.pubdate}</div>
          </div>
        </div>

        <div className="comment" ref={commentDomRef}>
          <div className="comment-header">
            <span>全部评论（{articleDetail.comm_count}）</span>
            <span>{articleDetail.like_count} 点赞</span>
          </div>

          <div className="comment-list">
            {commentPage?.results?.length > 0 ? (
              <>
                {commentPage.results.map((item) => (
                  <CommentItem
                    onShowReply={() => {
                      setShowReply(true);
                      setReplyOriginComment(item);
                    }}
                    key={item.com_id}
                    comment={item}
                  />
                ))}
                <InfiniteScroll
                  hasMore={commentPage.last_id !== commentPage.end_id}
                  loadMore={async () => {
                    await dispatch(getComments("a", id, commentPage.last_id));
                  }}
                />
              </>
            ) : (
              <NoComment></NoComment>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.root}>
      <div className="root-wrapper">
        <NavBar
          onBack={() => history.go(-1)}
          right={
            <span>
              <Icon type="icongengduo" />
            </span>
          }
        >
          {showAuthor && (
            <div className="nav-author">
              <img src={articleDetail.aut_photo} alt="" />
              <span className="name">{articleDetail.aut_name}</span>
              {/* followed */}
              <span
                className={classNames("follow", {
                  followed: articleDetail.is_followed,
                })}
                onClick={onFollowingHandler}
              >
                {articleDetail.is_followed ? "已关注" : "关注"}
              </span>
            </div>
          )}
        </NavBar>
        {/* 文章详情和评论 */}
        {renderArticle()}

        {/* 底部评论栏 */}
        <CommentFooter
          onShowInput={() => {
            setShowPopup(true);
          }}
          detail={articleDetail}
          onCommentClick={() => {
            const commentDOM = commentDomRef.current!;
            const wrapDOM = wrapperDomRef.current!;
            const rect = commentDOM.getBoundingClientRect();
            wrapDOM.scrollTop = rect.top - 60;
            // // 已在评论列表的位置，则跳到文章顶部
            // if (wrapDOM.scrollTop === commentDOM.offsetTop - 45) {
            //   wrapDOM.scrollTop = 0;
            // }
            // // 不在评论列表的位置，则跳到评论列表
            // else {
            //   wrapDOM.scrollTop = commentDOM.offsetTop - 45;
            // }
          }}
        />
        <Popup
          visible={showPopup}
          bodyStyle={{ height: "100vh" }}
          position={"right"}
          destroyOnClose
        >
          <CommentInput
            onPublish={async (value) => {
              await dispatch(articlePublishComment(id, value));
              setShowPopup(false);
            }}
            onClose={() => {
              setShowPopup(false);
            }}
          ></CommentInput>
        </Popup>
        <Popup
          visible={showReply}
          bodyStyle={{ height: "100vh" }}
          position={"right"}
          destroyOnClose
        >
          <CommentReply
            comment={replyOrigincomment}
            onClose={() => {
              setShowReply(false);
              setReplyOriginComment({} as Comment);
            }}
          ></CommentReply>
        </Popup>
      </div>
    </div>
  );
};

export default Article;
