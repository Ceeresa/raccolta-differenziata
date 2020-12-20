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
 * Get the raccolta from day.
 * @param {object} calendarData The calendar data. 
 * @param {int} weekDay The week day.
 * @returns Returns an array with all the raccolta for the given day.
 */
function getRaccoltaFromDay(calendarData, weekDay) {
  let output = [];
  for (let i = 0; i < calendarData.length; i++) {
    let currentData = calendarData[i];
    if (currentData.week_days.includes(weekDay)) {
      output.push(currentData.name);
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
  return WEEK_DAYS[index - 1];
}

/**
 * Populate the table with all the data
 * @param regione The regione.
 * @param provincia The provincia.
 * @param comune The comune.
 */
function populateTable(regione, provincia, comune) {
  let data = calendar[regione][provincia][comune];
  console.log('Data for the current comune', data);
  let calendarData = data.calendar;
  // Remove old data
  let $table = $(TABLE_ID);
  $table.empty();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDay = tomorrow.getDay();

  // Add a row for each week day (let's start with 1 and from Monday)
  for (let i = 1; i < WEEK_DAYS.length + 1; i++) {
    let raccolta = getRaccoltaFromDay(calendarData, i);
    let weekDay = getWeekDayByIndex(i);
    let classToAdd = '';
    if (i === tomorrowDay) {
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
