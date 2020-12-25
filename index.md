---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: index
title: "Calendario"
additional_scripts:
    - ./js/script.js
---
<div class="d-print-none">
    <div class="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h3>Visualizza velocemente il calendario della raccolta differenziata del tuo comune</h3>
        <h4><small class="text-muted text-right">da mobile e pronto da stampare</small></h4>
    </div>
    <div>
        <form novalidate>
            <div class="form-row">
                <div class="form-group col-md-4">
                    <label for="regione">Regione</label>
                    <select class="form-control" id="regione" name="regione">
                        <option value="" label="Seleziona la regione"></option>
                    </select>
                </div>
                <div class="form-group col-md-4">
                    <label for="provincia">Provincia</label>
                    <select class="form-control" id="provincia" name="provincia">
                        <option value="" label="Seleziona la provincia"></option>
                    </select>
                </div>
                <div class="form-group col-md-4">
                    <label for="comune">Comune</label>
                    <select class="form-control" id="comune" name="comune">
                        <option value="" label="Seleziona il comune"></option>
                    </select>
                </div>
            </div>
        </form>
    </div>
    <table id="raccolta-differenziata-calendar" class="table table-bordered">
    </table>
</div>

<!-- Spinner stuff -->
<div id="spinner" class="d-print-none">
    <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
    </div>
</div>
<div id="spinner-backdrop" class="d-print-none"></div>

<script>
    const calendar = {{ site.data.calendar | jsonify }}
</script>