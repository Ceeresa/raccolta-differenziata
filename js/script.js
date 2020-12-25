const SPINNER_ID = "#spinner"
const TABLE_ID = "#raccolta-differenziata-calendar";
const SPINNER_BACKDROP_ID = "#spinner-backdrop"
const WEEK_DAYS = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica"
];
const TODAY_DATE = new Date();


/**
 * Populate regioni.
 */
function populateRegioni() {
  let regioni = Object.keys(calendar);
  let $regione = $('#regione');
  for (let i = 0; i < regioni.length; i++) {
    let regione = regioni[i];
    $regione.append($('<option>', {
      value: regione,
      text: regione
    }));
  }
}

/**
 * Populate province.
 * @param selectedRegione The selected regione.
 */
function populateProvince(selectedRegione) {
  // Remove all the province
  let $provincia = $('#provincia');
  $provincia.find("option[value!='']").remove();

  var province = Object.keys(calendar[selectedRegione]);
  for (let i = 0; i < province.length; i++) {
    let provincia = province[i];
    $provincia.append($('<option>', {
      value: provincia,
      text: provincia
    }));
  }
}

/**
 * Populate comune.
 * @param regione The regione.
 * @param provincia The provincia.
 */
function populateComune(regione, provincia) {
  // Remove all the comune
  let $comune = $('#comune');
  resetComuneField();

  var comuni = Object.keys(calendar[regione][provincia]);
  for (let i = 0; i < comuni.length; i++) {
    let comune = comuni[i];
    $comune.append($('<option>', {
      value: comune,
      text: comune
    }));
  }
}

/**
 * Reset the comune field.
 */
function resetComuneField() {
  let $comune = $('#comune');
  $comune.find("option[value!='']").remove();
}

/**
 * Create date by period.
 * @param {string} period The period in the MM/DD format.
 * @returns Returns the date by the given format.
 */
function createDateByPeriod(period) {
  const year = TODAY_DATE.getFullYear();
  const splittedPeriod = period.split("/");
  const month = parseInt(splittedPeriod[1]) - 1;
  const day = parseInt(splittedPeriod[0]);
  return new Date(year, month, day);
}

/**
 * Create date by period, setting it to the previous millisecond of the following date.
 * @param {string} period The period in the MM/DD format.
 * @returns Returns the date by the given format.
 */
function createToDateByPeriod(period) {
  let toDate = createDateByPeriod(period);
  toDate.setDate(toDate.getDate() + 1);
  toDate.setMilliseconds(toDate.getMilliseconds() - 1);
  return toDate;
}

/**
 * Returns the week number for the given week day until untilDate.
 * @param {int} weekDay The week day. 
 * @param {Date} untilDate The date until calculate the week index.
 */
function calculateCurrentWeekIndex(weekDay, untilDate) {
  let date = new Date(untilDate.getTime());
  date.setDate(1);
  let weekIndex = 0;
  for (; date.getTime() <= untilDate.getTime(); date.setDate(date.getDate() + 1)) {
    let day = date.getDay() + 1;
    if (day === weekDay) {
      weekIndex++;
    }
  }

  return weekIndex;
}

/**
 * Get the raccolta from day.
 * @param {object} calendarData The calendar data. 
 * @param {int} weekDay The week day.
 * @param {date} currentDate The current date.
 * @returns Returns an array with all the raccolta for the given day.
 */
function getRaccoltaFromDay(calendarData, weekDay, currentDate) {
  let output = [];
  for (let i = 0; i < calendarData.length; i++) {
    let currentData = calendarData[i];
    if (currentData.week_days.includes(weekDay)) {

      if (currentData.week_periods) {
        // Check if the current week period is correct
        let weekPeriods = currentData.week_periods;
        for (let j = 0; j < weekPeriods.length; j++) {
          let weekPeriod = weekPeriods[j];
          let fromDate = createDateByPeriod(weekPeriod.from);
          let toDate = createToDateByPeriod(weekPeriod.to);

          // In the case the period is across two years, add a year to the to date
          if (toDate.getTime() <= fromDate.getTime()) {
            toDate.setFullYear(toDate.getFullYear() + 1);
          }

          if (TODAY_DATE.getTime() >= fromDate.getTime() && TODAY_DATE.getTime() <= toDate.getTime()) {
            console.debug('The current period is', weekPeriod, weekDay);
            // Calculate the week index for each week days
            let weekIndex = calculateCurrentWeekIndex(weekDay, currentDate);
            console.debug('weekIndex is', weekIndex);
            if (weekPeriod.week_index.includes(weekIndex)) {
              output.push(currentData.name);
            }
          }
        }
      } else {
        output.push(currentData.name);
      }
    }
  }
  return output;
}

/**
 * Get the week day by the index.
 * @param {int} i The index
 * @returns Returns the week day as string by the given index.
 */
function getWeekDayByIndex(index) {
  return WEEK_DAYS[index];
}

/**
 * Populate the table with all the data
 * @param regione The regione.
 * @param provincia The provincia.
 * @param comune The comune.
 */
function populateTable(regione, provincia, comune) {
  let data = calendar[regione][provincia][comune];
  console.debug('Data for the current comune', data);
  let calendarData = data.calendar;
  // Remove old data
  let $table = $(TABLE_ID);
  $table.empty();
  const tomorrow = new Date(TODAY_DATE);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDay = tomorrow.getDay();
  const lastDay = new Date(TODAY_DATE);
  lastDay.setDate(TODAY_DATE.getDate() + 6);

  // Add a row for each week day (let's start with 1 and from Monday)
  for (let currentDate = new Date(TODAY_DATE); currentDate.getTime() <= lastDay.getTime(); currentDate.setDate(currentDate.getDate() + 1)) {
    const day = currentDate.getDay();
    let raccolta = getRaccoltaFromDay(calendarData, day + 1, currentDate);
    let weekDay = getWeekDayByIndex(day);
    weekDay += ' ' + currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear();

    let classToAdd = '';
    if (day === tomorrowDay) {
      classToAdd = 'table-active';
      weekDay += ' (domani)';
    }
    $table.append(
      $('<tr>', {class: classToAdd}).append([$('<th>', {
        text: weekDay
      }),
      $('<td>', {
        text: raccolta.join(', ')
      })])
    );
  }

  // Add more info link
  $table.append(
    $('<tr>').append([$('<th>', {
      text: 'Maggiori informazioni'
    }),
    $('<td>').append(
      $('<a>', {
        href: data.url,
        text: data.url
      })
    )])
  );
}

/**
 * Init the application.
 */
function init(){
  showLoader();
  populateRegioni();

  // Add event listeners

  // Regione
  $("#regione").on('change', function() {
    // Set the province
    populateProvince(this.value);

    // Reset the comune field
    resetComuneField();
  });

  // Provincia
  $("#provincia").on('change', function() {
    // Set the province
    populateComune($("#regione").val(), this.value);
  });

  // Comune
  $("#comune").on('change', function() {
    // Set the table
    populateTable($("#regione").val(), $("#provincia").val(), this.value);
  });

  hideLoader();
}

/**
 * Show the loader.
 */
function showLoader() {
  $(SPINNER_ID).removeClass('d-none');
  $(SPINNER_BACKDROP_ID).removeClass('d-none');
}

/**
 * Hide the loader.
 */
function hideLoader() {
  $(SPINNER_ID).addClass('d-none');
  $(SPINNER_BACKDROP_ID).addClass('d-none');
}


$(function() {
  init();
});
