const { startHours, endHours } = require('./constants.js');

const express = require('express')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var cors = require('cors')
const app = express()
const port = 4000
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./mymernassignment-49515465f030');
const moment = require('moment');

app.use(cors({
  origin: ['http://localhost:3000']
}));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.get('/getEvents', async (req, res) => {
  const snapshot = await db.collection('bookings').get();
  let events = [];
  snapshot.forEach((doc) => {
  if (doc.data().date.toDate() >= new Date(req.query.startDate) && doc.data().date.toDate() <= new Date(req.query.endDate))
  {
    events.push({id: doc.id, date: doc.data().date.toDate(), time: doc.data().time, endTime:doc.data().endTime })
  }
  });
  res.send(events)
})

app.post('/newEvent',jsonParser ,async (req, res) => {
  if(moment(req.body.time, 'HH:mm') < moment(startHours, 'HH:mm') 
  || moment(req.body.endTime, 'HH:mm') > moment(endHours, 'HH:mm')){
    return res.status(400).send('Doctor is not Available');
  }
  let overLapped = false;
  const snapshot = await db.collection('bookings').get();
  snapshot.forEach((doc) => {
    if (new Date(req.body.date).getDate() == doc.data().date.toDate().getDate()){
  
      let momentStart = moment(req.body.time, "HH:mm")
      let momentEnd = moment(req.body.endTime, "HH:mm")
      if (momentStart >= moment(doc.data().endTime, "HH:mm") || momentEnd <=  moment(doc.data().time, "HH:mm")){
        
      }else {
        overLapped = true;
      }
    }
  });
  if (!overLapped){
    const dbRes = await db.collection('bookings').add({
      'date': new Date(req.body.date),
      'time': req.body.time,
      'endTime': req.body.endTime
    });
    return res.send(dbRes)
  }else{
    return res.send('Timeslot not availible')
  }
})

app.get('/allSlots', async (req, res) => {
  let x = {
    slotInterval: parseInt(req.query.timeDuration),
    openTime: startHours,
    closeTime: endHours
  };
  let startTime = moment(x.openTime, "HH:mm");
  let endTime = moment(x.closeTime, "HH:mm");
  let allTimes = [];
  let meetingTime = moment(startTime)
  meetingTime.add(req.query.timeDuration, 'minutes')
  while (meetingTime <= endTime) {
    allTimes.push(startTime.format("HH:mm")); 
    startTime.add(x.slotInterval, 'minutes');
    meetingTime = moment(startTime)
    meetingTime.add(req.query.timeDuration, 'minutes')
  }
  
  const snapshot = await db.collection('bookings').get();
  snapshot.forEach((doc) => {
    let previous = moment(allTimes[0], "HH:mm")
    previous.add(req.query.timeDiff, 'hours')
    let next = moment(allTimes[allTimes.length-1], "HH:mm")
    next.add(req.query.timeDiff, 'hours')
    let timeZoneDate = new Date(req.query.date)
    if (next > previous){
      timeZoneDate.setDate(timeZoneDate.getDate()-1);
    }
    if (next < previous){
      timeZoneDate.setDate(timeZoneDate.getDate()+1);
    }
    if (new Date(req.query.date).getDate() == doc.data().date.toDate().getDate() || timeZoneDate.getDate() == doc.data().date.toDate().getDate()){
      allTimes = allTimes.filter(function(item) {
      let momentItem = moment(item, "HH:mm")
      let endItem = moment(momentItem)
      endItem.add(req.query.timeDuration, 'minutes')
      return momentItem >= moment(doc.data().endTime, "HH:mm") || endItem <=  moment(doc.data().time, "HH:mm")
   })
    }
  });
  const sortedIntervals  = allTimes.sort()
  res.send(sortedIntervals)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})