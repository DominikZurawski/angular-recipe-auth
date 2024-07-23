export class User {
  constructor(
    public email: string,
    public name: string,
    private _token: string,

  ) {}

//   get token() {
//     if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
//       return null;
//     }
//     return this._token;
//   }
}
