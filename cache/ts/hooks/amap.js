import { useEffect, useRef, useState } from "react";
// 设置高德地图安全代码
window._AMapSecurityConfig = {
    securityJsCode: 'ac9f17feb51213464455cde088a274df',
};
// eslint-disable-next-line
import AMapLoader from '@amap/amap-jsapi-loader';
const amapLoaderOptions = {
    key: 'afaf068e8d94f762627f278a497c8e3c',
    version: '1.4.15',
    plugins: ['AMap.PlaceSearch', 'AMap.AutoComplete', 'AMap.Geocoder']
};
let AmapGlobal = null;
/**
 * Amap加载
 * @param cb
 */
function loadAmap(cb) {
    if (AmapGlobal)
        cb(AmapGlobal);
    else {
        AMapLoader.load(amapLoaderOptions).then((Amap) => {
            AmapGlobal = Amap;
            cb(Amap);
        }).catch(console.log);
    }
}
/**
 * * 地图钩子
 * @param containerId
 * @param options
 * @param onMapReady
 * @returns {map, Amap}
 */
export const useMap = (containerId, options, onMapReady) => {
    const [map, setMap] = useState(null);
    const paramsRef = useRef({
        options,
        containerId,
        onMapReady: null,
    });
    Object.assign(paramsRef.current, { options, containerId, onMapReady });
    useEffect(() => {
        if (map)
            return;
        const { containerId, options, onMapReady } = paramsRef.current;
        loadAmap((Amap) => {
            const newMap = new Amap.Map(containerId, Object.assign(Object.assign({}, options), { layers: [new Amap.TileLayer.RoadNet()] }));
            setMap(newMap);
            if (onMapReady)
                onMapReady(newMap);
        });
        return () => {
            map === null || map === void 0 ? void 0 : map.destroy();
            setMap(null);
        };
    }, []); // eslint-disable-line
    return {
        map,
        Amap: AmapGlobal
    };
};
/**
 * * 地理位置和行政区搜索钩子
 * @param inputId
 * @param map
 * @param onSelect
 * @returns {}
 */
export const useSearch = (inputId, map) => {
    const [seachUtils, setSearchUtils] = useState({
        placeSearch: null,
        districtSearch: null
    });
    useEffect(() => {
        if (seachUtils.placeSearch && seachUtils.districtSearch)
            return;
        if (map === null)
            return;
        loadAmap((Amap) => {
            Amap.plugin(['AMap.PlaceSearch', "AMap.DistrictSearch"], function () {
                setSearchUtils({
                    placeSearch: new Amap.PlaceSearch({
                        map
                    }),
                    districtSearch: new Amap.DistrictSearch({
                        level: 'country',
                        subdistrict: 1
                    })
                });
                console.log('geo search init');
                // params.autoComplete.on("select", (e) => {
                //     let lon = e.poi.location.getLng();
                //     let lat = e.poi.location.getLat();
                //     let lonLat: [number, number] = [lon, lat];
                //     var geocoder = new Amap.Geocoder({
                //         // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                //         city: e.poi.adcode
                //     })
                //     geocoder.getAddress(lonLat, function (status, result) {
                //         if (status === 'complete' && result.info === 'OK') {
                //             // result为对应的地理位置详细信息
                //             let address = result.regeocode.formattedAddress;
                //             params.onSelect(address, lonLat);
                //         }
                //     })
                //     params.placeSearch.setCity(e.poi.adcode);
                //     params.placeSearch.search(e.poi.name);  //关键字查询
                // });//注册监听，当选中某条记录时会触发
            });
        });
    }, [map, inputId, seachUtils]);
    return seachUtils;
};
export const useGeocoder = () => {
    const [geocoder, setGeocoder] = useState(null);
    useEffect(() => {
        if (geocoder)
            return;
        loadAmap((Amap) => {
            Amap.plugin(["AMap.Geocoder"], function () {
                setGeocoder(new Amap.Geocoder());
            });
        });
    }, [geocoder]);
    return { geocoder };
};
