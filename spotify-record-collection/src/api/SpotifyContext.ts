import React from "react";
import { SpotifyAuthDetails } from "../components/SpotifyAuth";

export const SpotifyContext = React.createContext<SpotifyContextData>({
  authDetails: undefined,
  authDetailsUpdated: () => {},
});

export type SpotifyContextData = {
  authDetails: SpotifyContextAuthDetails,
  authDetailsUpdated: (authDetails: SpotifyContextAuthDetails) => void
}

export type SpotifyContextAuthDetails = SpotifyAuthDetails | undefined;