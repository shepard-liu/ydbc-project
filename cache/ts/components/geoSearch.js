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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IonList, IonSelect, IonSelectOption } from '@ionic/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGeocoder, useSearch } from '../hooks/amap';
import { useDebounce, useThrottleSync } from '../hooks/d&t';
// Components
// Interfaces
// Stylesheet
import './geoSearch.scss';
import { Input } from './input';
const GeoSearch = React.forwardRef((props, ref) => {
    const { className, map, onSearch, id } = props, otherProps = __rest(props, ["className", "map", "onSearch", "id"]);
    const inputIdRef = useRef(Date.now().toString() + (Math.random() * 10000000).toFixed(0));
    const searchBoxElemRef = useRef(null);
    // Geo search utils
    const { placeSearch, districtSearch } = useSearch(inputIdRef.current, map);
    // Geo coder
    const { geocoder } = useGeocoder();
    // Geo search keywords
    const [keywords, setKeywords] = useState([]);
    // Geo search input value
    const [value, setValue] = useState('');
    // Provinces
    const [provinceList, setProvinceList] = useState([]);
    const [province, setProvince] = useState('');
    // Cities
    const [cityList, setCityList] = useState([]);
    const [city, setCity] = useState('');
    // AutoComplete Suggestions
    const [suggestions, setSuggestions] = useState([]);
    // Show auto complete
    const [showAutoComplete, setShowAutoComplete] = useState(false);
    // Selected suggestion
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    // Initialize Province list
    useEffect(() => {
        if (!districtSearch || provinceList.length !== 0)
            return;
        districtSearch.setLevel('country');
        districtSearch.setSubdistrict(1);
        districtSearch.search("中国", (_, result) => {
            const newProvinces = result.districtList[0].districtList
                .map((elem) => elem.name)
                .sort(((a, b) => a.localeCompare(b)));
            setProvinceList(newProvinces);
        });
    }, [districtSearch, provinceList]);
    // Initialize auto complete shutdown listener
    useEffect(() => {
        let clickedOnAutoComplete = false;
        searchBoxElemRef.current.addEventListener('click', (ev) => {
            clickedOnAutoComplete = true;
        });
        document.addEventListener('click', (ev) => {
            if (!clickedOnAutoComplete)
                setShowAutoComplete(false);
            clickedOnAutoComplete = false;
        });
    }, []);
    const handleProvinceSelectionChange = useCallback((event) => {
        const newProvince = event.detail.value;
        setProvince(newProvince);
        setCity('');
        setCityList([]);
        if (newProvince === '台湾省') {
            setCity('暂不支持');
            setCityList(['暂不支持']);
            return;
        }
        if (!districtSearch)
            return;
        districtSearch.setLevel('province');
        districtSearch.setSubdistrict(1);
        districtSearch.search(newProvince, (_, result) => {
            const newCities = result.districtList[0].districtList.map((elem) => elem.name);
            setCityList(newCities);
        });
    }, [districtSearch]);
    const handleCitySelectionChange = useCallback((event) => {
        const newCity = event.detail.value;
        setCity(newCity);
        setSuggestions([]);
        setValue('');
        // 逆地理编码
        if (!geocoder || newCity.length === 0)
            return;
        geocoder.setCity(newCity);
        geocoder.getLocation(newCity, (_, result) => {
            const location = result.geocodes[0].location;
            const lonLat = [location.lng, location.lat];
            if (onSearch)
                onSearch(newCity, result.geocodes[0].formattedAddress, lonLat, 10);
        });
    }, [geocoder, onSearch]);
    const queryAutoComplete = useCallback((placeSearch, value) => {
        placeSearch.setCity(city);
        placeSearch.search(value, (_, result) => {
            if (result.info !== 'OK' || result.poiList.pois[0].cityname !== city) {
                geocoder.getLocation(city, (_, result) => {
                    const location = result.geocodes[0].location;
                    const lonLat = [location.lng, location.lat];
                    setSuggestions([{ id: '-1', name: value, lonLat: lonLat, address: result.geocodes[0].formattedAddress }]);
                });
            }
            else {
                const newSuggestions = result.poiList.pois.map((p) => ({
                    id: p.id,
                    name: p.name,
                    address: p.address,
                    lonLat: [p.location.lng, p.location.lat]
                }));
                setSuggestions(newSuggestions.reverse());
            }
            setShowAutoComplete(true);
        });
    }, [city]);
    const queryAutoCompleteDebounced = useDebounce(queryAutoComplete, 500);
    const queryAutoCompleteThrottled = useThrottleSync(queryAutoComplete, 1000);
    const handleInputChange = useCallback((ev) => {
        const newValue = ev.currentTarget.value;
        setValue(newValue);
        if (!city || !placeSearch || newValue.length === 0)
            return;
        queryAutoCompleteDebounced(placeSearch, newValue);
        queryAutoCompleteThrottled(placeSearch, newValue);
        setSelectedSuggestion(null);
    }, [placeSearch, city, queryAutoCompleteDebounced, queryAutoCompleteThrottled]);
    const handleSelectSuggestion = useCallback((item) => {
        if (onSearch)
            onSearch(item.name, item.address, item.lonLat, 14);
        if (item.id)
            setSelectedSuggestion(item);
    }, [onSearch]);
    return (_jsxs("div", Object.assign({ className: `geo-search  ${className || ''}`, ref: ref }, otherProps, { children: [_jsxs("div", Object.assign({ className: 'district Flex' }, { children: [_jsx(IonSelect, Object.assign({ className: 'province-select Flex-grow', interface: "popover", onIonChange: handleProvinceSelectionChange, value: province, placeholder: provinceList.length === 0 ? "正在获取..." : '请选择省份' }, { children: provinceList.map((p) => (_jsx(IonSelectOption, { children: p }, p))) })), _jsx(IonSelect, Object.assign({ className: 'city-select Flex-grow', interface: "popover", placeholder: provinceList.length === 0 ? "正在获取..." : '请选择市区', onIonChange: handleCitySelectionChange, value: city }, { children: cityList.map((c) => (_jsx(IonSelectOption, { children: c }, c))) }))] })), _jsxs("div", Object.assign({ className: 'search', ref: searchBoxElemRef }, { children: [_jsx(Input, { className: 'input', placeholder: '\u8BF7\u8F93\u5165\u5177\u4F53\u5730\u70B9', onClick: () => setShowAutoComplete(true), id: inputIdRef.current || id, value: value, onChange: handleInputChange }), _jsx(IonList, Object.assign({ className: 'suggestion-list', "data-active": showAutoComplete && suggestions.length !== 0 }, { children: suggestions.map((elem) => (_jsx("div", Object.assign({ className: 'suggestion-item Flex', "data-selected": elem.id === (selectedSuggestion === null || selectedSuggestion === void 0 ? void 0 : selectedSuggestion.id), onClick: () => { handleSelectSuggestion(elem); } }, { children: elem.name }), elem.id))) }))] }))] })));
});
export default GeoSearch;
