import { IonButton, IonIcon, IonList, IonSelect, IonSelectOption, SelectChangeEventDetail, useIonAlert } from '@ionic/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGeocoder, useSearch } from '../hooks/amap';
import { ArrayElement, HTMLElemAttr } from '../types';
import { useDebounce, useThrottleSync } from '../hooks/d&t';
import { locate } from 'ionicons/icons';
import { Geolocation as GeolocationCordova } from '@awesome-cordova-plugins/geolocation';
import { Geolocation } from '@capacitor/geolocation';

// Components

// Interfaces

// Stylesheet
import './geoSearch.scss';
import { Input } from './input';

export interface GeoSearchProps extends HTMLElemAttr<HTMLDivElement> {
    map: any;
    onSearch?: (name: string, address: string, lonLat: [number, number], zoomLevel: number) => void;
}

interface Suggestion {
    id: string, name: string, address: string, lonLat: [number, number]
}

const GeoSearch: React.FC<GeoSearchProps> = React.forwardRef<HTMLDivElement, GeoSearchProps>((props, ref) => {
    const {
        className,
        map,
        onSearch,
        id,
        ...otherProps
    } = props;

    const inputIdRef = useRef<string>(Date.now().toString() + (Math.random() * 10000000).toFixed(0));

    const searchBoxElemRef = useRef<HTMLDivElement>(null);

    // Geo search utils
    const { placeSearch, districtSearch } = useSearch(inputIdRef.current, map);
    // Geo coder
    const { geocoder } = useGeocoder();

    // Geo search input value
    const [value, setValue] = useState<string>('');

    // Provinces
    const [provinceList, setProvinceList] = useState<string[]>([]);
    const [province, setProvince] = useState<string>('');
    // Cities
    const [cityList, setCityList] = useState<string[]>([]);
    const [city, setCity] = useState<string>('');
    // AutoComplete Suggestions
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    // Show auto complete
    const [showAutoComplete, setShowAutoComplete] = useState<boolean>(false);
    // Selected suggestion
    const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion>(null);

    // Initialize Province list
    useEffect(() => {
        if (!districtSearch || provinceList.length !== 0) return;

        districtSearch.setLevel('country');
        districtSearch.setSubdistrict(1);
        districtSearch.search("??????", (_, result) => {
            const newProvinces = result.districtList[0].districtList
                .map((elem) => elem.name)
                .sort(((a: string, b: string) => a.localeCompare(b)));
            setProvinceList(newProvinces);
        });
    }, [districtSearch, provinceList]);

    // Initialize auto complete shutdown listener
    useEffect(() => {
        let clickedOnAutoComplete = false;

        searchBoxElemRef.current.addEventListener('click', (ev) => {
            clickedOnAutoComplete = true;
        })

        document.addEventListener('click', (ev) => {
            if (!clickedOnAutoComplete)
                setShowAutoComplete(false);
            clickedOnAutoComplete = false;
        })
    }, []);

    const handleProvinceSelectionChange = useCallback((event: CustomEvent<SelectChangeEventDetail<string>>) => {
        console.log("GeoSearch: Changing Province Selection");
        const newProvince = event.detail.value;
        setProvince(newProvince);
        setCity('');
        setCityList([]);

        if (newProvince === '?????????') {
            setCity('????????????');
            setCityList(['????????????']);
            return;
        }

        if (!districtSearch) return;
        districtSearch.setLevel('province');
        districtSearch.setSubdistrict(1);
        districtSearch.search(newProvince, (_, result) => {
            const newCities = result.districtList[0].districtList.map((elem) => elem.name);
            setCityList(newCities);
        });
    }, [districtSearch]);

    const handleCitySelectionChange = useCallback((event: CustomEvent<SelectChangeEventDetail<string>>) => {
        console.log("GeoSearch: Changing City Selection");

        const newCity = event.detail.value;
        setCity(newCity);
        setSuggestions([]);
        setValue('');
    }, []);

    const queryAutoComplete = useCallback((placeSearch: any, value: string) => {
        placeSearch.setCity(city);
        placeSearch.search(value, (_, result) => {
            console.log('GeoSearch: query autocomplete -', result);
            const queriedCityName = result?.poiList?.pois[0]?.cityname;
            if (result.info !== 'OK' || (queriedCityName !== city && queriedCityName !== province)) {
                geocoder.getLocation(city, (_, result) => {
                    const location = result.geocodes[0].location;
                    const lonLat = [location.lng, location.lat] as [number, number];
                    setSuggestions([{ id: '-1', name: value, lonLat: lonLat, address: result.geocodes[0].formattedAddress }]);
                })
            } else {
                const newSuggestions = result.poiList.pois.map((p) => ({
                    id: p.id,
                    name: p.name,
                    address: p.address,
                    lonLat: [p.location.lng, p.location.lat]
                })) as typeof suggestions;
                setSuggestions(newSuggestions.reverse());
            }
            setShowAutoComplete(true);
        });
    }, [city, geocoder, province]);
    const queryAutoCompleteDebounced = useDebounce(queryAutoComplete, 500);
    const queryAutoCompleteThrottled = useThrottleSync(queryAutoComplete, 1000);

    const handleInputChange = useCallback<Input.Props['onChange']>((ev) => {

        console.log("GeoSearch: Changing Address Input value");

        const newValue = ev.currentTarget.value;
        setValue(newValue);

        if (!city || !placeSearch || newValue.length === 0) return;

        queryAutoCompleteDebounced(placeSearch, newValue);
        queryAutoCompleteThrottled(placeSearch, newValue);

        setSelectedSuggestion(null);
    }, [placeSearch, city, queryAutoCompleteDebounced, queryAutoCompleteThrottled]);

    const handleSelectSuggestion = useCallback((item: ArrayElement<typeof suggestions>) => {
        console.log("GeoSearch: Changing Selected Suggestion");

        if (onSearch) onSearch(item.name, item.address, item.lonLat, 14);
        if (item.id) setSelectedSuggestion(item);
        setValue(item.name);
    }, [onSearch]);

    const [presentAlert] = useIonAlert();

    const handleLocate = useCallback(async () => {
        console.log("GeoSearch: Querying user location");

        // ????????????????????????????????????????????????
        if ((await Geolocation.checkPermissions()).location !== 'granted') {
            const updatedPermissionStatus = await Geolocation.requestPermissions({
                permissions: ['location']
            });
            if (updatedPermissionStatus.location !== 'granted') {
                presentAlert({
                    cssClass: 'locate-alert',
                    header: '??????????????????',
                    message: '???????????????????????????????????????',
                    buttons: [
                        '??????'
                    ]
                });
                return;
            }
        }

        // ??????????????????
        try {
            var position = await GeolocationCordova.getCurrentPosition({ timeout: 10000, enableHighAccuracy: true, maximumAge: 3600 })
        } catch (err) {
            console.log("GeoSearch: Error when getting current location", err);
            presentAlert({
                header: '??????????????????',
                message: '???????????????????????????????????????????????????',
                buttons: [
                    '??????'
                ]
            });
            return;
        }

        const lonLat = [position.coords.longitude, position.coords.latitude] as [number, number];

        if (!geocoder) return;

        geocoder.getAddress(lonLat, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                console.log("GeoSearch: RegeoCode -", result);
                const newAddress = result.regeocode.formattedAddress;
                const newCity = result.regeocode.addressComponent.city;
                const newProvince = result.regeocode.addressComponent.province;
                setProvince(newProvince);
                setCity(newCity);
                setValue(newAddress);
                const newSuggestion: Suggestion = {
                    id: '-1',
                    address: newAddress,
                    lonLat,
                    name: newAddress
                };
                setSuggestions([newSuggestion]);
                setSelectedSuggestion(newSuggestion);
                if (onSearch) onSearch(newSuggestion.name, newSuggestion.address, newSuggestion.lonLat, 15);
            }
        });
    }, [geocoder]);

    return (
        <div className={`geo-search  ${className || ''}`} ref={ref} {...otherProps}>
            <div className='district Flex'>
                <IonSelect className='province-select Flex-grow' interface="popover"
                    onIonChange={handleProvinceSelectionChange} value={province}
                    placeholder={provinceList.length === 0 ? "????????????..." : '???????????????'}>
                    {provinceList.map((p) => (
                        <IonSelectOption key={p}>{p}</IonSelectOption>
                    ))}
                </IonSelect>
                <IonSelect className='city-select Flex-grow' interface="popover"
                    placeholder={provinceList.length === 0 ? "????????????..." : '???????????????'}
                    onIonChange={handleCitySelectionChange} value={city}>
                    {cityList.map((c) => (
                        <IonSelectOption key={c}>{c}</IonSelectOption>
                    ))}
                </IonSelect>
            </div>
            <div className='search Flex' ref={searchBoxElemRef}>
                <Input className='input' placeholder='?????????????????????' onClick={() => setShowAutoComplete(true)}
                    id={inputIdRef.current || id} value={value} onChange={handleInputChange} />
                <IonButton className='locate' fill='clear' onClick={handleLocate}>
                    <IonIcon className='locate-icon' icon={locate}></IonIcon>
                    <span className='locate-text'>????????????</span>
                </IonButton>
                <IonList className='suggestion-list' data-active={showAutoComplete && suggestions.length !== 0}>{
                    suggestions.map((elem) => (
                        <div className='suggestion-item Flex' data-selected={elem.id === selectedSuggestion?.id}
                            onClick={() => { handleSelectSuggestion(elem); }} key={elem.id}>
                            {elem.name}
                        </div>
                    ))
                }</IonList>
            </div>
        </div >
    );
});

export default GeoSearch;