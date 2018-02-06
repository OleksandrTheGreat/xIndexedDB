export abstract class IIDBAdapter {
  abstract get() : Promise < IDBDatabase >;
}

export class IDBAdapter implements IIDBAdapter {

  private _db : IDBDatabase = null;
  private _name : string = null;
  private _version : number = null;
  private _upgradeHandler : (db : IDBDatabase) => void = null;
  private _errorHandler : (event : any) => void = null;

  constructor(
    name : string, 
    version : number = 1, 
    upgradeHandler : (db : IDBDatabase) => void = null, 
    errorHandler : (event : Event) => void = null
  ) {
    this._name = name;
    this._version = version;
    this._upgradeHandler = upgradeHandler;
    this._errorHandler = errorHandler;
  }

  get() : Promise < IDBDatabase > {

    if(this._getDBPromise) 
      return this._getDBPromise;
    
    this._initGetDBPromise();

    return this._getDBPromise;
  }

  private _initGetDBPromise() : void {

    this._getDBPromise = new Promise < IDBDatabase > ((resolve, reject) => {

      if (this._db !== null) {
        resolve(this._db);
        return;
      }

      let request = indexedDB.open(this._name, this._version);

      request.onsuccess = (e) => {

        this._db = event.target['result'];

        this._db.onerror = this._errorHandler
          ? this._errorHandler
          : (e : Event) => {
            reject('Database error: ' + e.target['error']['message']);
          };

        this._db.onversionchange = function (event) {
          if (this._db)
            this._db.close();
          reject('A new version is ready. Please reload!');
        };

        resolve(this._db);
      };

      request.onerror = (e) => {
        reject(e);
      };

      request.onupgradeneeded = (e) => {
        if (this._upgradeHandler) 
          this._upgradeHandler(e.target['result']);
        };
    });
  }

  private _getDBPromise : Promise < IDBDatabase > = null;
}
