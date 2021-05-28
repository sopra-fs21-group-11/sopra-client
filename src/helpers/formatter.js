export const formatLatLong = (latLong) => {
    
    return isNaN(latLong)?latLong:parseFloat(latLong).toFixed(2);
};