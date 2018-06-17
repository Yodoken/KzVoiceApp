// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  region: 'ap-northeast-1',
  userPoolId: 'ap-northeast-1_8XfLabWrT', // User Pools の画面から取得できる User Pools ID。
  clientId: '3cko35rvoe0pohlfn7ocn6em7m', // User Pools で発行したクライアントアプリケーションのID。
//  apiServerUrl: 'messages.json' // API Server
  apiServerUrl: 'https://voice.kzsoft.work/api/message' // API Server
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
