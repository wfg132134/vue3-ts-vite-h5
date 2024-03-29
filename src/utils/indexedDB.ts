export default class DB {
  private dbName: string;  // 数据库名称
  private db: any; // 定义数据库对象
  constructor(dbName: string) {
    this.dbName = dbName
  }
  public openStore(storeName: string, keyPath: string, version: any = 1) {
    const request = window.indexedDB.open(this.dbName, version)
    return new Promise((resolve,reject)=>{
      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        // console.log("数据库打开成功");
        // console.log("event2", event);
        resolve(true)
      }
      request.onerror = (event) => {
        // console.log("数据库打开失败");
      }
      request.onupgradeneeded = (event:any) => {
        // console.log("数据库升级成功");
        this.db = event.target.result;
        const { result }: any = event.target
        //创建对象仓库
        const store = result.createObjectStore(storeName, { autoIncrement: true, keyPath })
        //创建这个对象仓库成功的回调
        store.transaction.oncomplete =(event: any) => {
          // console.log("创建对象仓库成功");
        }
      }
    })
  }

  // 新增或者修改数据库数据
  public updateItem(storeName: string, data: any){
    const store = this.db.transaction([storeName],'readwrite').objectStore(storeName);
    const request = store.put({
      ...data,
      updateTime:new Date().getTime()
    });
    return new Promise((resolve,reject)=>{
      request.onsuccess = (event: any) => {
        // console.log("数据写入成功");
        // console.log("event222", event);
        resolve(event)
      }
      request.onerror = (event:any) => {
        // console.log("数据写入失败");
        reject(event)
      }
    })
  }

  // 数据库删除数据
  public deleteItem(storeName: string, key: number | string){
    const store = this.db.transaction([storeName],'readwrite').objectStore(storeName);
    const request = store.delete(key);
    return new Promise((resolve,reject)=>{
      request.onsuccess = (event: any) => {
        resolve(event)
        // console.log("数据删除成功");
      }
      
      request.onerror = (event:any) => {
        resolve(event)
        // console.log("数据删除失败");
      }
    })
  }

  // 查询所有的数据
  public getItemList(storeName: string){
    const store = this.db.transaction([storeName]).objectStore(storeName);
    const request = store.getAll();
    return new Promise((resolve, reject)=>{
      request.onsuccess = (event: any) => {
        // console.log("数据获取全部成功");
        console.log(event.target.result);
        resolve(event.target.result);
      }
      request.onerror = (event:any) => {
        // console.log("数据获取全部失败");
        reject(event)
      }
    })
  }

    // 查询某一条的数据
    public getItemOne(storeName: string, key: number | string){
      const store = this.db.transaction([storeName]).objectStore(storeName);
      const request = store.get(key);
      return new Promise((resolve, reject)=>{
        request.onsuccess = (event: any) => {
          // console.log("查询这条数据成功");
          // console.log(event.target.result);
          resolve(event.target.result);
        }
        request.onerror = (event:any) => {
          // console.log("查询这条数据失败");
          reject(event)
        }
      })
    }
}