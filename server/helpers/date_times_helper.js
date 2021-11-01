let addMinWithNow = (total) => new Date().setHours(new Date().getMinutes() + total)

let addDateWithNow = (total) => new Date().setDate(new Date().getDate() + total)

let compareDateNow = (date) => {
    let now = new Date()

    if (now.getTime() == date.getTime()) {
        // date = now
        return 1;
    } else if (now.getTime() < date.getTime()) {
        // date > now
        return 2;
    } else {
        // date < now
        return 0;
    }
}


let getNowToNumber = () => new Date().getTime()  

module.exports = {
    addMinWithNow,
    compareDateNow,
    addDateWithNow,
    getNowToNumber
}