/**
 * Tencent is pleased to support the open source community by making outerdata-opensouce available.
 * Copyright (C) 2019 Limited, Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
let helper = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    touchStart: function (e, getPosition = false) {
        if (getPosition) {
            return {
                x: e.touches[0].pageX,
                y: e.touches[0].pageY
            }
        }
        helper.startX = e.touches[0].pageX
        helper.startY = e.touches[0].pageY
    },
    touchEnd: function (e, getPosition = false) {
        if (getPosition) {
            return {
                x: e.changedTouches[0].pageX,
                y: e.changedTouches[0].pageY
            }
        }
        helper.endX = e.changedTouches[0].pageX
        helper.endY = e.changedTouches[0].pageY
        // helper.upOrDown(helper.startX, helper.startY, endX, endY)
    },
    upOrDown: function (startX, startY, endX, endY) {
        let direction = helper.GetSlideDirection(startX, startY, endX, endY)
        switch (direction) {
        case 0:
            console.log('没滑动')
            break
        case 1:
            console.log('向上')
            break
        case 2:
            console.log('向下')
            break
        case 3:
            console.log('向左')
            break
        case 4:
            console.log('向右')
            break
        default:
            break
        }
    },
    // 根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
    GetSlideDirection: function (startX, startY, endX, endY) {
        let dy = startY - endY
        let dx = endX - startX
        let result = 0
        // 如果滑动距离太短
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
            return result
        }
        let angle = helper.GetSlideAngle(dx, dy)
        if (angle >= -45 && angle < 45) {
            result = 4
        } else if (angle >= 45 && angle < 135) {
            result = 1
        } else if (angle >= -135 && angle < -45) {
            result = 2
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3
        }
        return result
    },
    // 返回角度
    GetSlideAngle: function (dx, dy) {
        return (Math.atan2(dy, dx) * 180) / Math.PI
    }
}

export default helper
