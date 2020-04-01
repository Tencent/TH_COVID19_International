"use strict";
/**
 * 随机串生成工具
 * 通过洗牌算法生成随机字符串
 */
const randDict = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const symbDict = "!@#$%^&*()_+,./;'[]<>?:";
const assert = require("assert");
class StringToolKit {

    rand(left, right) {
        assert(right > left, "随机区间右值必须大于左值");
        let interval = parseInt(right - left);
        let randNum = Math.round((Math.random() * interval) + left);
        return randNum;
    }

    shuffle(dict) {
        let _dict = dict.split("");
        let swap = (arr, i, j) => { let t = arr[i]; arr[i] = arr[j], arr[j] = t; };
        for (let i = 0; i < _dict.length; i++) {
            swap(_dict, this.rand(0, _dict.length) % (i + 1), i);
        }
        return _dict.slice(0, 32).join("");
    }
    random(dict) {
        let _dict = dict.split("");
        let _rand = [];
        for (let i = 0; i < 32; i++) {
            _rand.push(_dict[this.rand(0, _dict.length)]);
        }
        return _rand.join("");
    }
    genSession() {
        return this.genRandStr({ len: 64, toUpperCase: true, duplicate: true });
    }
    genRandStr({ len, toUpperCase, toLowerCase, duplicate, symbol }) {
        len = len ? len : 32;
        let randFunc = duplicate ? this.random : this.shuffle;
        let dict = symbol ? randDict + symbDict : randDict;
        let tgtStr = "";
        while (tgtStr.length < len) {
            tgtStr = tgtStr + randFunc.apply(this, [dict]);
        }
        tgtStr = tgtStr.length > len ? tgtStr.slice(0, len) : tgtStr;
        tgtStr = toLowerCase === true ? tgtStr.toLowerCase() : tgtStr;
        tgtStr = toUpperCase === true ? tgtStr.toUpperCase() : tgtStr;
        return tgtStr;
    }
}
// let test = new StringToolKit();
// let str = test.genRandStr({ len: 64, duplicate: false, symbol: false, toUpperCase: true });
// console.log(str);
module.exports = new StringToolKit();