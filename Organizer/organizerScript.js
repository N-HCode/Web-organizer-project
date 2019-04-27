var databaseControl = (function(){

    var schedule = function(id, description, timeStart, timeEnd, date) {
        this.id = id;
        this.description = description;
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
        this.date = date;
    };

    var data = {
        nextID: 0,
        unfinishedSchedule: [],
        finishedSchedule: [],
        activeYear: 0,
        activeMonth: 0,
        activeDay: 0,
        startDay: 0,
    };

    return {
        addDataSchedule: function (des, timeS, timeE, date) {
            var newSchedule, ID;

            // Create unique ID for each schedule
            ID = data.nextID;
            data.nextID += 1;
            //console.log(ID);
            //console.log(data.nextID);

            // Create a new schedule object
            newSchedule = new schedule(ID, des, timeS, timeE, date);
            //console.log('TimeS' + timeS);
            //console.log('TimeE' + timeE);

            // Add schedule object in an array to keep as data
            data.unfinishedSchedule.push(newSchedule);
            //data.unfinishedSchedule[data.unfinishedSchedule.length] = newSchedule
            //for some language this is faster as in performance wise, but for JS push is fine. Maybe want to practice this way for other language.

            return newSchedule;
        },

        matchDateToData: function (cDate) {

            var scheduleArrH = [];
            var scheduleArrA = [];
            data.unfinishedSchedule.forEach(function(schedule){
                //console.log(schedule);
                if(schedule.date !== cDate) {
                    scheduleArrH.push(schedule.id);
                }else {
                    scheduleArrA.push(schedule.id);
                }
            });
            //console.log(scheduleArrH);
            return [scheduleArrH,scheduleArrA]
        },

        storeActiveData: function(month,year, day) {
            //console.log(month,year,day)

            data.activeMonth = month;
            data.activeYear = year;
            data.activeDay = parseInt(day);
        },


        getActiveData: function(){
            //console.log(data.activeMonth, data.activeYear, data.activeDay);
            return [data.activeMonth, data.activeYear, data.activeDay];
        },

        getUnfinishedSchedules: function() {
            return data.unfinishedSchedule;
        },

        deleteDataSch: function(id){
            //console.log(data.unfinishedSchedule);

            idArr = data.unfinishedSchedule.map(function(cur){
                return cur.id;
            });

            idIndex = idArr.indexOf(id);

            data.unfinishedSchedule.splice(idIndex, 1);

            //console.log(data.unfinishedSchedule);
        }

    };

})();

var userInterfaceControl = (function(){

    var htmlIdentifier = {
        inputDes: 'description',
        inputTimeStart: 'time-start',
        inputTimeEnd: 'time-end',
        inputDate: 'date',
        addButton: 'add-sch-button',
        scheduleDiv: '.three',
        calanderDays: 'day',
        nextMonth: 'next',
        lastMonth: 'prev',
        curMonth: 'this-month',
        curYear: 'this-year',
        clock: 'clock',
        curDate: 'current-date',
        curSch: 'current-schedule',
        nextSch: 'next-schedule',
        deleteButton:'delete-Sch-',

    };

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var formatTime = function(str, time){

        //console.log(time);


        splitTime = time.split(':');

     
        //console.log(splitTime);

        if (str === 'hh:mm') {
            if (parseInt(splitTime[0]) > 12 )  {

                splitTime[0] = String(parseInt(splitTime[0]) - 12);
                return `${splitTime[0]}:${splitTime[1]} PM`;
            }else {
                //splitTime[0] = String(parseInt(splitTime[0]));
                splitTime[0] = splitTime[0] === '00'? '12' : splitTime[0];
                return `${splitTime[0]}:${splitTime[1]} AM`;
            }
        }else if (str === 'hh:mm:ss'){
            if (parseInt(splitTime[0]) > 12 )  {

                splitTime[0] = String(parseInt(splitTime[0]) - 12);
                return `${splitTime[0]}:${splitTime[1]}:${splitTime[2]} PM`;
            }else {
                //splitTime[0] = String(parseInt(splitTime[0]));
                splitTime[0] = splitTime[0] === '00'? '12' : splitTime[0];
                return `${splitTime[0]}:${splitTime[1]}:${splitTime[2]} AM`;
            }
        }
    };

    var formatDate = function(day,month,year){
        var m = month;
        var d = day;
        var y = year;

        m < 10 ? m = "0" + m : m = m;
        d < 10 ? d = "0" + d : d = d;

        currentDate = y + '-' + m + '-' + d;
        //console.log(currentDate);

        return currentDate;
    }

    return {
        getUserInput: function(){
            return {
                description: document.getElementById(htmlIdentifier.inputDes).value,
                timeStart: document.getElementById(htmlIdentifier.inputTimeStart).value,
                timeEnd: document.getElementById(htmlIdentifier.inputTimeEnd).value,
                date: document.getElementById(htmlIdentifier.inputDate).value
            };
        },

        addScheduleToUI: function (scheduleObject, activeDateData) {

            activatedDate = formatDate(activeDateData[2],activeDateData[0],activeDateData[1]);
            //console.log('activiatedDate: ' + activatedDate);
            //console.log('obj : ' + scheduleObject.date)


            //pHTML = "<p id='schedule-{%id%}'> %des% [%tS% to %tE%] </p>"";
            if (scheduleObject.date === activatedDate){
                pHTML = `<p id='schedule-${scheduleObject.id}'> ${scheduleObject.description} [${formatTime('hh:mm',scheduleObject.timeStart)} to ${formatTime('hh:mm',scheduleObject.timeEnd)}] <button id="delete-Sch-${scheduleObject.id}">-</button></p>`;
            } else {
                pHTML = `<p id='schedule-${scheduleObject.id}' class='hidden'> ${scheduleObject.description} [${formatTime('hh:mm',scheduleObject.timeStart)} to ${formatTime('hh:mm',scheduleObject.timeEnd)}] <button id="delete-Sch-${scheduleObject.id}">-</button></p>`;

            };
           
            //sHTML = pHTML.replace('%id%', scheduleObject.id);
            //sHTML = sHTML.replace('%des%', scheduleObject.description);
            //sHTML = sHTML.replace('%tS%', formatTime(scheduleObject.timeStart));
            //sHTML = sHTML.replace('%tE%', formatTime(scheduleObject.timeEnd));

            document.querySelector(htmlIdentifier.scheduleDiv).insertAdjacentHTML('beforeend', pHTML);
            


        },

        changeActiveDay: function(event) {
            if (event.target.matches('li') || event.target.matches('li').firstChild){
                //console.log(event);

                if (event.target.textContent !== '' || event.target.firstChild.textContent !== ''){
                    if (document.getElementsByClassName('active')[0]){
                        document.getElementsByClassName('active')[0].classList.toggle('active');
                    };
        
                    if (event.target && event.target.matches('li')){
                        event.target.firstChild.classList.toggle('active');
                    } else if (event.target.firstChild) {
                        event.target.classList.toggle('active');
                    };

                    //console.log(event.target.textContent);
                    return String(event.target.textContent);
                };
            };

        },


        getHtmlIdentifier: function() {
            return htmlIdentifier;
        },
        getTheMonth: function() {
            return months.indexOf(document.getElementById(htmlIdentifier.curMonth).textContent) + 1;
        },

        getTheYear: function() {
            return parseInt(document.getElementById(htmlIdentifier.curYear).textContent);
        },

        getTheDate: function(d) {
            //get month and year from html
            m = months.indexOf(document.getElementById(htmlIdentifier.curMonth).textContent) + 1;
            y = parseInt(document.getElementById(htmlIdentifier.curYear).textContent);


            //formatting month and day

            //put year month and day together: formatted to match date in database
            //currentDate = `${y}-${m}-${d}`; I would like to use this if there wasn't a compatibility issue with IE.
            currentDate = formatDate(d,m,y);
            //console.log(currentDate);

            return currentDate;
        },

        changeMonthandYear: function(str, activeData) {
           var curM = userInterfaceControl.getTheMonth();
           var curY = userInterfaceControl.getTheYear();

           //console.log(curM, curY, activeData[0], activeData[1]);

           if (str === 'next'){
               curM += 1;

           }else if (str === 'prev') {
               curM -= 1;
           };

           if (curM === 13) {
               curM = 1;
               curY += 1;
           }else if (curM === 0){
               curM = 12;
               curY -= 1;
           };

           //console.log(curM, curY, activeData[0], activeData[1], activeData[3]);

           //Get the number of days in a month and the weekday the month start with as a number
           numberOfDays = new Date(curY, curM, 0).getDate();
           startDay = new Date(curY+'-'+curM+'-01').getDay() + 1;
           //console.log('num of days:'+numberOfDays);
           //console.log('start day ' + startDay);

           //remove textContent of Days before the first day of the Month.
           for (i=1; i < startDay; i++) {
               document.getElementById(String(i)).firstChild.textContent = '';
           }
           //change the textContent of the Days so that the startday is numbered one.
           for (i=startDay; i < numberOfDays + startDay; i++){
               document.getElementById(String(i)).firstChild.textContent = String(i-(startDay-1));
           }

           //Remove textContent of excess days.
           for (i=numberOfDays + startDay; i <= 41; i++){
            document.getElementById(String(i)).firstChild.textContent = '';
           }

           document.getElementById(htmlIdentifier.curMonth).textContent = months[curM - 1];
           document.getElementById(htmlIdentifier.curYear).textContent = curY;

           if (document.getElementsByClassName('active')[0] && (curM !== activeData[0] || curY !== activeData[1])){
               //remove the active class on the day when you are in a different month or year
               document.getElementsByClassName('active')[0].classList.remove('active');
           }else if (!document.getElementsByClassName('active')[0] && curM === activeData[0] && curY === activeData[1]){
               //make the active day appear when you go back to the month.
                document.getElementById(String(activeData[2] + startDay - 1)).firstChild.classList.add('active');
           };

        },

        hideSchedule: function(scheduleIDarrH,scheduleIDarrA){
            scheduleIDarrH.forEach(function(sID){
                //console.log('schedule-'+String(sID));

                if (!document.getElementById('schedule-' + sID).classList.contains('hidden')){
                    document.getElementById('schedule-' + sID).classList.add('hidden');
                };

            })

            scheduleIDarrA.forEach(function(sID){
                //console.log('schedule-'+String(sID));
                if (document.getElementById('schedule-' + sID).classList.contains('hidden')){
                    document.getElementById('schedule-' + sID).classList.remove('hidden');
                };

            })

        },

        digitalClock: function() {
            var time;

            time = new Date();

            h = time.getHours();
            m = time.getMinutes();
            s = time.getSeconds();

            mo = time.getMonth() + 1;
            d = time.getDate();            
            y = time.getFullYear();

            h = h < 10 ? '0' + h : h;
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;

            curTime = formatTime('hh:mm:ss',h + ':' + m + ':' + s);
            //console.log('current time: ' + curTime);

            document.getElementById(htmlIdentifier.clock).textContent = curTime + ' ' + mo +'/' + d +'/' + y;

            return [h,m,s,mo,d,y];
            
        },

        outsideFormatDate: function(d,m,y){
            //function(day,month,year)
            return formatDate(d,m,y);
        },

        namedMonths: function(){
            return months;
        },

        deleteUISch: function(id){
            schID = 'schedule-' + id;

            var schElement = document.getElementById(schID);
            schElement.parentNode.removeChild(schElement);
        }

    };

    
})();

var masterController = (function(DBCtrl,UICtrl){

    var UITags = UICtrl.getHtmlIdentifier();
    var monthss = UICtrl.namedMonths();

    var setupEventListeners = function(){
        //console.log(UITags);

        document.getElementById(UITags.addButton).addEventListener('click', addSchedule);
        document.getElementById(UITags.calanderDays).addEventListener('click', changeDay);
        document.getElementById(UITags.nextMonth).addEventListener('click', nMonth);
        document.getElementById(UITags.lastMonth).addEventListener('click', lMonth);
    };

    function sortSch(p,n){
            return p.date < n.date ? -1 : p.date === n.date? p.timeStart < n.timeStart ? -1: p.timeStart === n.timeStart ? 0: 1: 1;
    }

    var addSchedule = function() {
        var input, createdSchedule;

        input = UICtrl.getUserInput();

        if (input.description !== "" && input.timeStart !== "" && input.timeEnd !== "" && input.date !== "") {

            if (input.timeStart < input.timeEnd){

                createdSchedule = DBCtrl.addDataSchedule(input.description, input.timeStart, input.timeEnd, input.date);
                //console.log(createdSchedule);

                activated = DBCtrl.getActiveData();

                UICtrl.addScheduleToUI(createdSchedule, activated);

                document.getElementById(UITags.deleteButton+createdSchedule.id).addEventListener('click', deleteSchedule);

            } else {
                alert("Error: begin time starts after end time.");
            };

        } else {
            alert("Error: Missing input(s)");
        };


    };

    var changeDay = function(event) {

        //Get current day
        currentDay = UICtrl.changeActiveDay(event);

        //if current day changes, change the schedule list. 
        if (currentDay !== undefined){
            //console.log(currentDay);

            // get the whole date based of the active day, should match database date
            thisDate = UICtrl.getTheDate(currentDay);

            //loop through all schedule in database and return the id of the ones that do not match the date and ones that do
            TheseSch = DBCtrl.matchDateToData(thisDate);

            //take the id match it to HTML and then add a class that hide display and if the date match and there is a hidden class remove it

            UICtrl.hideSchedule(TheseSch[0],TheseSch[1]);

            DBCtrl.storeActiveData(UICtrl.getTheMonth(), UICtrl.getTheYear(),currentDay);
        };
        
    };

    var nMonth = function() {
        activated = DBCtrl.getActiveData();
        UICtrl.changeMonthandYear('next', activated);

    };

    var lMonth = function() {
        activated = DBCtrl.getActiveData();
        UICtrl.changeMonthandYear('prev', activated);
    };

    var updateCurrentSchedule = function () {

        //[h,m,s,mo,d,y]; function(day,month,year)
        curDateData = UICtrl.digitalClock();
        matchDate = UICtrl.outsideFormatDate(curDateData[4],curDateData[3],curDateData[5],)
        //console.log('matchDate: ' + matchDate);
        matchTime = String(h+':'+m);
        //console.log('matchtime'+matchTime);

        document.getElementById(UITags.curSch).textContent = 'Current Schedule:';
        document.getElementById(UITags.nextSch).textContent = 'Next Schedule';
        schedules = DBCtrl.getUnfinishedSchedules();

        schedules.sort(sortSch);

        //matchSch = [];
        schedules.forEach(function(sche){
            if(sche.date === matchDate && sche.timeStart <= matchTime && sche.timeEnd > matchTime){
                //console.log('you made it in here')
                document.getElementById(UITags.curSch).innerHTML += '<br>' + document.getElementById('schedule-'+sche.id).textContent;

                //matchSch.push(sche.timeEnd);
            }
        });

        for (i = 0; i < schedules.length ;i++) {
            if (schedules[i].date > matchDate || (schedules[i].date >= matchDate && schedules[i].timeStart >= matchTime)) {
                d = schedules[i].date.split('-')

                document.getElementById(UITags.nextSch).innerHTML += '<br>' + document.getElementById('schedule-'+schedules[i].id).textContent + '(' +d[1] +'/'+d[2]+'/'+d[0]  + ')';
                break
            };
        };
        
        setTimeout(updateCurrentSchedule, 1000);

    };

    var deleteSchedule =  function(event){
        deleteID = parseInt(event.target.id.split('-')[2]);
        //console.log(deleteID);

        DBCtrl.deleteDataSch(deleteID);

        UICtrl.deleteUISch(deleteID);

    }

    return {
        init: function() {
            d = new Date();
            dayToMatch = d.getDate();

            document.getElementById(UITags.curMonth).textContent = monthss[d.getMonth()];
            document.getElementById(UITags.curYear).textContent = d.getFullYear();

            setupEventListeners();
            UICtrl.changeMonthandYear(null,[null,null,null]);
            updateCurrentSchedule();

            daysToLoop = document.getElementsByTagName('span');
            //console.log(daysToLoop);

            for (i = 0; i < daysToLoop.length; i++){
                theDay = parseInt(daysToLoop[i].textContent);

                theDay = theDay < 10 ? '0' + theDay: theDay;

                if (parseInt(theDay) === dayToMatch){
                    daysToLoop[i].classList.toggle('active');
                    DBCtrl.storeActiveData(UICtrl.getTheMonth(), UICtrl.getTheYear(),dayToMatch);
                    break
                }
            }

        }
    };
    
})(databaseControl,userInterfaceControl);

masterController.init();