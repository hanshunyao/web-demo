
/**
 * @description: 函数柯里化封装
 */
function curry() {
    var fn = arguments[0]; // 拿到要执行的函数
    var args = Array.prototype.slice.call(arguments, 1);
    // 如果第一次的入参参数数量够了 就直接调用
    if(args.length === fn.length){
        return fn.apply(this, args);
    }
    // 下面是处理参数不够的情况
    function _curry(){
        args.push(...arguments);
        if(args.length === fn.length){
            return fn.apply(this, args);
        }
        return _curry;
    }
    return _curry;
}

function add(a, b, c) {
    return a + b + c;
}

console.log(curry(add)(1)(2)(3)); // 6
console.log(curry(add, 1)(2)(3)); // 6
console.log(curry(add, 1, 2, 3)); // 6
console.log(curry(add, 1)(3, 4)); // 8