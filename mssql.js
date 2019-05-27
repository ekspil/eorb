const sql = require('mssql');
const {config} = require('./conf');
// Create connection to database

const pool = new sql.ConnectionPool(config);
pool.connect(err => {
  if(err){
  console.log(err);
  }
})




async function register(timemsg) {
      try {
//console.log(sql.connect);


          let result1 = await pool.request()
              .input('restoran', sql.Int, timemsg.restoran)  //timemsg.checkNumber = element.unit;
              .query("INSERT INTO eotimers.dbo.timers (restoran, rbdateYear, rbdateMonth, rbdateDay, rbdatehhmmss, rbtimerValue, checkNumber) VALUES (@restoran, "+timemsg.dateYear+", "+timemsg.dateMonth+", "+timemsg.dateDay+", '"+timemsg.dateTime+"', "+timemsg.timerValue+", '"+timemsg.checkNumber+"');")

          //console.dir(result1)

          // Stored procedure

        //  let result2 = await pool.request()
        //      .input('input_parameter', sql.Int, value)
        //      .output('output_parameter', sql.VarChar(50))
        //      .execute(console.log('hello2'))
//
      //    console.dir(result2)
      }
      catch (err) {
        console.log(err);
          // ... error checks
      }


  sql.on('error', err => {
    console.log(err);
      // ... error handler
  })



}




exports.register = register;
