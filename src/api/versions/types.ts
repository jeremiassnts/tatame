export interface GetLastVersionResponse {
  data: {
    appVersion: string;
    disabledAt: string | null;
  };
}
