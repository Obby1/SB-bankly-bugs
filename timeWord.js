
function timeWord(time) {
  let minuteNums = ["", ' one', ' two', ' three', ' four', ' five', ' six', ' seven', ' eight', ' nine', ' ten', ' eleven', ' twelve', ' thirteen', ' fourteen', ' fifteen', ' sixteen', ' seventeen', ' eighteen', ' nineteen']
  let minuteTensNums = [``, '', ' twenty', ' thirty', ' fourty', ' fifty']
  let hourNums = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven']

  let timeString = time.split(':')
  let time1 = parseInt(timeString[0])
  let time2 = parseInt(timeString[1])
  let returnString = ``;
  returnString += hourNums[time1]

  if (time2 == 0){
    returnString += " o'clock";
  } else if (time2 < 10 && time2 > 0){
    returnString += ' oh';
    returnString += minuteNums[time2];
  } else if (time2 >= 10 && time2 <20){
    returnString += minuteNums[time2];
  } else if (time2 >= 20 && time2 <= 59){
      let time2TensNum = time2.toString().split('');
      if (time2TensNum[1] == 0 && time2TensNum[0] == 0){
        returnString += " o'clock";
      } else {
      returnString += minuteTensNums[time2TensNum[0]];
      returnString += minuteNums[time2TensNum[1]];
      }
  }

  if (time1 < 12){
    returnString += ' am'
  } else {
    returnString += ' pm'
  }
  
  if (time1 == '0' && time2 == '0'){
    return 'midnight';
  } else if (time1 == '12' && time2 == '0'){
    return 'noon';
  } else {
    return returnString
  }
}


module.exports = timeWord; 

// // alternative solution, untested:
//   function timeToWords(time) {
//     const hours = [
//         "twelve", "one", "two", "three", "four", "five",
//         "six", "seven", "eight", "nine", "ten", "eleven"
//     ];

//     const tens = ["oh", "ten", "twenty", "thirty", "forty", "fifty"];

//     const minutes = [
//         "zero", "one", "two", "three", "four", "five", "six", "seven",
//         "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
//         "sixteen", "seventeen", "eighteen", "nineteen"
//     ];

//     const [hour, minute] = time.split(':').map(Number);

//     if (hour === 0 && minute === 0) return "midnight";
//     if (hour === 12 && minute === 0) return "noon";

//     const hourWord = hours[hour % 12];
//     let minuteWord = "";

//     if (minute > 0) {
//         if (minute < 20) {
//             minuteWord = minutes[minute];
//         } else {
//             minuteWord = tens[Math.floor(minute / 10)] + (minute % 10 > 0 ? " " + minutes[minute % 10] : "");
//         }
//     } else {
//         minuteWord = "o'clock";
//     }

//     const period = hour < 12 ? "am" : "pm";

//     return `${hourWord} ${minuteWord} ${period}`;
// }
  
  
  