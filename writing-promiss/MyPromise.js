const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise{
  constructor(executor){
    this._state = PENDING;
    this._value = undefined;
    try{
      executor(this._resolve.bind(this),this._rejected.bind(this))
    }catch(err){
      this._rejected(err)
    }
  }

  _changeState(state,value){
    if (this._state !== PENDING) return
    this._state = state;
    this._value = value
  }

  _resolve(data){
    this._changeState(FULFILLED,data)
  }

  _rejected(reason){
    this._changeState(REJECTED,reason)
  }
}

const pro = new MyPromise((resolve,reject)=>{
  throw 123321
})

console.log(pro);
