$(function () {


    // ------------------------------------------------------- //
    // Sidebar
    // ------------------------------------------------------ //
    $('.sidebar-toggler').on('click', function () {
        $('.sidebar').toggleClass('shrink show');
    });



    // ------------------------------------------------------ //
    // For demo purposes, can be deleted
    // ------------------------------------------------------ //

    var stylesheet = $('link#theme-stylesheet');
    $( "<link id='new-stylesheet' rel='stylesheet'>" ).insertAfter(stylesheet);
    var alternateColour = $('link#new-stylesheet');

    if ($.cookie("theme_csspath")) {
        alternateColour.attr("href", $.cookie("theme_csspath"));
    }

    $("#colour").change(function () {

        if ($(this).val() !== '') {

            var theme_csspath = 'css/style.' + $(this).val() + '.css';

            alternateColour.attr("href", theme_csspath);

            $.cookie("theme_csspath", theme_csspath, { expires: 365, path: document.URL.substr(0, document.URL.lastIndexOf('/')) });

        }

        return false;
    });

    const conf = {
        endpoint: 'https://sample-lrs-paiseze.lrs.io/xapi/',
        auth: 'Basic ' + toBase64('username:password'),
    };

    ADL.XAPIWrapper.changeConfig(conf);

    window.fetchStataments = function () {
        const parameters = ADL.XAPIWrapper.searchParams();

        parameters['verb'] = 'http://adlnet.gov/expapi/verbs/initialized';
        parameters['activity'] = 'https://www.coursera.org/learn/machine-learning/1';

        const queryData = ADL.XAPIWrapper.getStatements(parameters);

        if (queryData.statements && queryData.statements.length > 1) {
            let list = [];

            queryData.statements.forEach(function(x, i) {
                list.push(`
                    <div class="d-flex justify-content-between align-items-start align-items-sm-center mb-4 flex-column flex-sm-row">
                      <div class="left d-flex align-items-center">
                        <div class="text">
                          <h6 class="mb-0 d-flex align-items-center"> <span>${x.actor && x.actor.name || 'Bilinmeyen Birisi'}</span><span class="dot dot-sm ml-2 mr-2 bg-violet"></span> ${x.object.definition.description['en-US']}</h6><small class="text-gray">${new Date(x.timestamp).toLocaleString()}</small>
                        </div>
                      </div>
                      <div class="right ml-5 ml-sm-0 pl-3 pl-sm-0 text-violet">
                        <h5>${x.verb.display['en-US']}</h5>
                      </div>
                    </div>
                `.trim());
            });

            let eventList = document.getElementById('event-list');

            if (eventList) {
                eventList.innerHTML = list.join('\n');
            }
        }

        setTimeout(window.fetchStataments, 1000);
    };

    fetchStataments();

});


Cookies.set('active', 'true');
