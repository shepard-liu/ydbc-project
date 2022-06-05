import { useEffect, useRef, useState } from "react";

// 设置高德地图安全代码
(window as any)._AMapSecurityConfig = {
    securityJsCode: 'ac9f17feb51213464455cde088a274df',
}

// eslint-disable-next-line
import AMapLoader from '@amap/amap-jsapi-loader';

const amapLoaderOptions = {
    key: 'afaf068e8d94f762627f278a497c8e3c',
    version: '1.4.15',
    plugins: ['AMap.PlaceSearch', 'AMap.AutoComplete', 'AMap.Geocoder']
};


interface AmapOptions {
    zoom?: number,
    center?: [number, number],
    mapStyle?: string,
}

let AmapGlobal: any = null;

/**
 * Amap加载
 * @param cb 
 */
function loadAmap(cb: (Amap) => void) {

    if (AmapGlobal) cb(AmapGlobal);
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
export const useMap = (containerId: string, options: AmapOptions, onMapReady?: (map: any) => void) => {

    const [map, setMap] = useState<any>(null);

    const paramsRef = useRef<{
        options: AmapOptions,
        containerId: string,
        onMapReady: (map: any) => void,
    }>({
        options,
        containerId,
        onMapReady: null,
    });

    Object.assign(paramsRef.current, { options, containerId, onMapReady });

    useEffect(() => {
        if (map) return;
        const { containerId, options, onMapReady } = paramsRef.current;

        loadAmap((Amap) => {
            const newMap = new Amap.Map(containerId, {
                ...options,
                layers: [new Amap.TileLayer.RoadNet()],
            });
            setMap(newMap);
            if (onMapReady) onMapReady(newMap);
        });

        return () => {
            map?.destroy();
            setMap(null);
        }
    }, []); // eslint-disable-line

    return {
        map,
        Amap: AmapGlobal
    }
}

export type MapSearchSelectHandler = (address: string, lonLat: [number, number]) => void;

/**
 * * 地理位置和行政区搜索钩子
 * @param inputId 
 * @param map 
 * @param onSelect 
 * @returns {}
 */
export const useSearch = (
    inputId: string,
    map: any,
) => {

    const [seachUtils, setSearchUtils] = useState<{ placeSearch: any, districtSearch: any }>({
        placeSearch: null,
        districtSearch: null
    });

    useEffect(() => {
        if (seachUtils.placeSearch && seachUtils.districtSearch) return;
        if (map === null) return;

        loadAmap((Amap: any) => {

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
}



export const useGeocoder = () => {

    const [geocoder, setGeocoder] = useState<any>(null);

    useEffect(() => {
        if (geocoder) return;
        loadAmap((Amap) => {
            Amap.plugin(["AMap.Geocoder"], function () { //加载地理编码插件
                setGeocoder(new Amap.Geocoder());
            });
        });
    }, [geocoder]);

    return { geocoder };
};