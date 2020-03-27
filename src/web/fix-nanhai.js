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
const fs = require('fs')
const path = require('path')

fs.writeFileSync(path.resolve(__dirname, './node_modules/echarts/lib/coord/geo/fix/nanhai.js'), `
var zrUtil = require("zrender/lib/core/util");
var Region = require("../Region");

// 解决南海诸岛九段线问题 & 钓鱼岛问题
var geoCoord = [126, 25];
var points = [
    [
      [
        122.04711914062499,
        25.661333498952683
      ],
      [
        122.01965332031249,
        25.611809521055477
      ],
      [
        122.091064453125,
        25.596948323286135
      ],
      [
        122.11303710937499,
        25.656382025768067
      ],
      [
        122.04711914062499,
        25.661333498952683
      ]
    ],
    [[122.50662231445312, 23.467723846435547], [122.78874206542969, 24.572216033935547]],
    [[121.17402648925781, 20.826547622680664], [121.91168975830078, 21.6975154876709]],
    [[120.003662109375, 19.03096327846469], [119.47631835937499, 18.020527657852337]]
];
function _default(mapType, regions) {
    if (mapType === 'china') {
        regions.push(new Region('', zrUtil.map(points, function (exterior) {
            return {
                type: 'polygon',
                exterior: exterior
            };
        }), geoCoord));
    }
}

module.exports = _default;
`)

fs.writeFileSync(path.resolve(__dirname, './node_modules/echarts/lib/coord/geo/fix/diaoyuIsland.js'), `
function _default(mapType, region) {
  if (mapType === 'china' && region.name === '台湾') {
    // 钓鱼岛
    region.geometries.push({
      type: 'polygon',
      exterior: [
        [123.25165252685547, 25.73527164402261],
        [123.65731445312499, 25.59527164402261],
        [123.75731445312499, 25.910734064600884],
        [123.45165252685547, 25.800734064600884],
        [123.25165252685547, 25.73527164402261]
      ],
    });
    // 赤尾屿
    region.geometries.push({
      type: 'polygon',
      exterior: [
        [124.45165252685547, 25.93527164402261],
        [124.85731445312499, 25.79527164402261],
        [124.95731445312499, 25.810734064600884],
        [124.65165252685547, 26.000734064600884],
        [124.45165252685547, 25.93527164402261]
      ],
    });
  }
}

module.exports = _default;
`)

fs.writeFileSync(path.resolve(__dirname, './node_modules/echarts/lib/coord/geo/fix/geoCoord.js'), `
// 处理将世界地图移位为以太平洋为中心，美国和俄罗斯label位置不对的bug
var geoCoordMap = {
  'United States': [80, 38],
  'United States of America': [80, 38]
};

function _default(mapType, region) {
  if (mapType === 'world') {
    var geoCoord = geoCoordMap[region.name];

    if (geoCoord) {
      var cp = region.center;
      cp[0] = geoCoord[0];
      cp[1] = geoCoord[1];
    }
  }
}

module.exports = _default;
`)
