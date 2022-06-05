var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * * 高德地图组件
 * @author shepard
 */
import React, { useEffect, useRef } from 'react';
import { useMap } from '../hooks/amap';
// Stylesheet
import './geoMap.scss';
const GeoMap = React.forwardRef((props, ref) => {
    const { markerLonLat, className, id, onMapReady } = props, otherProps = __rest(props, ["markerLonLat", "className", "id", "onMapReady"]);
    const mapIdRef = useRef(id || (Date.now().toString() + (Math.random() * 100000).toFixed(0)));
    const { map, Amap } = useMap(mapIdRef.current, {
        mapStyle: 'amap://styles/macaron',
        center: [105, 35],
        zoom: 1,
    }, onMapReady);
    const markerRef = useRef(null);
    // 刷新标记位置
    useEffect(() => {
        if (!map || !Amap)
            return;
        if (markerRef.current) {
            markerRef.current.setPosition(markerLonLat);
            return;
        }
        // 显示标记点
        const marker = markerRef.current = new Amap.Marker({
            position: markerLonLat,
        });
        // 设置单击标记唤起地图
        marker.on('click', () => {
            marker.markOnAMAP({
                name: '项目位置',
                position: marker.getPosition(),
            });
        });
        map.add(marker);
        console.log('marker set');
    }, [markerLonLat, map, Amap]);
    return (_jsx("div", Object.assign({ className: `geo-map ${className || ''}`, id: mapIdRef.current, ref: ref }, otherProps)));
});
export default GeoMap;
