module.exports = {
    getDate: function() {
        return new Date();
    },
    
    dateToInt: function(date) {
        var dateTime = '';
        
        dateTime += date.getFullYear();
        dateTime += ('0' + (date.getMonth() + 1)).slice(-2);
        dateTime += ('0' + date.getDate()).slice(-2);
        dateTime += ('0' + date.getHours()).slice(-2);
        dateTime += ('0' + date.getMinutes()).slice(-2);
        dateTime += ('0' + date.getSeconds()).slice(-2);

        return parseInt(dateTime);
    }
}