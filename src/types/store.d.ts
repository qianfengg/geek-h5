import {
  User,
  Token,
  Profile,
  Channel,
  ArticlePage,
  Suggestion,
  History,
  SearchResult,
  ArticleDetail,
  CommentPage,
} from "./data.d";
import store from "@/store";
import { ThunkAction } from "redux-thunk";

export type LoginSetTokenAction = {
  type: "login/set_token";
  payload: Token;
};

export type ProfileSetUserAction = {
  type: "profile/set_user";
  payload: User;
};

export type ProfileSetProfileAction = {
  type: "profile/set_profile";
  payload: Profile;
};

export type HomeSetUserChannelsAction = {
  type: "home/set_user_channels";
  payload: Channel[];
};

export type HomeSetAllChannelsAction = {
  type: "home/set_all_channels";
  payload: Channel[];
};

export type HomeSetActiveChannelIdAction = {
  type: "home/set_active_channel_id";
  payload: number;
};

export type HomeSetChannelArticleAction = {
  type: "home/set_channel_article";
  payload: {
    channelId: number;
    data: ArticlePage;
  };
};

export type SearchSetSuggestionAction = {
  type: "search/set_suggestion";
  payload: Suggestion;
};

export type SearchSetHistoryAction = {
  type: "search/set_history";
  payload: History;
};

export type SearchSetSearchResultAction = {
  type: "search/set_search_result";
  payload: SearchResult;
};

export type ArticleSetDetailAction = {
  type: "article/set_detail";
  payload: ArticleDetail;
};

export type ArticleSetCommentsAction = {
  type: "article/set_comments";
  payload: CommentPage;
};

export type ArticleSetReplysAction = {
  type: "article/set_replys";
  payload: CommentPage;
};

// 所有 Action 汇总成的类型
export type RootAction =
  | LoginSetTokenAction
  | ProfileSetUserAction
  | ProfileSetProfileAction
  | HomeSetUserChannelsAction
  | HomeSetAllChannelsAction
  | HomeSetActiveChannelIdAction
  | HomeSetChannelArticleAction
  | SearchSetSuggestionAction
  | SearchSetHistoryAction
  | SearchSetSearchResultAction
  | ArticleSetDetailAction
  | ArticleSetCommentsAction
  | ArticleSetReplysAction;

export type RootState = ReturnType<typeof store.getState>;

export type RootThunkAction = ThunkAction<void, RootState, unknown, RootAction>;
