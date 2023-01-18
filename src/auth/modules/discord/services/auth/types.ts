export interface IDiscordAuthCallbackQuery {
  code?: string;
  state?: string;
}

export interface IDiscordAuthCallbackCookies {
  DiscordAuthState?: string;
}
