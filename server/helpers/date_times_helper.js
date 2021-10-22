let addHourDateTimeNow = (hour) => {
    let myDate = new Date()
    return myDate.setHours(myDate.getHours() + 1);
}

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


module.exports = {
    addHourDateTimeNow,
    compareDateNow
}