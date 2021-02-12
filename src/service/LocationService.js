import * as APIs from '../common/backendConstants';
import { axiosInstance } from '../store/store'

export const getCountriesService = () => {
    return axiosInstance.get(APIs.GET_COUNTRIES);
}

export const getStatesService = (param) => {
    return axiosInstance.get(APIs.GET_STATES.replace(':country', param));
}

export const getCitiesService = (param) => {
    return axiosInstance.get(APIs.GET_CITIES.replace(':state', param));
}