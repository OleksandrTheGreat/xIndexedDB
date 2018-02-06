import {IIDBAdapter} from './IDBAdapter';

export abstract class IIDBRepository {
  abstract query < T > (storeName : string, query? : (obj : T) => boolean) : Promise < Array < T > >;
  abstract getById < T > (storeName : string, id : any) : Promise < T >;
  abstract update < T > (storeName : string, entity : T) : Promise < void >;
}

export class IDBRepository implements IIDBRepository {

  private _idbAdapter : IIDBAdapter;

  constructor(private idbAdapter : IIDBAdapter) {
    this._idbAdapter = idbAdapter;
  }

  query < T > (storeName : string, query : (obj : T) => boolean) : Promise < Array < T > > {

    return new Promise < Array < T > > ((resolve, reject) => {

      this
        ._idbAdapter
        .get()
        .then(db => {

          let result : Array < T > = [];

          let request = db
            .transaction(storeName, 'readonly')
            .objectStore(storeName)
            .openCursor();

          request.onsuccess = (e : any) => {

            let cursor = e.target.result;

            if (!cursor) {
              resolve(result);
              return;
            }

            let value : T = cursor.value;

            if (query) {

              if (query(value)) 
                result.push(value);
              
              cursor.continue();
              return;
            }

            result.push(value);
            cursor.continue();
          };

          request.onerror = (e) => {
            reject((<IDBRequest>e.currentTarget).error.message);
          };
        });
    });
  }

  getById < T > (storeName : string, id : any) : Promise < T > {

    return new Promise < T > ((resolve, reject) => {

      this
        ._idbAdapter
        .get()
        .then(db => {

          let request = db
            .transaction(storeName, 'readonly')
            .objectStore(storeName)
            .get(id);

          request.onsuccess = (e) => {
            resolve(request.result);
          };

          request.onerror = (e) => {
            reject((<IDBRequest>e.currentTarget).error.message);
          };
        });
    });
  }

  update < T > (storeName : string, entity : T) : Promise < void > {
    return new Promise < void > ((resolve, reject) => {

      this
        ._idbAdapter
        .get()
        .then(db => {

          let request = db
            .transaction(storeName, 'readwrite')
            .objectStore(storeName)
            .put(entity);

          request.onsuccess = () => {
            resolve();
          };

          request.onerror = (e) => {
            reject((<IDBRequest>e.currentTarget).error);
          };
        });
    });
  }
}
