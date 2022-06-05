/**
 * * 高德地图组件
 * @author shepard
 */

import React, { useEffect, useRef } from 'react';
import { useMap } from '../hooks/amap';

// Interfaces
import { HTMLElemAttr } from '../types';

// Stylesheet
import './geoMap.scss';

export type GeoMapMarker = {
    position: [number, number],
    label?: string,
    name?: string,
} | [number, number];

export interface GeoMapProps extends HTMLElemAttr<HTMLDivElement> {
    // 地图标记点位置
    center?: [number, number];
    markers?: GeoMapMarker[];
    onMapReady?: (map: any) => void;
    zoomLevel?: number;
}

const GeoMap = React.forwardRef<HTMLDivElement, GeoMapProps>((props, ref) => {
    const {
        center,
        className,
        id,
        markers,
        onMapReady,
        zoomLevel,
        ...otherProps
    } = props;

    const mapIdRef = useRef(id || (Date.now().toString() + (Math.random() * 100000).toFixed(0)));

    const { map, Amap } = useMap(mapIdRef.current, {
        mapStyle: 'amap://styles/macaron',
        center: [105, 35],
        zoom: 1,
    }, onMapReady);

    const markersRef = useRef<{ mapMarker: any, mapLabel: any }[]>([]);

    // 刷新标记位置
    useEffect(() => {
        if (!map || !Amap) return;

        // 重置所有标记
        if (markersRef.current.length) {
            markersRef.current.forEach((elem) => {
                if (elem.mapLabel)
                    map.remove(elem.mapLabel);
                map.remove(elem.mapMarker);
            })
            markersRef.current = [];
        }

        // 初始化标记点列表
        markersRef.current = (markers || []).map((marker) => {
            if (marker === undefined || marker === null)
                throw new Error("GeoMap: Passing invalid marker as prop.");

            const isSimpleMarker = Array.isArray(marker);
            const mapMarker = isSimpleMarker
                ? new Amap.Marker({
                    position: marker,
                    icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png"
                })
                : new Amap.Marker({
                    position: marker.position,
                    title: marker.name,
                    icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png"
                });
            const mapLabel = isSimpleMarker
                ? null
                : marker.label
                    ? new Amap.Text({
                        position: marker.position,
                        text: marker.label,
                        anchor: 'top-left'
                    })
                    : null;

            mapMarker.on('click', () => {
                mapMarker.markOnAMAP({
                    name: isSimpleMarker ? '' : marker.name,
                    position: isSimpleMarker ? marker : marker.position,
                });
            });

            return { mapMarker, mapLabel };
        });

        markersRef.current.forEach((elem) => {
            if (elem.mapLabel)
                map.add(elem.mapLabel);
            map.add(elem.mapMarker);
        })

        console.log('GeoMap: markers set');
    }, [map, Amap, markers]);

    // 设置缩放级别
    useEffect(() => {
        if (!map || !Amap) return;

        map.setZoom(zoomLevel);
        if (center) map.setCenter(center);

        console.log('GeoMap: setting zoom level to', zoomLevel);

    }, [zoomLevel]);

    // 设置地图中心
    useEffect(() => {
        if (!map || !Amap) return;

        if (center) map.setCenter(center);

        console.log('GeoMap: setting center', center);
    }, [center]);

    return (
        <div className={`geo-map ${className || ''}`} id={mapIdRef.current} ref={ref} {...otherProps} />
    );
});

export default GeoMap;