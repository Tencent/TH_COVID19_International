"use strict";
/**
 * sleep工具
 * await sleep(ms)可挂起对应的毫秒
 */
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

module.exports.sleep = sleep;